// server.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// 2. Import your database connection pool
const pool = require('./db'); 

// 3. Initialize the Express application
const app = express();

// 4. Set up Middleware
// Enable CORS so your React frontend (running on a different port) can talk to this backend
app.use(cors()); 
// Allow the server to parse incoming JSON data from requests
app.use(express.json()); 

// 5. Define API Routes

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the EduSync Backend API!" });
});

// A test route to check the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: "Database connected successfully!", 
      currentTime: result.rows[0].now 
    });
  } catch (err) {
    console.error("Database test failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Database mein mojud tamam tables check karne ka route
app.get('/api/check-tables', async (req, res) => {
  try {
    // Yeh query database se sirf un tables ke naam layegi jo 'public' schema mein hain
    const queryText = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
    const result = await pool.query(queryText);
    
    // Sirf table ke naam (names) extract kar rahe hain
    const tableNames = result.rows.map(row => row.table_name);

    res.json({ 
      success: true, 
      message: "Database mein yeh tables mojud hain:", 
      tables: tableNames,
      total_tables: tableNames.length
    });
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- LOGIN API ROUTE ---
app.post('/api/login', async (req, res) => {
  // 1. Frontend se aane wala data receive karein
  const { email, password, role } = req.body;

  try {
    // 2. Database mein user ko Email se dhoondein
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    // Agar user nahi mila
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = result.rows[0];


    // 3. Role Check karein (Frontend par jo tab select hua hai, wo DB role se match hona chahiye)
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(401).json({ success: false, message: `You are not registered as a ${role}` });
    }

    // 4. Password Check karein 
    // (Note: Abhi humne sample data mein plain text dala tha, isliye direct check kar rahe hain. 
    // Real app mein yahan bcrypt.compare() use hoga)
    if (user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 5. Agar sab theek hai, toh decide karein ke kis page par bhejna hai
    let redirectUrl = '';
    if (user.role === 'Admin') redirectUrl = '/admin/dashboard';
    else if (user.role === 'Teacher') redirectUrl = '/teacher/dashboard';
    else if (user.role === 'Student') redirectUrl = '/student/dashboard';

    // 6. Frontend ko Success bhej dein
    res.json({ 
      success: true, 
      message: 'Login successful!',
      user: { id: user.user_id, email: user.email, role: user.role },
      redirectUrl: redirectUrl 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// --- GET ALL STUDENTS API ROUTE ---
app.get('/api/students', async (req, res) => {
  try {
    // Database se tamam students ka data nikal rahe hain, naye students pehle aayenge
    const query = 'SELECT * FROM students ORDER BY student_id DESC';
    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, message: 'Server error while fetching students.' });
  }
});

// --- GET ALL TEACHERS API ROUTE ---
app.get('/api/teachers', async (req, res) => {
  try {
    const query = 'SELECT * FROM teachers ORDER BY teacher_id DESC';
    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ success: false, message: 'Server error while fetching teachers.' });
  }
});

// --- Add your actual application routes here later ---
// Example:
// app.use('/api/students', require('./routes/studentRoutes'));
// app.use('/api/teachers', require('./routes/teacherRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});

// Today we make the student and teacher view dynamic with our database