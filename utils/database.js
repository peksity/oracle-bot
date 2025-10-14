/**
 * ═══════════════════════════════════════════════════════════════
 * DATABASE HANDLER
 * ═══════════════════════════════════════════════════════════════
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Initialize database connection
   */
  async connect() {
    try {
      // Create connection pool
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      // Test connection
      const connection = await this.pool.getConnection();
      console.log('✅ Database connected successfully');
      connection.release();
      
      this.isConnected = true;
      
      // Initialize schema if needed
      await this.initializeSchema();
      
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Initialize database schema
   */
  async initializeSchema() {
    try {
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split into individual statements
        const statements = schema
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of statements) {
          try {
            await this.pool.query(statement);
          } catch (error) {
            // Ignore "already exists" errors
            if (!error.message.includes('already exists')) {
              console.error('Schema error:', error.message);
            }
          }
        }
        
        console.log('✅ Database schema initialized');
      }
    } catch (error) {
      console.error('❌ Schema initialization failed:', error);
    }
  }

  /**
   * Execute query
   */
  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Get single row
   */
  async get(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0] || null;
  }

  /**
   * Insert and return ID
   */
  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    
    return result.insertId;
  }

  /**
   * Update records
   */
  async update(table, data, where, whereParams = []) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const result = await this.query(sql, [...values, ...whereParams]);
    
    return result.affectedRows;
  }

  /**
   * Delete records
   */
  async delete(table, where, whereParams = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const result = await this.query(sql, whereParams);
    
    return result.affectedRows;
  }

  /**
   * Upsert (insert or update)
   */
  async upsert(table, data, updateData = null) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const updateClause = updateData 
      ? Object.keys(updateData).map(k => `${k} = ?`).join(', ')
      : keys.filter(k => k !== 'id').map(k => `${k} = VALUES(${k})`).join(', ');
    
    const sql = `
      INSERT INTO ${table} (${keys.join(', ')}) 
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE ${updateClause}
    `;
    
    const params = updateData 
      ? [...values, ...Object.values(updateData)]
      : values;
    
    const result = await this.query(sql, params);
    return result.insertId || result.affectedRows;
  }

  /**
   * Close connection
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('Database connection closed');
    }
  }
}

// Create singleton instance
const db = new Database();

module.exports = db;
