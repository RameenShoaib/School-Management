import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const announcements = [
  {
    id: 1,
    title: 'Mid-term exams begin April 25',
    audience: 'All students',
    type: 'Urgent',
    detail: 'Students are advised to review their timetables and bring required stationery.',
  },
  {
    id: 2,
    title: 'Parent-teacher meeting',
    audience: 'Teachers',
    type: 'General',
    detail: 'Subject teachers should prepare class progress notes before the meeting.',
  },
  {
    id: 3,
    title: 'Fee deadline reminder',
    audience: 'Grades 6-10',
    type: 'Fee',
    detail: 'Please remind students to submit monthly dues before the end of the month.',
  },
];

export default function TeacherAnnouncements() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = announcements.filter((item) => {
    const query = searchTerm.toLowerCase();
    return item.title.toLowerCase().includes(query) ||
      item.audience.toLowerCase().includes(query) ||
      item.detail.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/announcement" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Announcements</h2>
          <p>School notices and messages relevant to teachers</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search announcements..." />
      </div>

      <section className="tm-panel">
        <div className="tm-panel-header">
          <h3>Recent announcements</h3>
        </div>
        <div className="tm-list">
          {filtered.length > 0 ? filtered.map((item) => (
            <div className="tm-list-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
              <span className="tm-pill">{item.type}</span>
            </div>
          )) : <div className="tm-empty">No announcements found.</div>}
        </div>
      </section>
    </DashboardLayout>
  );
}
