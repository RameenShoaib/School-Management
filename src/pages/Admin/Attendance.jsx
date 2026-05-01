import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Attendance.css';

/* Icons */
const IconCalendar = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>;
const IconSettings = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>;
const IconUsers = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconKey = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>;
const IconInfo = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

/* Mock Data for Main Page */
const gradeAttendance = [
  { grade: "Grade 1", percent: 97, color: "green" },
  { grade: "Grade 3", percent: 92, color: "blue" },
  { grade: "Grade 5", percent: 98, color: "blue" },
  { grade: "Grade 7", percent: 89, color: "red" },
  { grade: "Grade 9", percent: 96, color: "blue" },
  { grade: "Grade 10", percent: 90, color: "green" },
];

const weeklyTrend = [
  { day: "Monday", percent: 94, color: "blue" },
  { day: "Tuesday", percent: 95, color: "blue" },
  { day: "Wednesday", percent: 91, color: "yellow" },
  { day: "Thursday", percent: 97, color: "green" },
  { day: "Friday", percent: 85, color: "red" },
];

const studentRecords = [
  { name: "Ayesha Khan", record: ["P", "P", "P", "P", "P"] },
  { name: "Bilal Raza", record: ["P", "A", "P", "P", "L"] },
  { name: "Sana Mirza", record: ["L", "P", "P", "A", "P"] },
  { name: "Omar Farooq", record: ["P", "P", "H", "H", "P"] },
  { name: "Zara Hussain", record: ["P", "P", "P", "P", "P"] },
];

// Helper for main page table
const getStatusClass = (status) => {
  switch(status) {
    case 'P': return 'present';
    case 'A': return 'absent';
    case 'L': return 'late';
    case 'H': return 'holiday';
    default: return '';
  }
};

/* Mock Data for Modal Table (Matches Screenshot exactly) */
const modalStudents = [
  { id: 1, name: "Ayesha Khan", roll: "1014", status: "P" },
  { id: 2, name: "Bilal Raza", roll: "1052", status: "P" },
  { id: 3, name: "Sana Mirza", roll: "1087", status: "P" },
  { id: 4, name: "Omar Farooq", roll: "1033", status: "A" },
  { id: 5, name: "Zara Hussain", roll: "1101", status: "P" },
  { id: 6, name: "Hassan Malik", roll: "1078", status: "P" },
  { id: 7, name: "Nadia Sheikh", roll: "1096", status: "L" },
  { id: 8, name: "Faisal Noor", roll: "1124", status: "P" },
  { id: 9, name: "Maira Saleem", roll: "1038", status: "P" },
  { id: 10, name: "Usman Tariq", roll: "1065", status: "P" }
];


export default function Attendance() {
  const [activeFilter, setActiveFilter] = useState('This week');
  
  // 👇 Modal State 👇
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/attendance" 
      userName="System Admin" 
      userInitials="SA"
    >
      <header className="att-header">
        <div className="att-header-left">
          <h2>Attendance</h2>
          <p>Today — Monday, April 20, 2026</p>
        </div>
        <div className="att-header-right">
          {/* 👇 Click Event Added 👇 */}
          <button className="att-btn-primary" onClick={() => setIsModalOpen(true)}>
            Mark attendance
          </button>
          <div className="att-avatar">SA</div>
        </div>
      </header>

      <Header />

      <div className="att-stats-row">
        <div className="att-stat-card">
          <span className="att-stat-title">Present today</span>
          <span className="att-stat-value">1,173</span>
          <span className="att-stat-sub green">92% attendance</span>
        </div>
        <div className="att-stat-card">
          <span className="att-stat-title">Absent</span>
          <span className="att-stat-value">51</span>
          <span className="att-stat-sub red">4.1% absent</span>
        </div>
        <div className="att-stat-card">
          <span className="att-stat-title">Late arrivals</span>
          <span className="att-stat-value">24</span>
          <span className="att-stat-sub yellow">1.9% late</span>
        </div>
        <div className="att-stat-card">
          <span className="att-stat-title">On medical leave</span>
          <span className="att-stat-value">8</span>
          <span className="att-stat-sub blue">Docs submitted</span>
        </div>
      </div>

      <div className="att-charts-row">
        <div className="att-chart-card">
          <h3>Attendance by grade — today</h3>
          {gradeAttendance.map((item, i) => (
            <div className="att-bar-row" key={i}>
              <span className="att-bar-label">{item.grade}</span>
              <div className="att-bar-track">
                <div className={`att-bar-fill ${item.color}`} style={{ width: `${item.percent}%` }}></div>
              </div>
              <span className="att-bar-percent">{item.percent}%</span>
            </div>
          ))}
        </div>
        <div className="att-chart-card">
          <h3>Weekly trend</h3>
          {weeklyTrend.map((item, i) => (
            <div className="att-bar-row" key={i}>
              <span className="att-bar-label">{item.day}</span>
              <div className="att-bar-track">
                <div className={`att-bar-fill ${item.color}`} style={{ width: `${item.percent}%` }}></div>
              </div>
              <span className="att-bar-percent">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="att-table-card">
        <div className="att-table-header">
          <h3>Grade 7 — Section A · Daily record</h3>
          <div className="att-filters">
            {['Today', 'This week', 'This month'].map(filter => (
              <button 
                key={filter} 
                className={`att-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="att-table-wrapper">
          <table className="att-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((student, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  {student.record.map((status, index) => (
                    <td key={index}>
                      <span className={`att-status-circle ${getStatusClass(status)}`}>
                        {status}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="att-legend-row">
          <div className="att-legend-item"><span className="att-status-circle present">P</span> Present</div>
          <div className="att-legend-item"><span className="att-status-circle absent">A</span> Absent</div>
          <div className="att-legend-item"><span className="att-status-circle late">L</span> Late</div>
          <div className="att-legend-item"><span className="att-status-circle holiday">H</span> Holiday/Med</div>
        </div>
      </div>

      {/* =========================================
          ✨ MARK ATTENDANCE MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="att-modal-overlay">
          <div className="att-modal">
            
            {/* Modal Header */}
            <div className="att-modal-header">
              <div className="att-modal-title-group">
                <div className="att-modal-icon"><IconCalendar /></div>
                <div className="att-modal-title">
                  <h2>Mark Attendance</h2>
                  <p>Record daily attendance for a class</p>
                </div>
              </div>
              <div className="att-badge-pill">Draft</div>
            </div>

            {/* Modal Body */}
            <div className="att-modal-body">
              
              {/* SECTION 1: CONFIGURATION */}
              <div>
                <div className="att-section-title"><IconSettings /> SESSION CONFIGURATION</div>
                
                <div className="att-form-row-3">
                  <div className="att-form-group">
                    <label>Date <span>*</span></label>
                    <input type="date" className="att-input" defaultValue="2026-04-20" />
                  </div>
                  <div className="att-form-group">
                    <label>Grade <span>*</span></label>
                    <select className="att-input">
                      <option>Grade 7</option>
                    </select>
                  </div>
                  <div className="att-form-group">
                    <label>Section <span>*</span></label>
                    <select className="att-input">
                      <option>Section A</option>
                    </select>
                  </div>
                </div>

                <div className="att-form-row-2">
                  <div className="att-form-group">
                    <label>Period / session</label>
                    <select className="att-input">
                      <option>Full day</option>
                    </select>
                  </div>
                  <div className="att-form-group">
                    <label>Marked by</label>
                    <div className="att-input-icon-wrapper">
                      <img src="https://ui-avatars.com/api/?name=Fatima+Noor&background=fce7f3&color=db2777" className="att-input-icon" alt="user" />
                      <input type="text" className="att-input" value="Ms. Fatima Noor" readOnly />
                    </div>
                  </div>
                </div>

                <div className="att-info-banner">
                  <IconInfo />
                  Showing <strong>Grade 7 — Section A</strong> · 32 students · Monday April 20, 2026
                </div>
              </div>

              {/* SECTION 2: LEGEND & TABLE */}
              <div>
                <div className="att-section-title"><IconKey /> STATUS LEGEND & BULK ACTIONS</div>
                
                <div className="att-legend-bulk">
                  <div className="att-legend-row" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                    <div className="att-legend-item"><span className="att-status-circle present">P</span> Present</div>
                    <div className="att-legend-item"><span className="att-status-circle absent">A</span> Absent</div>
                    <div className="att-legend-item"><span className="att-status-circle late">L</span> Late</div>
                    <div className="att-legend-item"><span className="att-status-circle holiday">H</span> Holiday</div>
                  </div>
                  <div className="att-bulk-btns">
                    <button className="att-btn-bulk-p">✓ Mark all present</button>
                    <button className="att-btn-bulk-a">X Mark all absent</button>
                  </div>
                </div>

                <div className="att-section-title"><IconUsers /> STUDENT ATTENDANCE — GRADE 7, SECTION A</div>

                <table className="att-modal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Student name</th>
                      <th>Roll no.</th>
                      <th>Status</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalStudents.map((stu) => (
                      <tr key={stu.id}>
                        <td style={{ color: '#94a3b8' }}>{stu.id}</td>
                        <td style={{ fontWeight: 600 }}>{stu.name}</td>
                        <td style={{ color: '#64748b' }}>{stu.roll}</td>
                        <td>
                          <div className="att-toggles">
                            <div className={`att-toggle-btn p ${stu.status === 'P' ? 'active' : ''}`}>P</div>
                            <div className={`att-toggle-btn a ${stu.status === 'A' ? 'active' : ''}`}>A</div>
                            <div className={`att-toggle-btn l ${stu.status === 'L' ? 'active' : ''}`}>L</div>
                            <div className={`att-toggle-btn h ${stu.status === 'H' ? 'active' : ''}`}>H</div>
                          </div>
                        </td>
                        <td>
                          <input type="text" className="att-remark-input" placeholder="Optional remark..." />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary Boxes */}
                <div className="att-summary-row">
                  <div className="att-sum-box">
                    <span className="att-sum-val green">8</span>
                    <span className="att-sum-label">Present</span>
                  </div>
                  <div className="att-sum-box">
                    <span className="att-sum-val red">1</span>
                    <span className="att-sum-label">Absent</span>
                  </div>
                  <div className="att-sum-box">
                    <span className="att-sum-val yellow">1</span>
                    <span className="att-sum-label">Late</span>
                  </div>
                  <div className="att-sum-box">
                    <span className="att-sum-val blue">0</span>
                    <span className="att-sum-label">Holiday</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="att-modal-footer">
              <div className="att-req-text">* Attendance cannot be modified after 11:59 PM</div>
              <div className="att-footer-actions">
                <button className="att-btn-discard" onClick={() => setIsModalOpen(false)}>Reset</button>
                <button className="att-btn-draft">Save draft</button>
                <button className="att-btn-publish" onClick={() => setIsModalOpen(false)}>Submit attendance</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}