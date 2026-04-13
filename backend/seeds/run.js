const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

async function runSeeds() {
  try {
    console.log('Running database seeds...\n');
    
    // Check if admin exists
    const adminCheck = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    
    if (adminCheck.rows.length === 0) {
      console.log('Creating admin user...');
      
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      await query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        process.env.ADMIN_EMAIL || 'admin@starfields.com.ph',
        passwordHash,
        'Admin',
        'User',
        'admin',
        true,
        true
      ]);
      
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }
    
    // Seed sample property categories and types
    console.log('\nSeeding property types...');
    
    const residentialId = await query("SELECT id FROM property_categories WHERE slug = 'residential'");
    if (residentialId.rows.length > 0) {
      const types = [
        { name: 'House & Lot', slug: 'house-and-lot' },
        { name: 'Condominium', slug: 'condominium' },
        { name: 'Townhouse', slug: 'townhouse' },
        { name: 'Apartment', slug: 'apartment' },
        { name: 'Raw Lot', slug: 'raw-lot' }
      ];
      
      for (const type of types) {
        await query(`
          INSERT INTO property_types (category_id, name, slug)
          VALUES ($1, $2, $3)
          ON CONFLICT (category_id, slug) DO NOTHING
        `, [residentialId.rows[0].id, type.name, type.slug]);
      }
    }
    
    const commercialId = await query("SELECT id FROM property_categories WHERE slug = 'commercial'");
    if (commercialId.rows.length > 0) {
      const types = [
        { name: 'Office Space', slug: 'office-space' },
        { name: 'Retail Space', slug: 'retail-space' },
        { name: 'Warehouse', slug: 'warehouse' },
        { name: 'Commercial Lot', slug: 'commercial-lot' }
      ];
      
      for (const type of types) {
        await query(`
          INSERT INTO property_types (category_id, name, slug)
          VALUES ($1, $2, $3)
          ON CONFLICT (category_id, slug) DO NOTHING
        `, [commercialId.rows[0].id, type.name, type.slug]);
      }
    }
    
    console.log('✓ Property types seeded');
    
    console.log('\n✓ Seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

runSeeds();
