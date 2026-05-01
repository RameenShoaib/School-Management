import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 1. YAHAN NAVIGATE IMPORT KIYA HAI
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Dashboard.css';

/* Static Admin Data */
const adminData = {
  name: "System Admin",
  dateText: "Monday, 20 April 2026",
  initials: "SA",
}; 

const summaryCards = [
  { name: "Total students", status: "1,248", sub: "+12 this month", color: "blue", icon: "Users" },
  { name: "Teachers", status: "86", sub: "3 on leave", color: "purple", icon: "Briefcase" },
  { name: "Attendance today", status: "94%", sub: "↓ 2% vs yesterday", color: "red", icon: "ClipboardCheck" },
  { name: "Fee collection", status: "87%", sub: "PKR 2.4M collected", color: "green", icon: "CreditCard" }
];

const attendanceChart = [
  { grade: 'Grade 1', percent: 97, color: 'blue' },
  { grade: 'Grade 4', percent: 93, color: 'blue' },
  { grade: 'Grade 7', percent: 89, color: 'red' },
  { grade: 'Grade 9', percent: 96, color: 'blue' },
  { grade: 'Grade 10', percent: 91, color: 'blue' },
];

const upcomingEvents = [
  { title: "Mid-term exams begin", sub: "Apr 25 · All grades", color: "blue" },
  { title: "Parent-teacher meeting", sub: "Apr 28 · 9 AM – 1 PM", color: "green" },
  { title: "Fee deadline", sub: "Apr 30 · Grades 6–10", color: "yellow" },
  { title: "Sports day", sub: "May 5 · Full school", color: "pink" }
];

const recentEnrollments = [
  { name: 'Ayesha Khan', grade: 'Grade 7', sec: 'A', date: 'Apr 18', status: 'Paid', statusClass: 'paid' },
  { name: 'Bilal Raza', grade: 'Grade 5', sec: 'B', date: 'Apr 17', status: 'Pending', statusClass: 'pending' },
  { name: 'Sana Mirza', grade: 'Grade 9', sec: 'A', date: 'Apr 15', status: 'Paid', statusClass: 'paid' },
  { name: 'Omar Farooq', grade: 'Grade 3', sec: 'C', date: 'Apr 14', status: 'Overdue', statusClass: 'overdue' },
];

/* SVGs */
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const SvgBell = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>;
const IconUsers = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconBriefcase = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>;
const IconClip = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>;
const IconCard = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;

/* 👇 Naya Arrow Icon Dropdown ke liye */
const SvgChevronDown = () => <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>;

export default function AdminDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 👈 Dropdown control
  const navigate = useNavigate(); // 👈 Page change control

  // Jab user kisi option par click karega:
  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Navigate hone ke baad dropdown band kardo
  };

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/admin/dashboard" 
      userName={adminData.name} 
      userInitials={adminData.initials}
    >
      {/* Main Header */}
      <header className="ad-main-header">
        <div className="ad-greeting">
          
          {/* 👇 NAYA DROPDOWN WRAPPER YAHAN HAI 👇 */}
          <div className="ad-title-dropdown-wrapper">
            <div 
              className="ad-title-trigger" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <h2>Admin dashboard</h2>
              <span className={`ad-chevron ${isDropdownOpen ? 'open' : ''}`}>
                <SvgChevronDown />
              </span>
            </div>
            
            {/* Dropdown Menu jo click karne par khulega */}
            {isDropdownOpen && (
              <div className="ad-dropdown-menu">
                <div className="ad-dropdown-item" onClick={() => handleNavigation('/teacher/dashboard')}>
                  Teacher Dashboard
                </div>
                <div className="ad-dropdown-item" onClick={() => handleNavigation('/student/dashboard')}>
                  Student Dashboard
                </div>
                <div className="ad-dropdown-item" onClick={() => handleNavigation('/parent/dashboard')}>
                  Parent Dashboard
                </div>
              </div>
            )}
          </div>
          {/* 👆 NAYA DROPDOWN WRAPPER KHATAM 👆 */}

          <p>{adminData.dateText}</p>
        </div>
        
        <div className="ad-header-right">
          <div className="ad-search-box">
            <span className="ad-search-icon"><SvgSearch /></span>
            <input type="text" placeholder="Search records..." className="ad-search-input" />
          </div>
          <div className="ad-notification-group">
            <SvgBell />
            <span className="ad-notification-badge-num">5</span>
          </div>
          <div className="ad-avatar--hdr">{adminData.initials}</div>
        </div>
      </header>

      <Header />

      {/* Summary Cards */}
      <div className="ad-summary-row">
        {summaryCards.map((card, i) => (
          <div key={i} className={`ad-stat-card ad-stat-card--${card.color}`}>
            <div className="ad-stat-icon-group">
              {card.icon === "Users" && <IconUsers />}
              {card.icon === "Briefcase" && <IconBriefcase />}
              {card.icon === "ClipboardCheck" && <IconClip />}
              {card.icon === "CreditCard" && <IconCard />}
            </div>
            <div className="ad-stat-content">
              <h4>{card.name}</h4>
              <div className="ad-stat-status">{card.status}</div>
              <span style={{ fontSize: "11px", color: card.color === "red" ? "#dc2626" : "#64748b", marginTop: "2px", fontWeight: "500" }}>
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Two Column Grid */}
      <div className="ad-middle-grid">
        <div className="ad-card">
          <h3>Attendance by grade</h3>
          <div className="ad-bar-chart">
            {attendanceChart.map((item, index) => (
              <div className="ad-bar-row" key={index}>
                <span className="ad-bar-label">{item.grade}</span>
                <div className="ad-bar-track">
                  <div 
                    className={`ad-bar-fill ${item.color}`} 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <span className="ad-bar-percent">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-card">
          <h3>Upcoming events</h3>
          <div className="ad-events-list">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="ad-event-item">
                <div className={`ad-event-dot ${event.color}`}></div>
                <div className="ad-event-details">
                  <h4>{event.title}</h4>
                  <p>{event.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Full Width Table */}
      <div className="ad-card full">
        <h3>Recent enrollments</h3>
        <div className="ad-table-responsive">
          <table className="ad-data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Enrolled</th>
                <th>Fee status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.grade}</td>
                  <td>{row.sec}</td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`ad-status-pill ${row.statusClass}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}