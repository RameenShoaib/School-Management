import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; // 👈 Yahan Header import kiya
import './teacherdashboard.css';

/* Mock Data from the Screenshot */
const teachersData = [
  { id: 1, name: "Mrs. Fatima Noor", empId: "T-011", subject: "Mathematics", classes: 4, students: 148, joined: "Aug 2018", status: "Active", statusClass: "status-active" },
  { id: 2, name: "Mr. Ahmed Siddiqui", empId: "T-022", subject: "English", classes: 5, students: 172, joined: "Jan 2017", status: "Active", statusClass: "status-active" },
  { id: 3, name: "Ms. Zainab Ali", empId: "T-035", subject: "Science", classes: 3, students: 104, joined: "Mar 2021", status: "On leave", statusClass: "status-leave" },
  { id: 4, name: "Mr. Riaz Qureshi", empId: "T-018", subject: "Urdu", classes: 6, students: 185, joined: "Sep 2014", status: "Active", statusClass: "status-active" },
  { id: 5, name: "Ms. Hira Baig", empId: "T-053", subject: "Social Studies", classes: 4, students: 152, joined: "Jun 2022", status: "Active", statusClass: "status-active" },
  { id: 6, name: "Mr. Tariq Mahmood", empId: "T-009", subject: "Physics", classes: 3, students: 96, joined: "Apr 2010", status: "On leave", statusClass: "status-leave" }
];

const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

export default function TeacherDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter Logic
  const filteredTeachers = teachersData.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || teacher.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/teacher/dashboard" 
      userName="System Admin" 
      userInitials="SA"
    >
      {/* 1. Page Title */}
      <div className="td-page-header">
        <div className="td-header-left">
          <h2>Teachers DashBoard</h2>
          <p>86 staff members</p>
        </div>
        <div className="td-header-right">
          <button className="td-btn-primary">+ Add teacher</button>
          <div className="td-avatar">SA</div>
        </div>
      </div>

      {/* 2. Standard Command Bar (Edit, Refresh, Delete, Export) */}
      <Header />

      {/* 3. Top Stats Row */}
      <div className="td-stats-row">
        <div className="td-stat-card">
          <span className="td-stat-title">Total teachers</span>
          <span className="td-stat-value">86</span>
          <span className="td-stat-sub neutral">Full-time staff</span>
        </div>
        <div className="td-stat-card">
          <span className="td-stat-title">On leave</span>
          <span className="td-stat-value">3</span>
          <span className="td-stat-sub red">Substitutes assigned</span>
        </div>
        <div className="td-stat-card">
          <span className="td-stat-title">Subjects covered</span>
          <span className="td-stat-value">14</span>
          <span className="td-stat-sub green">All slots filled</span>
        </div>
        <div className="td-stat-card">
          <span className="td-stat-title">Avg classes/day</span>
          <span className="td-stat-value">5.2</span>
          <span className="td-stat-sub blue">Per teacher</span>
        </div>
      </div>

      {/* 4. Search & Filters Row */}
      <div className="td-controls-row">
        <div className="td-search-box">
          <SvgSearch />
          <input 
            type="text" 
            placeholder="Search by name, subject, employee ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="td-filter-pills">
          {['All', 'Active', 'On leave'].map(filter => (
            <button 
              key={filter} 
              className={`td-filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Data Table Card */}
      <div className="td-table-card">
        <div className="td-table-scroll">
          <table className="td-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Emp ID</th>
                <th>Subject</th>
                <th>Classes</th>
                <th>Students</th>
                <th>Joined</th>
                <th>Status</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.empId}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.classes}</td>
                    <td>{teacher.students}</td>
                    <td>{teacher.joined}</td>
                    <td><span className={`td-pill ${teacher.statusClass}`}>{teacher.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="td-view-btn">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No teachers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="td-pagination-footer">
          <span className="td-page-info">Showing 1–{filteredTeachers.length} of 86</span>
          <div className="td-page-buttons">
            <button className="td-page-btn active">1</button>
            <button className="td-page-btn">2</button>
            <button className="td-page-btn">3</button>
            <button className="td-page-btn">&gt;</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}