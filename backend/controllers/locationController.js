const { query } = require('../config/database');

// Get all regions
exports.getRegions = async (req, res) => {
  try {
    const result = await query('SELECT * FROM regions ORDER BY name');
    res.json({ regions: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch regions', error: error.message });
  }
};

// Get provinces by region
exports.getProvinces = async (req, res) => {
  try {
    const { regionId } = req.params;
    const result = await query(
      'SELECT * FROM provinces WHERE region_id = $1 ORDER BY name',
      [regionId]
    );
    res.json({ provinces: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch provinces', error: error.message });
  }
};

// Get cities by province
exports.getCities = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const result = await query(
      'SELECT * FROM cities WHERE province_id = $1 ORDER BY name',
      [provinceId]
    );
    res.json({ cities: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cities', error: error.message });
  }
};

// Get barangays by city
exports.getBarangays = async (req, res) => {
  try {
    const { cityId } = req.params;
    const result = await query(
      'SELECT * FROM barangays WHERE city_id = $1 ORDER BY name',
      [cityId]
    );
    res.json({ barangays: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch barangays', error: error.message });
  }
};

// Get full location hierarchy
exports.getLocationHierarchy = async (req, res) => {
  try {
    const regionsResult = await query(`
      SELECT 
        r.id, r.name, r.code, r.island_group,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', p.id, 
            'name', p.name,
            'cities', (
              SELECT json_agg(
                jsonb_build_object('id', c.id, 'name', c.name, 'type', c.type)
              )
              FROM cities c WHERE c.province_id = p.id
            )
          )
        ) FILTER (WHERE p.id IS NOT NULL) as provinces
      FROM regions r
      LEFT JOIN provinces p ON p.region_id = r.id
      GROUP BY r.id, r.name, r.code, r.island_group
      ORDER BY r.name
    `);
    
    res.json({ hierarchy: regionsResult.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch location hierarchy', error: error.message });
  }
};

// Search locations
exports.searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const searchTerm = `%${q}%`;
    
    const [cities, provinces] = await Promise.all([
      query(
        `SELECT c.id, c.name, c.type, p.name as province_name, r.name as region_name
         FROM cities c
         JOIN provinces p ON c.province_id = p.id
         JOIN regions r ON p.region_id = r.id
         WHERE c.name ILIKE $1
         ORDER BY c.name
         LIMIT 20`,
        [searchTerm]
      ),
      query(
        `SELECT p.id, p.name, r.name as region_name
         FROM provinces p
         JOIN regions r ON p.region_id = r.id
         WHERE p.name ILIKE $1
         ORDER BY p.name
         LIMIT 10`,
        [searchTerm]
      )
    ]);
    
    res.json({
      cities: cities.rows,
      provinces: provinces.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
