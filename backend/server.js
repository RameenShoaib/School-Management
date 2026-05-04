// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

// ==========================================
// 🛠️ DATABASE TABLES INITIALIZATION (PERMANENT)
// ==========================================
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classes (
        class_id SERIAL PRIMARY KEY,
        grade VARCHAR(50) NOT NULL,
        section VARCHAR(50) NOT NULL,
        max_capacity INTEGER,
        room_number VARCHAR(50),
        academic_year VARCHAR(50),
        notes TEXT,
        teacher_name VARCHAR(100),
        co_teacher VARCHAR(100),
        subjects TEXT[],
        start_time TIME,
        end_time TIME,
        att_tracking BOOLEAN DEFAULT true,
        gradebook BOOLEAN DEFAULT true,
        portal_access BOOLEAN DEFAULT true,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects_table (
        subject_id SERIAL PRIMARY KEY,
        subject_name VARCHAR(100) NOT NULL,
        subject_code VARCHAR(50),
        grade_level VARCHAR(50),
        subject_category VARCHAR(50),
        teacher_name VARCHAR(100),
        weekly_periods INTEGER,
        credit_hours INTEGER,
        is_elective BOOLEAN DEFAULT false,
        has_lab BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        attendance_id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Holiday')),
        remarks TEXT,
        marked_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, attendance_date)
      );
    `);

    // 🔥 AUTOMATIC FIX FOR NEON DB 🔥
    // In case agar pehle se koi constraint atak gaya ho
    await pool.query(`
      ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_marked_by_fkey;
      ALTER TABLE attendance ALTER COLUMN marked_by TYPE VARCHAR(255) USING marked_by::varchar;
    `);

    try {
      await pool.query(`
        ALTER TABLE attendance ADD CONSTRAINT unique_student_date UNIQUE (student_id, attendance_date);
      `);
    } catch (err) {
      // Ignored if constraint already exists
    }

    console.log("✅ Database Tables are verified and ready (Permanent Mode).");
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
  }
};
initDatabase();

// ==========================================
// 🔑 AUTHENTICATION ROUTES
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = result.rows[0];
    if (user.role.toLowerCase() !== role.toLowerCase() || user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role' });
    }
    let redirectUrl = user.role === 'Admin' ? '/admin/dashboard' : user.role === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard';
    res.json({ success: true, user: { id: user.user_id, email: user.email, role: user.role }, redirectUrl });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ==========================================
// 🎓 STUDENTS ROUTES
// ==========================================
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY student_id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Error fetching students' }); }
});

app.post('/api/students', async (req, res) => {
  const { firstName, lastName, email, dob, gender, grade, section, admissionDate, guardianName, guardianContact } = req.body;
  try {
    const studentEmail = email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@student.com`;
    const rollNo = 'STU-' + Math.floor(Math.random() * 10000); 
    const query = `
      WITH new_user AS (
          INSERT INTO users (email, password_hash, role) VALUES ($1, 'password123', 'Student') RETURNING user_id
      )
      INSERT INTO students (user_id, roll_no, first_name, last_name, date_of_birth, gender, grade, section, enrollment_date, guardian_name, guardian_contact, fee_status, status)
      SELECT user_id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending', 'Active' FROM new_user RETURNING *;
    `;
    await pool.query(query, [studentEmail, rollNo, firstName, lastName, dob || '2010-01-01', gender, grade, section, admissionDate || new Date(), guardianName, guardianContact]);
    res.json({ success: true, message: 'Student added successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==========================================
// 👨‍🏫 TEACHERS ROUTES
// ==========================================
app.get('/api/teachers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY teacher_id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Error fetching teachers' }); }
});

app.post('/api/teachers', async (req, res) => {
  const { firstName, lastName, email, phone, gender, designation, joiningDate } = req.body;
  try {
    const teacherEmail = email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@teacher.com`;
    const empId = 'T-' + Math.floor(100 + Math.random() * 900); 
    const query = `
      WITH new_user AS (
          INSERT INTO users (email, password_hash, role) VALUES ($1, 'password123', 'Teacher') RETURNING user_id
      )
      INSERT INTO teachers (user_id, emp_id, first_name, last_name, phone_number, gender, designation, joining_date, status)
      SELECT user_id, $2, $3, $4, $5, $6, $7, $8, 'Active' FROM new_user RETURNING *;
    `;
    await pool.query(query, [teacherEmail, empId, firstName, lastName, phone, gender, designation, joiningDate || new Date()]);
    res.json({ success: true, message: 'Teacher added successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==========================================
// 🏫 CLASSES & SUBJECTS ROUTES
// ==========================================
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes ORDER BY class_id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Error fetching classes' }); }
});

app.post('/api/classes', async (req, res) => {
  const { grade, section, maxCapacity, roomNumber, academicYear, notes, teacher, coTeacher, subjects, startTime, endTime, settings } = req.body;
  try {
    const query = `
      INSERT INTO classes (grade, section, max_capacity, room_number, academic_year, notes, teacher_name, co_teacher, subjects, start_time, end_time, att_tracking, gradebook, portal_access)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;
    `;
    await pool.query(query, [grade, section, maxCapacity, roomNumber, academicYear, notes, teacher, coTeacher, subjects, startTime, endTime, settings?.attTracking, settings?.gradebook, settings?.portalAccess]);
    res.json({ success: true, message: 'Class created successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects_table ORDER BY subject_id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Error fetching subjects' }); }
});

app.post('/api/subjects', async (req, res) => {
  const { subjectName, subjectCode, gradeLevel, subjectCategory, teacherName, weeklyPeriods, creditHours, isElective, hasLab } = req.body;
  try {
    const query = `
      INSERT INTO subjects_table (subject_name, subject_code, grade_level, subject_category, teacher_name, weekly_periods, credit_hours, is_elective, has_lab)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    await pool.query(query, [subjectName, subjectCode, gradeLevel, subjectCategory, teacherName, weeklyPeriods, creditHours, isElective, hasLab]);
    res.json({ success: true, message: 'Subject added successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==========================================
// 📅 ATTENDANCE ROUTES (WITH TEACHER ID)
// ==========================================
app.get('/api/attendance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance ORDER BY attendance_date DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Error fetching attendance' }); }
});

app.post('/api/attendance/bulk', async (req, res) => {
  const { date, classId, attendanceList, markedBy } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Stringified teacher_id pass kar rahe hain safely 
    const teacherId = String(markedBy); 
    
    for (let record of attendanceList) {
      const stId = parseInt(record.student_id);
      const clId = parseInt(classId || 1);

      const query = `
        INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks, marked_by)
        VALUES ($1::integer, $2::integer, $3::date, $4::varchar, $5::text, $6::varchar)
        ON CONFLICT (student_id, attendance_date) 
        DO UPDATE SET status = EXCLUDED.status, remarks = EXCLUDED.remarks, marked_by = EXCLUDED.marked_by;
      `;
      
      const fullStatus = 
        record.status === 'P' ? 'Present' : 
        record.status === 'A' ? 'Absent' : 
        record.status === 'L' ? 'Late' : 'Holiday';

      await client.query(query, [
        stId, 
        clId, 
        date, 
        fullStatus, 
        record.remarks || '', 
        teacherId // 🔥 Id Save hogi DB me
      ]);
    }
    
    await client.query('COMMIT');
    res.json({ success: true, message: 'Attendance published successfully!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Attendance Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

// ==========================================
// 🏁 SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EduSync Server running on http://localhost:${PORT}`);
});
