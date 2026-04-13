const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get all properties with filters
exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      listingType,
      propertyType,
      region,
      province,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status = 'active',
      featured,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        pc.name as category_name,
        pt.name as property_type_name,
        u.first_name as owner_first_name,
        u.last_name as owner_last_name,
        u.avatar_url as owner_avatar,
        r.name as region_name,
        prov.name as province_name,
        c.name as city_name,
        b.name as barangay_name,
        (SELECT url FROM property_images WHERE property_id = p.id AND is_main = true LIMIT 1) as main_image
      FROM properties p
      LEFT JOIN property_categories pc ON p.property_type_id = pc.id
      LEFT JOIN property_types pt ON p.property_type_id = pt.id
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN provinces prov ON p.province_id = prov.id
      LEFT JOIN cities c ON p.city_id = c.id
      LEFT JOIN barangays b ON p.barangay_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (search) {
      sql += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.address ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (listingType) {
      sql += ` AND p.listing_type = $${paramIndex++}`;
      params.push(listingType);
    }
    
    if (propertyType) {
      sql += ` AND pt.slug = $${paramIndex++}`;
      params.push(propertyType);
    }
    
    if (region) {
      sql += ` AND r.code = $${paramIndex++}`;
      params.push(region);
    }
    
    if (province) {
      sql += ` AND prov.id = $${paramIndex++}`;
      params.push(province);
    }
    
    if (city) {
      sql += ` AND c.id = $${paramIndex++}`;
      params.push(city);
    }
    
    if (minPrice) {
      sql += ` AND p.price >= $${paramIndex++}`;
      params.push(minPrice);
    }
    
    if (maxPrice) {
      sql += ` AND p.price <= $${paramIndex++}`;
      params.push(maxPrice);
    }
    
    if (bedrooms) {
      sql += ` AND p.bedrooms >= $${paramIndex++}`;
      params.push(bedrooms);
    }
    
    if (bathrooms) {
      sql += ` AND p.bathrooms >= $${paramIndex++}`;
      params.push(bathrooms);
    }
    
    if (featured === 'true') {
      sql += ` AND p.is_featured = true AND (p.featured_until IS NULL OR p.featured_until > CURRENT_TIMESTAMP)`;
    }
    
    // Sort
    const validSortColumns = ['created_at', 'price', 'view_count', 'title'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY p.${sortColumn} ${order}`;
    
    // Count query
    const countSql = sql.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) FROM').replace(/ORDER BY.*$/, '');
    const countResult = await query(countSql, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    // Increment view count (async, don't wait)
    if (req.user) {
      result.rows.forEach(row => {
        query('UPDATE properties SET view_count = view_count + 1 WHERE id = $1', [row.id]);
      });
    }
    
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

// Get single property
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const propertyResult = await query(
      `SELECT 
        p.*,
        pc.name as category_name,
        pt.name as property_type_name,
        u.first_name as owner_first_name,
        u.last_name as owner_last_name,
        u.avatar_url as owner_avatar,
        u.phone as owner_phone,
        u.email as owner_email,
        r.name as region_name,
        prov.name as province_name,
        c.name as city_name,
        b.name as barangay_name
      FROM properties p
      LEFT JOIN property_categories pc ON p.property_type_id = pc.id
      LEFT JOIN property_types pt ON p.property_type_id = pt.id
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN provinces prov ON p.province_id = prov.id
      LEFT JOIN cities c ON p.city_id = c.id
      LEFT JOIN barangays b ON p.barangay_id = b.id
      WHERE p.id = $1`,
      [id]
    );
    
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const property = propertyResult.rows[0];
    
    // Get images
    const imagesResult = await query(
      'SELECT * FROM property_images WHERE property_id = $1 ORDER BY is_main DESC, sort_order',
      [id]
    );
    
    // Get documents
    const documentsResult = await query(
      'SELECT * FROM property_documents WHERE property_id = $1',
      [id]
    );
    
    // Get reviews
    const reviewsResult = await query(
      `SELECT r.*, u.first_name, u.last_name, u.avatar_url 
       FROM property_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.property_id = $1 AND r.status = 'approved'
       ORDER BY r.created_at DESC`,
      [id]
    );
    
    // Get review stats
    const reviewStats = await query(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating)::numeric(3,2) as average_rating
       FROM property_reviews 
       WHERE property_id = $1 AND status = 'approved'`,
      [id]
    );
    
    // Check if favorited by current user
    let isFavorited = false;
    if (req.user) {
      const favoriteResult = await query(
        'SELECT id FROM user_favorites WHERE user_id = $1 AND property_id = $2',
        [req.user.id, id]
      );
      isFavorited = favoriteResult.rows.length > 0;
    }
    
    // Increment view count
    await query('UPDATE properties SET view_count = view_count + 1 WHERE id = $1', [id]);
    
    res.json({
      property: {
        ...property,
        images: imagesResult.rows,
        documents: documentsResult.rows,
        reviews: reviewsResult.rows,
        reviewStats: reviewStats.rows[0],
        isFavorited
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch property', error: error.message });
  }
};

// Create property
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyTypeId,
      listingType,
      price,
      pricePerSqm,
      address,
      regionId,
      provinceId,
      cityId,
      barangayId,
      latitude,
      longitude,
      lotArea,
      floorArea,
      bedrooms,
      bathrooms,
      parkingSlots,
      floors,
      yearBuilt,
      features,
      amenities,
      isNegotiable
    } = req.body;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    
    const result = await query(
      `INSERT INTO properties (
        title, slug, description, property_type_id, listing_type, owner_id,
        price, price_per_sqm, currency, is_negotiable,
        address, region_id, province_id, city_id, barangay_id, latitude, longitude,
        lot_area, floor_area, bedrooms, bathrooms, parking_slots, floors, year_built,
        features, amenities, status, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        title, slug, description, propertyTypeId, listingType, req.user.id,
        price, pricePerSqm, 'PHP', isNegotiable,
        address, regionId, provinceId, cityId, barangayId, latitude, longitude,
        lotArea, floorArea, bedrooms, bathrooms, parkingSlots, floors, yearBuilt,
        JSON.stringify(features || []), JSON.stringify(amenities || []), 'active'
      ]
    );
    
    res.status(201).json({
      message: 'Property created successfully',
      property: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create property', error: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check ownership
    const ownerCheck = await query('SELECT owner_id FROM properties WHERE id = $1', [id]);
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (ownerCheck.rows[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    const allowedFields = [
      'title', 'description', 'price', 'price_per_sqm', 'is_negotiable',
      'address', 'region_id', 'province_id', 'city_id', 'barangay_id',
      'latitude', 'longitude', 'lot_area', 'floor_area', 'bedrooms', 'bathrooms',
      'parking_slots', 'floors', 'year_built', 'features', 'amenities', 'status'
    ];
    
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    
    for (const [key, value] of Object.entries(updates)) {
      const dbField = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (allowedFields.includes(dbField)) {
        setClauses.push(`${dbField} = $${paramIndex++}`);
        values.push(typeof value === 'object' ? JSON.stringify(value) : value);
      }
    }
    
    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    values.push(id);
    
    const result = await query(
      `UPDATE properties SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    res.json({
      message: 'Property updated successfully',
      property: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update property', error: error.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ownership
    const ownerCheck = await query('SELECT owner_id FROM properties WHERE id = $1', [id]);
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (ownerCheck.rows[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    
    await query('DELETE FROM properties WHERE id = $1', [id]);
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete property', error: error.message });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existing = await query(
      'SELECT id FROM user_favorites WHERE user_id = $1 AND property_id = $2',
      [userId, id]
    );
    
    if (existing.rows.length > 0) {
      await query('DELETE FROM user_favorites WHERE id = $1', [existing.rows[0].id]);
      await query('UPDATE properties SET favorite_count = favorite_count - 1 WHERE id = $1', [id]);
      res.json({ message: 'Removed from favorites', isFavorited: false });
    } else {
      await query(
        'INSERT INTO user_favorites (user_id, property_id) VALUES ($1, $2)',
        [userId, id]
      );
      await query('UPDATE properties SET favorite_count = favorite_count + 1 WHERE id = $1', [id]);
      res.json({ message: 'Added to favorites', isFavorited: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle favorite', error: error.message });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, review } = req.body;
    const userId = req.user.id;
    
    // Check if user has already reviewed
    const existing = await query(
      'SELECT id FROM property_reviews WHERE property_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'You have already reviewed this property' });
    }
    
    const result = await query(
      'INSERT INTO property_reviews (property_id, user_id, rating, title, review) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, userId, rating, title, review]
    );
    
    res.status(201).json({
      message: 'Review submitted successfully',
      review: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};
