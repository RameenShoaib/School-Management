import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';
import Header from '../../components/Header/header';
import './Dashboard.css';

const adminData = {
  name: 'System Admin',
  dateText: 'Monday, 20 April 2026',
  initials: 'SA',
};

const summaryCards = [
  { name: 'Total Students', status: '1,248', sub: '+12 this month', color: 'mint', icon: 'Users', visual: 'none' },
  { name: 'Teachers', status: '86', sub: '3 on leave', color: 'violet', icon: 'Briefcase', visual: 'none' },
  { name: 'Attendance Today', status: '94%', sub: '-2% vs yesterday', color: 'amber', icon: 'ClipboardCheck', visual: 'line' },
  { name: 'Fee collection', status: '87%', sub: 'PKR 2.4M collected', color: 'sky', icon: 'CreditCard', visual: 'bars' },
];

const attendanceChart = [
  { grade: 'Grade 1', percent: 97, color: 'blue' },
  { grade: 'Grade 4', percent: 93, color: 'orange' },
  { grade: 'Grade 7', percent: 97, color: 'peach' },
  { grade: 'Grade 9', percent: 89, color: 'teal' },
  { grade: 'Grade 10', percent: 91, color: 'cyan' },
];

const upcomingEvents = [
  { title: 'Mid-term exams begin', sub: 'Apr 25 - All grades', color: 'blue', icon: 'exam' },
  { title: 'Parent-teacher meeting', sub: 'Apr 28 - 9 AM - 1 PM', color: 'green', icon: 'meeting' },
  { title: 'Fee deadline', sub: 'Apr 30 - Grades 6-10', color: 'yellow', icon: 'fee' },
  { title: 'Sports day', sub: 'May 5 - Full school', color: 'pink', icon: 'sports' },
];

const recentEnrollments = [
  { name: 'Ayesha Khan', grade: 'Grade 7', sec: 'A', date: 'Apr 18', status: 'Paid', statusClass: 'paid' },
  { name: 'Bilal Raza', grade: 'Grade 5', sec: 'B', date: 'Apr 17', status: 'Pending', statusClass: 'pending' },
  { name: 'Sana Mirza', grade: 'Grade 9', sec: 'A', date: 'Apr 15', status: 'Paid', statusClass: 'paid' },
  { name: 'Omar Farooq', grade: 'Grade 3', sec: 'C', date: 'Apr 14', status: 'Overdue', statusClass: 'overdue' },
];

const SvgSearch = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const SvgBell = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const IconClip = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

const IconCard = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
  </svg>
);

const SvgChevronDown = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

const MiniLine = () => (
  <svg className="ad-mini-line" viewBox="0 0 120 54" fill="none" aria-hidden="true">
    <path d="M4 38C18 40 22 14 38 22c12 6 13 20 26 14s12-27 27-18c10 6 16 10 25-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M4 42C18 44 22 18 38 26c12 6 13 20 26 14s12-27 27-18c10 6 16 10 25-8v40H4z" fill="currentColor" opacity="0.12" />
  </svg>
);

const MiniBars = () => (
  <div className="ad-mini-bars" aria-hidden="true">
    {[34, 52, 75, 62, 88].map((height, index) => (
      <span key={index} style={{ height: `${height}%` }} />
    ))}
  </div>
);

const EventIcon = ({ type }) => {
  const paths = {
    exam: (
      <>
        <path d="M7 3.75h7.2L18 7.55v10.7A1.75 1.75 0 0 1 16.25 20H7a1.75 1.75 0 0 1-1.75-1.75V5.5A1.75 1.75 0 0 1 7 3.75Z" />
        <path d="M14 4v4h4M8.5 11h6M8.5 14h5M8.5 17h3" />
      </>
    ),
    meeting: (
      <>
        <path d="M8.5 11.2a2.35 2.35 0 1 0 0-4.7 2.35 2.35 0 0 0 0 4.7ZM15.6 11.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
        <path d="M3.9 18.4c.45-2.7 2.2-4.25 4.6-4.25s4.15 1.55 4.6 4.25M12.7 14.35c.72-.42 1.56-.63 2.55-.63 2.25 0 3.82 1.35 4.2 3.75" />
      </>
    ),
    fee: (
      <>
        <path d="M4.75 7.25h14.5v9.5H4.75z" />
        <path d="M7.25 10h9.5M7.25 14h4.25M15.25 14h1.5" />
      </>
    ),
    sports: (
      <>
        <path d="M12 4.5v15M6.4 7.2c3.35 1.4 7.85 1.4 11.2 0M6.4 16.8c3.35-1.4 7.85-1.4 11.2 0" />
        <path d="M19.5 12A7.5 7.5 0 1 1 4.5 12a7.5 7.5 0 0 1 15 0Z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

export default function AdminDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleEnrollmentSelectAll = (e) => {
    setSelectedEnrollments(e.target.checked ? recentEnrollments.map((row) => row.name) : []);
  };

  const handleEnrollmentSelect = (name) => {
    setSelectedEnrollments((prev) => (
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    ));
  };

  const handleEnrollmentExport = () => {
    if (selectedEnrollments.length === 0) {
      Swal.fire('No selection', 'Select at least one enrollment first.', 'info');
      return;
    }
    const selectedRows = recentEnrollments.filter((row) => selectedEnrollments.includes(row.name));
    const csv = [
      'Student,Grade,Section,Enrolled,Fee Status',
      ...selectedRows.map((row) => `"${row.name}","${row.grade}","${row.sec}","${row.date}","${row.status}"`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recent_Enrollments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isAllEnrollmentsSelected = selectedEnrollments.length === recentEnrollments.length;

  return (
    <DashboardLayout
      userRole="admin"
      currentPath="/admin/dashboard"
      userName={adminData.name}
      userInitials={adminData.initials}
    >
      <header className="ad-main-header">
        <div className="ad-greeting">
          <div className="ad-title-dropdown-wrapper">
            <button
              className="ad-title-trigger"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <h2>Admin dashboard</h2>
              <span className={`ad-chevron ${isDropdownOpen ? 'open' : ''}`}>
                <SvgChevronDown />
              </span>
            </button>

            {isDropdownOpen && (
              <div className="ad-dropdown-menu">
                <button type="button" className="ad-dropdown-item" onClick={() => handleNavigation('/teacher/dashboard')}>
                  Teacher Dashboard
                </button>
                <button type="button" className="ad-dropdown-item" onClick={() => handleNavigation('/student/dashboard')}>
                  Student Dashboard
                </button>
                <button type="button" className="ad-dropdown-item" onClick={() => Swal.fire('Coming soon', 'Parent dashboard is not available yet.', 'info')}>
                  Parent Dashboard
                </button>
              </div>
            )}
          </div>

          <p>{adminData.dateText}</p>
        </div>

        <div className="ad-header-right">
          <div className="ad-search-box">
            <span className="ad-search-icon"><SvgSearch /></span>
            <input type="text" placeholder="Search records..." className="ad-search-input" />
          </div>
          <button type="button" className="ad-notification-group" aria-label="Notifications" onClick={() => Swal.fire('Notifications', 'You have 5 recent school updates.', 'info')}>
            <SvgBell />
            <span className="ad-notification-badge-num">5</span>
          </button>
          <div className="ad-avatar--hdr">{adminData.initials}</div>
        </div>
      </header>

      <Header
        onEdit={() => Swal.fire('Recent enrollments', selectedEnrollments.length === 1 ? `Selected: ${selectedEnrollments[0]}` : 'Select exactly one enrollment to inspect.', 'info')}
        onRefresh={() => Swal.fire('Dashboard', 'Dashboard data is already up to date.', 'success')}
        onDelete={() => Swal.fire('Recent enrollments', 'Dashboard enrollment rows are read-only summary records.', 'info')}
        onExport={handleEnrollmentExport}
      />

      <div className="ad-summary-row">
        {summaryCards.map((card) => (
          <div key={card.name} className={`ad-stat-card ad-stat-card--${card.color}`}>
            <div className="ad-stat-left">
              <div className="ad-stat-icon-group">
                {card.icon === 'Users' && <IconUsers />}
                {card.icon === 'Briefcase' && <IconBriefcase />}
                {card.icon === 'ClipboardCheck' && <IconClip />}
                {card.icon === 'CreditCard' && <IconCard />}
              </div>
              <div className="ad-stat-content">
                <h4>{card.name}</h4>
                <div className="ad-stat-status">{card.status}</div>
                <span>{card.sub}</span>
              </div>
            </div>
            {card.visual === 'line' && <MiniLine />}
            {card.visual === 'bars' && <MiniBars />}
          </div>
        ))}
      </div>

      <div className="ad-middle-grid">
        <section className="ad-card ad-chart-card">
          <h3>Attendance by grade</h3>
          <div className="ad-column-chart">
            <div className="ad-axis-labels">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            <div className="ad-column-plot">
              {attendanceChart.map((item) => (
                <div className="ad-column" key={item.grade}>
                  <span className="ad-column-value">{item.percent}%</span>
                  <div className="ad-column-track">
                    <div className={`ad-column-fill ${item.color}`} style={{ height: `${item.percent}%` }} />
                  </div>
                  <span className="ad-column-label">{item.grade}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ad-chart-legend">
            {attendanceChart.map((item) => (
              <span key={item.grade}><i className={item.color}></i>{item.grade}</span>
            ))}
          </div>
        </section>

        <section className="ad-card ad-events-card">
          <h3>Upcoming events</h3>
          <div className="ad-events-list">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="ad-event-item">
                <div className={`ad-event-icon ${event.color}`}>
                  <EventIcon type={event.icon} />
                </div>
                <div className="ad-event-details">
                  <h4>{event.title}</h4>
                  <p>{event.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ad-card full">
        <h3>Recent enrollments</h3>
        <div className="ad-table-responsive">
          <table className="ad-data-table">
            <thead>
              <tr>
                <th style={{ width: '36px' }}>
                  <input type="checkbox" checked={isAllEnrollmentsSelected} onChange={handleEnrollmentSelectAll} />
                </th>
                <th>Student</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Enrolled</th>
                <th>Fee status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((row) => (
                <tr key={`${row.name}-${row.date}`}>
                  <td>
                    <input type="checkbox" checked={selectedEnrollments.includes(row.name)} onChange={() => handleEnrollmentSelect(row.name)} />
                  </td>
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
      </section>
    </DashboardLayout>
  );
}
