const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('Starting database migrations...\n');
    
    // Create migrations tracking table
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get list of migration files
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get executed migrations
    const executedResult = await query('SELECT filename FROM migrations');
    const executedFiles = executedResult.rows.map(row => row.filename);
    
    let executed = 0;
    
    for (const file of migrationFiles) {
      if (executedFiles.includes(file)) {
        console.log(`✓ ${file} (already executed)`);
        continue;
      }
      
      console.log(`→ Executing ${file}...`);
      
      const filePath = path.join(__dirname, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      try {
        await query(sql);
        await query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        console.log(`✓ ${file} executed successfully\n`);
        executed++;
      } catch (error) {
        console.error(`✗ Error executing ${file}:`, error.message);
        process.exit(1);
      }
    }
    
    console.log(`\n✓ Migrations completed. ${executed} new migration(s) executed.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
