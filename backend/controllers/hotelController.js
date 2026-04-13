const { query } = require('../config/database');

// Get all hotels
exports.getHotels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      region,
      province,
      city,
      starRating,
      minPrice,
      maxPrice,
      checkIn,
      checkOut,
      guests,
      featured,
      sortBy = 'created_at'
    } = req.query;
    
    let sql = `
      SELECT 
        h.*,
        r.name as region_name,
        p.name as province_name,
        c.name as city_name,
        MIN(rt.base_price) as min_price,
        MAX(rt.base_price) as max_price,
        AVG(pr.rating)::numeric(3,2) as avg_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM hotels h
      LEFT JOIN regions r ON h.region_id = r.id
      LEFT JOIN provinces p ON h.province_id = p.id
      LEFT JOIN cities c ON h.city_id = c.id
      LEFT JOIN hotel_room_types rt ON rt.hotel_id = h.id
      LEFT JOIN hotel_bookings hb ON hb.hotel_id = h.id
      LEFT JOIN property_reviews pr ON pr.related_type = 'hotel' AND pr.related_id = h.id
      WHERE h.status = 'active'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (search) {
      sql += ` AND (h.name ILIKE $${paramIndex} OR h.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (region) {
      sql += ` AND r.code = $${paramIndex++}`;
      params.push(region);
    }
    
    if (province) {
      sql += ` AND h.province_id = $${paramIndex++}`;
      params.push(province);
    }
    
    if (city) {
      sql += ` AND h.city_id = $${paramIndex++}`;
      params.push(city);
    }
    
    if (starRating) {
      sql += ` AND h.star_rating = $${paramIndex++}`;
      params.push(starRating);
    }
    
    if (featured === 'true') {
      sql += ` AND h.is_featured = true`;
    }
    
    sql += ` GROUP BY h.id, r.name, p.name, c.name`;
    
    if (minPrice) {
      sql += ` HAVING MIN(rt.base_price) >= $${paramIndex++}`;
      params.push(minPrice);
    }
    
    if (maxPrice) {
      sql += params.length > 0 ? ` AND ` : ` HAVING `;
      sql += `MAX(rt.base_price) <= $${paramIndex++}`;
      params.push(maxPrice);
    }
    
    sql += ` ORDER BY h.${sortBy} DESC`;
    
    // Count query
    const countResult = await query(`SELECT COUNT(*) FROM (${sql}) as count_query`, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    res.json({
      hotels: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hotels', error: error.message });
  }
};

// Get single hotel
exports.getHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    
    const hotelResult = await query(
      `SELECT h.*, r.name as region_name, p.name as province_name, c.name as city_name
       FROM hotels h
       LEFT JOIN regions r ON h.region_id = r.id
       LEFT JOIN provinces p ON h.province_id = p.id
       LEFT JOIN cities c ON h.city_id = c.id
       WHERE h.id = $1`,
      [id]
    );
    
    if (hotelResult.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    const hotel = hotelResult.rows[0];
    
    // Get room types with availability
    const roomsResult = await query(
      `SELECT rt.*, 
        (SELECT COUNT(*) FROM hotel_rooms WHERE room_type_id = rt.id AND status = 'available') as available_rooms
       FROM hotel_room_types rt
       WHERE rt.hotel_id = $1 AND rt.is_active = true`,
      [id]
    );
    
    // Get reviews
    const reviewsResult = await query(
      `SELECT pr.*, u.first_name, u.last_name, u.avatar_url
       FROM property_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.property_id = $1 AND pr.status = 'approved'
       ORDER BY pr.created_at DESC
       LIMIT 10`,
      [id]
    );
    
    res.json({
      hotel: {
        ...hotel,
        roomTypes: roomsResult.rows,
        reviews: reviewsResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hotel', error: error.message });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, roomTypeId, checkInDate, checkOutDate, adults, children, guestNames, specialRequests } = req.body;
    
    // Generate booking code
    const bookingCode = 'HTL' + Date.now().toString(36).toUpperCase();
    
    // Get room type price
    const roomResult = await query('SELECT base_price FROM hotel_room_types WHERE id = $1', [roomTypeId]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    const roomPrice = roomResult.rows[0].base_price;
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = roomPrice * nights;
    
    const result = await query(
      `INSERT INTO hotel_bookings (
        booking_code, user_id, hotel_id, room_type_id,
        check_in_date, check_out_date, nights,
        adults, children, guest_names, special_requests,
        room_price, total_amount, final_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        bookingCode, req.user.id, hotelId, roomTypeId,
        checkInDate, checkOutDate, nights,
        adults, children, JSON.stringify(guestNames), specialRequests,
        roomPrice, totalAmount, totalAmount
      ]
    );
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const result = await query(
      `SELECT hb.*, h.name as hotel_name, h.main_image_url, rt.name as room_type_name
       FROM hotel_bookings hb
       JOIN hotels h ON hb.hotel_id = h.id
       JOIN hotel_room_types rt ON hb.room_type_id = rt.id
       WHERE hb.user_id = $1
       ORDER BY hb.created_at DESC`,
      [req.user.id]
    );
    
    res.json({ bookings: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Check room availability
exports.checkAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut } = req.query;
    
    const result = await query(
      `SELECT rt.id, rt.name, rt.max_occupancy, rt.base_price,
        (SELECT COUNT(*) FROM hotel_rooms WHERE room_type_id = rt.id) as total_rooms,
        (SELECT COUNT(*) FROM hotel_bookings 
         WHERE room_type_id = rt.id 
         AND status IN ('confirmed', 'checked_in')
         AND (check_in_date <= $2 AND check_out_date >= $1)) as booked_rooms
       FROM hotel_room_types rt
       WHERE rt.hotel_id = $3 AND rt.is_active = true`,
      [checkIn, checkOut, hotelId]
    );
    
    const availability = result.rows.map(row => ({
      ...row,
      available_rooms: row.total_rooms - row.booked_rooms,
      is_available: row.total_rooms > row.booked_rooms
    }));
    
    res.json({ availability });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check availability', error: error.message });
  }
};
