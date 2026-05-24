import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './StudentModule.css';

const announcements = [
  {
    id: 1,
    title: 'Mid-term exams begin April 25',
    type: 'Urgent',
    detail: 'Check your exam timetable and arrive at least 20 minutes early.',
  },
  {
    id: 2,
    title: 'Sports day registration open',
    type: 'Event',
    detail: 'Register for cricket, football, or athletics before the deadline.',
  },
  {
    id: 3,
    title: 'Fee payment deadline',
    type: 'Fee',
    detail: 'Monthly fees should be submitted before the end of the month.',
  },
];

export default function StudentAnnouncements() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = announcements.filter((item) => {
    const query = searchTerm.toLowerCase();
    return item.title.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="student" currentPath="/student/announcement" userName="Student" userInitials="ST">
      <div className="sm-page-header">
        <div>
          <h2>Announcements</h2>
          <p>Important notices from your school</p>
        </div>
        <div className="sm-avatar">ST</div>
      </div>

      <div className="sm-toolbar">
        <input className="sm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search announcements..." />
      </div>

      <section className="sm-panel">
        <div className="sm-panel-header">
          <h3>Recent announcements</h3>
        </div>
        <div className="sm-list">
          {filtered.length > 0 ? filtered.map((item) => (
            <div className="sm-list-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
              <span className="sm-pill">{item.type}</span>
            </div>
          )) : <div className="sm-empty">No announcements found.</div>}
        </div>
      </section>
    </DashboardLayout>
  );
}
