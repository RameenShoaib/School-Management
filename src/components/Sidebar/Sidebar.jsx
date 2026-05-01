import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

/* Professional SVG Icons */
const SvgDashboard = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>;
const SvgUsers = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const SvgBriefcase = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>;
const SvgClasses = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>;
const SvgAttendance = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>;
const SvgFinance = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;
const SvgSettings = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>;
const SvgLogout = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;
const SvgBell = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>;

/* 👇 Dashboard ko sab roles ke liye access de diya gaya hai 👇 */
const navConfig = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', roles: ['admin', 'teacher', 'student'], icon: <SvgDashboard /> },
      { name: 'Announcements', path: '/admin/announcement', roles: ['admin', 'teacher', 'student'], icon: <SvgBell /> },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Students', path: '/students', roles: ['admin', 'teacher'], icon: <SvgUsers /> },
      { name: 'Teachers', path: '/teachers', roles: ['admin'], icon: <SvgBriefcase /> },
      { name: 'Classes', path: '/classes', roles: ['admin', 'teacher'], icon: <SvgClasses /> },
      { name: 'Subjects', path: '/subjects', roles: ['admin', 'teacher'], icon: <SvgClasses /> },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'], icon: <SvgAttendance /> },
      { name: 'Exams', path: '/exams', roles: ['admin', 'teacher', 'student'], icon: <SvgClasses /> },
      { name: 'Fee management', path: '/fees', roles: ['admin'], icon: <SvgFinance /> },
      { name: 'Reports', path: '/reports', roles: ['admin', 'teacher'], icon: <SvgDashboard /> },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/settings', roles: ['admin'], icon: <SvgSettings /> },
    ],
  },
];

const Sidebar = ({ userRole = 'admin', currentPath = '/admin/dashboard', userName = "System Admin", userInitials = "SA" }) => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <span className="logo-dot"></span><span className="logo-dot"></span>
          <span className="logo-dot"></span><span className="logo-dot"></span>
        </div>
        <h2 className="sidebar-logo-text">EduSync</h2>
      </div>

      <div className="sidebar-nav-scroll">
        <nav>
          {navConfig.map((section, index) => {
            const visibleItems = section.items.filter((item) =>
              item.roles.includes(userRole)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={index} className="sidebar-nav-group">
                <div className="sidebar-nav-label">{section.title}</div>
                {visibleItems.map((item, idx) => {
                  
                  /* 👇 SMART LOGIC: Role ke mutabiq dashboard ka path change karo 👇 */
                  let finalPath = item.path;
                  if (item.name === 'Dashboard') {
                    if (userRole === 'teacher') finalPath = '/teacher/dashboard';
                    else if (userRole === 'student') finalPath = '/student/dashboard';
                    else finalPath = '/admin/dashboard';
                  }

                  /* 👇 PERFECT ACTIVE LOGIC 👇 */
                  const isActive = currentPath === finalPath || (item.name === 'Dashboard' && currentPath.includes('/dashboard'));

                  return (
                    <Link
                      key={idx}
                      to={finalPath}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <span className="sidebar-nav-icon">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-nav-item sidebar-nav-item--logout">
          <span className="sidebar-nav-icon"><SvgLogout /></span> Log out
        </div>
        <div className="sidebar-profile">
          <div className={`sidebar-avatar ${userRole}`}>{userInitials}</div>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{userName}</span>
            <span className="sidebar-profile-role">{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;