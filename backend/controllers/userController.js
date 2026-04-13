const { query } = require('../config/database');

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, uf.created_at as favorited_at,
        (SELECT url FROM property_images WHERE property_id = p.id AND is_main = true LIMIT 1) as main_image
       FROM user_favorites uf
       JOIN properties p ON uf.property_id = p.id
       WHERE uf.user_id = $1 AND p.status = 'active'
       ORDER BY uf.created_at DESC`,
      [req.user.id]
    );
    
    res.json({ favorites: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
};

// Get user properties (for sellers/agents)
exports.getUserProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let sql = `
      SELECT p.*,
        (SELECT url FROM property_images WHERE property_id = p.id AND is_main = true LIMIT 1) as main_image,
        (SELECT COUNT(*) FROM property_reviews WHERE property_id = p.id) as review_count
      FROM properties p
      WHERE p.owner_id = $1
    `;
    
    const params = [req.user.id];
    let paramIndex = 2;
    
    if (status) {
      sql += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }
    
    sql += ` ORDER BY p.created_at DESC`;
    
    const countSql = sql.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) FROM').replace(/ORDER BY.*$/, '');
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].count);
    
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    res.json({
      properties: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let stats = {};
    
    // Common stats
    const favoritesCount = await query(
      'SELECT COUNT(*) FROM user_favorites WHERE user_id = $1',
      [userId]
    );
    
    stats.favoritesCount = parseInt(favoritesCount.rows[0].count);
    
    // Agent/Seller specific stats
    if (['agent', 'seller', 'property_manager', 'unit_manager'].includes(role)) {
      const [propertiesCount, activeListings, totalViews] = await Promise.all([
        query('SELECT COUNT(*) FROM properties WHERE owner_id = $1', [userId]),
        query("SELECT COUNT(*) FROM properties WHERE owner_id = $1 AND status = 'active'", [userId]),
        query('SELECT COALESCE(SUM(view_count), 0) FROM properties WHERE owner_id = $1', [userId])
      ]);
      
      stats.propertiesCount = parseInt(propertiesCount.rows[0].count);
      stats.activeListings = parseInt(activeListings.rows[0].count);
      stats.totalViews = parseInt(totalViews.rows[0].coalesce);
      
      // Leads stats
      const leadsStats = await query(
        `SELECT 
          COUNT(*) as total_leads,
          COUNT(*) FILTER (WHERE status = 'new') as new_leads,
          COUNT(*) FILTER (WHERE status = 'converted') as converted_leads
         FROM leads WHERE assigned_to = $1`,
        [userId]
      );
      
      stats.leads = leadsStats.rows[0];
    }
    
    // Bookings stats
    const [hotelBookings, tourBookings] = await Promise.all([
      query('SELECT COUNT(*) FROM hotel_bookings WHERE user_id = $1', [userId]),
      query('SELECT COUNT(*) FROM tour_bookings WHERE user_id = $1', [userId])
    ]);
    
    stats.hotelBookings = parseInt(hotelBookings.rows[0].count);
    stats.tourBookings = parseInt(tourBookings.rows[0].count);
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/images/${req.file.filename}`;
    
    await query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [avatarUrl, req.user.id]
    );
    
    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload avatar', error: error.message });
  }
};

// Search users (for agents)
exports.searchUsers = async (req, res) => {
  try {
    const { q, role, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    let sql = `
      SELECT id, email, first_name, last_name, role, avatar_url, company_name
      FROM users
      WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)
      AND is_active = true
    `;
    
    const params = [`%${q}%`];
    let paramIndex = 2;
    
    if (role) {
      sql += ` AND role = $${paramIndex++}`;
      params.push(role);
    }
    
    sql += ` ORDER BY first_name, last_name LIMIT $${paramIndex++}`;
    params.push(limit);
    
    const result = await query(sql, params);
    
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
