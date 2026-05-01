import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your pages from their new locations
import Login from "./pages/Auth/Login";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard"; 
import AdminDashboard from "./pages/Admin/Dashboard"; 
import Announcements from "./pages/Admin/Announcement";


import Attendance from "./pages/Admin/Attendance"; 
import FeeManagement from "./pages/Admin/FeeManagement"; 
import Exams from "./pages/Admin/exam"; 
import Reports from "./pages/Admin/Reports"; 
import Students from "./pages/Admin/students"; 
import Teacher from "./pages/Admin/Teacher"; 
import Classes from "./pages/Admin/Classes"; 
import Subjects from "./pages/Admin/subjects"; // 👈 New Subjects Import

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. The Default Route (Login Page) */}
        <Route path="/" element={<Login />} />

        {/* 2. Dashboards Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 3. Admin Management Routes */}
        <Route path="/admin/announcement" element={<Announcements />} />
        <Route path="/students" element={<Students />} /> 
        <Route path="/teachers" element={<Teacher />} /> 
        <Route path="/classes" element={<Classes />} /> 
        <Route path="/subjects" element={<Subjects />} /> {/* 👈 Added Subjects Route */}
        
        {/* 4. Operations & Reports */}
        <Route path="/attendance" element={<Attendance />} /> 
        <Route path="/fees" element={<FeeManagement />} /> 
        <Route path="/exams" element={<Exams />} />
        <Route path="/reports" element={<Reports />} /> 

        {/* 5. Catch-all: Redirect unknown pages to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;