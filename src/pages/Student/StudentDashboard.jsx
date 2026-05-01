import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './StudentDashboard.css';

/* Mock Data exactly matching the screenshot */
const studentsData = [
  { id: 1, name: "Ayesha Khan", roll: "1014", grade: "Grade 7", sec: "A", guardian: "Mr. Imran Khan", fee: "Paid", feeClass: "fee-paid", status: "Active", statusClass: "status-active" },
  { id: 2, name: "Bilal Raza", roll: "1052", grade: "Grade 5", sec: "B", guardian: "Mrs. Sana Raza", fee: "Pending", feeClass: "fee-pending", status: "Active", statusClass: "status-active" },
  { id: 3, name: "Sana Mirza", roll: "1087", grade: "Grade 9", sec: "A", guardian: "Dr. Mirza Baig", fee: "Paid", feeClass: "fee-paid", status: "Active", statusClass: "status-active" },
  { id: 4, name: "Omar Farooq", roll: "1011", grade: "Grade 3", sec: "C", guardian: "Mr. Farooq Ali", fee: "Overdue", feeClass: "fee-overdue", status: "Active", statusClass: "status-active" },
  { id: 5, name: "Zara Hussain", roll: "1101", grade: "Grade 10", sec: "A", guardian: "Mrs. Nadia Hussain", fee: "Paid", feeClass: "fee-paid", status: "Active", statusClass: "status-active" },
  { id: 6, name: "Hassan Malik", roll: "1078", grade: "Grade 6", sec: "B", guardian: "Mr. Kamran Malik", fee: "Paid", feeClass: "fee-paid", status: "On leave", statusClass: "status-leave" }
];

const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Logic - Only uses the search term now
  const filteredStudents = studentsData.filter(student => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student.roll.includes(searchTerm) ||
           student.grade.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout 
  userRole="admin" 
  currentPath="/student/dashboard" /* 👈 ISKO EXACT YEH KAR DEIN */
  userName="System Admin" 
  userInitials="SA"
    >
      {/* Page Title */}
      <div className="stu-page-header">
        <h2>Students DashBoard</h2>
        <p>Manage student records, fee status, and details</p>
      </div>

      {/* Command Bar */}
      <Header />

      {/* Search Bar Row (Full Width) */}
      <div className="stu-controls-row">
        <div className="stu-search-box">
          <SvgSearch />
          <input 
            type="text" 
            placeholder="Search by name, roll no, class..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="stu-table-card">
        
        {/* Scrollable Table Area */}
        <div className="stu-table-scroll">
          <table className="stu-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll no</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Guardian</th>
                <th>Fee status</th>
                <th>Status</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.roll}</td>
                    <td>{student.grade}</td>
                    <td>{student.sec}</td>
                    <td>{student.guardian}</td>
                    <td><span className={`stu-pill ${student.feeClass}`}>{student.fee}</span></td>
                    <td><span className={`stu-pill ${student.statusClass}`}>{student.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="stu-view-btn">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="stu-pagination-footer">
          <span className="stu-page-info">Showing 1–{filteredStudents.length} of 1,248</span>
          <div className="stu-page-buttons">
            <button className="stu-page-btn active">1</button>
            <button className="stu-page-btn">2</button>
            <button className="stu-page-btn">3</button>
            <button className="stu-page-btn">&gt;</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}