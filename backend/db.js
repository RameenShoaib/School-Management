// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Neon database ke liye connection pool banayen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true, // Neon ke liye SSL zaroori hai
  },
});

// Connection test karne ke liye
pool.connect()
  .then(() => console.log("✅ Neon Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;