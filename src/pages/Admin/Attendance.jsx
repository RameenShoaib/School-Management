import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import Swal from 'sweetalert2'; 
import './Attendance.css';

/* Action Icons */
const IconCalendar = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>;
const IconSettings = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>;
const IconInfo = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;
const IconKey = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>;
const IconEdit = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const IconRefresh = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>;
const IconDelete = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const IconExport = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>;

const getMonday = (d) => {
  d = new Date(d);
  const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
}

export default function Attendance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbStudents, setDbStudents] = useState([]);
  const [dbTeachers, setDbTeachers] = useState([]); 
  const [attendanceRecords, setAttendanceRecords] = useState([]); 
  
  const todayDateString = new Date().toISOString().split('T')[0];

  const [tableFilters, setTableFilters] = useState({
    grade: '', 
    section: '', 
    startDate: getMonday(new Date()).toISOString().split('T')[0]
  });

  const [modalConfig, setModalConfig] = useState({
    date: todayDateString,
    grade: 'Grade 7',
    section: 'A', 
    session: 'Full day',
    markedBy: '' 
  });

  const fetchData = async () => {
    try {
      const [stuRes, teaRes, attRes] = await Promise.all([
        fetch("http://localhost:5000/api/students"),
        fetch("http://localhost:5000/api/teachers"),
        fetch("http://localhost:5000/api/attendance")
      ]);

      const stuResult = await stuRes.json();
      if (stuResult.success) {
        setDbStudents(stuResult.data.map(s => ({
          student_id: s.student_id || s.id, 
          name: `${s.first_name} ${s.last_name}`,
          roll: s.roll_no,
          grade: s.grade, 
          section: s.section,
          status: 'P',
          remarks: ''
        })));
      }

      const teaResult = await teaRes.json();
      if (teaResult.success) setDbTeachers(teaResult.data);

      const attResult = await attRes.json();
      if (attResult.success) setAttendanceRecords(attResult.data);

    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const todaysAttendance = attendanceRecords.filter(a => a.attendance_date.startsWith(todayDateString));
  const totalPresent = todaysAttendance.filter(a => a.status === 'Present').length;
  const totalAbsent = todaysAttendance.filter(a => a.status === 'Absent').length;
  const totalLate = todaysAttendance.filter(a => a.status === 'Late').length;
  const totalHoliday = todaysAttendance.filter(a => a.status === 'Holiday').length;
  const totalMarked = todaysAttendance.length;
  const presentPercent = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
  const absentPercent = totalMarked > 0 ? ((totalAbsent / totalMarked) * 100).toFixed(1) : 0;

  const uniqueGrades = [...new Set(dbStudents.map(s => s.grade))].filter(Boolean).sort();
  const dynamicGradeChart = uniqueGrades.map(grade => {
    const gradeStudents = dbStudents.filter(s => s.grade === grade).map(s => s.student_id);
    const gradeAttToday = todaysAttendance.filter(a => gradeStudents.includes(a.student_id));
    
    const totalG = gradeAttToday.length;
    const presentG = gradeAttToday.filter(a => a.status === 'Present').length;
    const p = totalG > 0 ? Math.round((presentG / totalG) * 100) : 0;
    
    let c = 'empty';
    if (totalG > 0) {
      if (p >= 95) c = 'green';
      else if (p >= 85) c = 'blue';
      else if (p >= 75) c = 'yellow';
      else c = 'red';
    }
    return { g: grade, p, c };
  });

  const dynamicWeeklyTrend = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

    const dayRecords = attendanceRecords.filter(a => a.attendance_date.startsWith(dateStr));
    const totalD = dayRecords.length;
    const presentD = dayRecords.filter(a => a.status === 'Present').length;
    const p = totalD > 0 ? Math.round((presentD / totalD) * 100) : 0;

    let c = 'empty';
    if (totalD > 0) {
      if (p >= 95) c = 'green';
      else if (p >= 85) c = 'blue';
      else if (p >= 75) c = 'yellow';
      else c = 'red';
    }
    dynamicWeeklyTrend.push({ d: dayName, p, c });
  }

  const displayedStudents = dbStudents.filter(s => {
    const matchGrade = tableFilters.grade === '' || s.grade === tableFilters.grade;
    const matchSection = tableFilters.section === '' || s.section === tableFilters.section;
    return matchGrade && matchSection;
  });

  const displayDates = Array.from({length: 5}).map((_, i) => {
    const d = new Date(tableFilters.startDate);
    d.setDate(d.getDate() + i);
    return {
      fullDateStr: d.toISOString().split('T')[0],
      displayStr: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const getStatusForSpecificDate = (studentId, dateStr) => {
    const record = attendanceRecords.find(a => a.student_id === studentId && a.attendance_date.startsWith(dateStr));
    return record ? record.status.charAt(0) : null;
  };

  const modalStudents = dbStudents.filter(s => s.grade === modalConfig.grade && s.section === modalConfig.section);

  const updateStatus = (id, status) => {
    setDbStudents(prev => prev.map(s => s.student_id === id ? {...s, status} : s));
  };

  const markAll = (status) => {
    setDbStudents(prev => prev.map(s => {
      if(s.grade === modalConfig.grade && s.section === modalConfig.section) return {...s, status};
      return s;
    }));
  };

  const submitAttendance = async () => {
    if (!modalConfig.markedBy) {
      Swal.fire('Wait!', 'Please select a teacher in "Marked by" field.', 'warning');
      return;
    }
    if (modalStudents.length === 0) {
      Swal.fire('Empty List', 'There are no students to mark attendance for.', 'info');
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/attendance/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: modalConfig.date,
          classId: 1, 
          markedBy: modalConfig.markedBy,
          attendanceList: modalStudents 
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Success', 'Attendance saved in DB successfully!', 'success');
        setIsModalOpen(false);
        fetchData(); 
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) { Swal.fire('Error', 'Connection failed. Is the server running?', 'error'); }
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/attendance" userName="System Admin" userInitials="SA">
      
      {/* 🟢 CUSTOM PAGE TITLE SECTION */}
      <div className="att-page-header">
        <div className="att-header-left">
          <h2>Attendance</h2>
          <p>Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="att-header-right">
          <button className="att-btn-primary" onClick={() => setIsModalOpen(true)}>Mark attendance</button>
          <div className="att-avatar">SA</div>
        </div>
      </div>

      {/* 🟢 GLOBAL HEADER RESTORED */}
      <Header />

      {/* 🟢 SCROLLABLE WRAPPER (Everything below header scrolls) */}
      <div className="att-page-wrapper">

        <div className="att-stats-row">
          <div className="att-stat-card"><span className="att-stat-title">Present today</span><span className="att-stat-value">{totalPresent}</span><span className="att-stat-sub green">{presentPercent}% attendance</span></div>
          <div className="att-stat-card"><span className="att-stat-title">Absent</span><span className="att-stat-value">{totalAbsent}</span><span className="att-stat-sub red">{absentPercent}% absent</span></div>
          <div className="att-stat-card"><span className="att-stat-title">Late arrivals</span><span className="att-stat-value">{totalLate}</span><span className="att-stat-sub yellow">{totalMarked > 0 ? ((totalLate/totalMarked)*100).toFixed(1) : 0}% late</span></div>
          <div className="att-stat-card"><span className="att-stat-title">On holiday / leave</span><span className="att-stat-value">{totalHoliday}</span><span className="att-stat-sub blue">Docs submitted</span></div>
        </div>

        <div className="att-charts-row">
          <div className="att-chart-card">
            <h3>Attendance by grade — today</h3>
            {dynamicGradeChart.length > 0 ? dynamicGradeChart.map((item, i) => (
              <div className="att-bar-row" key={i}>
                <span className="att-bar-label">{item.g}</span>
                <div className="att-bar-track"><div className={`att-bar-fill ${item.c}`} style={{width: `${item.p}%`}}></div></div>
                <span className="att-bar-percent">{item.p}%</span>
              </div>
            )) : <p style={{fontSize: '12px', color: '#94a3b8'}}>No students found in DB.</p>}
          </div>
          <div className="att-chart-card">
            <h3>Weekly trend (Last 5 days)</h3>
            {dynamicWeeklyTrend.map((item, i) => (
              <div className="att-bar-row" key={i}>
                <span className="att-bar-label">{item.d}</span>
                <div className="att-bar-track"><div className={`att-bar-fill ${item.c}`} style={{width: `${item.p}%`}}></div></div>
                <span className="att-bar-percent">{item.p}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="att-table-card">
          <div className="att-table-header">
            <h3>Detailed Attendance Record</h3>
          </div>

          <div className="att-table-scroll">
            <table className="att-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>
                    STUDENT
                    <div style={{ marginTop: '8px', fontSize: '10px', fontWeight: '500', color: '#94a3b8', textTransform: 'none' }}>Filter to view specific classes 👇</div>
                  </th>
                  <th style={{ width: '15%' }}>
                    GRADE
                    <select className="att-col-filter" value={tableFilters.grade} onChange={(e) => setTableFilters({...tableFilters, grade: e.target.value})}>
                      <option value="">All Grades</option>
                      {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </th>
                  <th style={{ width: '12%' }}>
                    SECTION
                    <select className="att-col-filter" value={tableFilters.section} onChange={(e) => setTableFilters({...tableFilters, section: e.target.value})}>
                      <option value="">All</option>
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                    </select>
                  </th>
                  
                  {displayDates.map((dObj, idx) => (
                    <th key={idx} style={{ textAlign: 'center', width: '9%' }}>
                      {idx === 0 ? (
                        <>
                          <span style={{ display: 'block', marginBottom: '4px' }}>START DATE</span>
                          <input type="date" className="att-col-filter" style={{ cursor: 'pointer', padding: '5px' }} value={tableFilters.startDate} onChange={(e) => setTableFilters({...tableFilters, startDate: e.target.value})} />
                        </>
                      ) : (
                        <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '18px' }}>
                          {dObj.displayStr.toUpperCase()}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStudents.length > 0 ? displayedStudents.map((student) => (
                  <tr key={student.student_id}>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td style={{ color: '#64748b' }}>{student.grade}</td>
                    <td style={{ color: '#64748b' }}>Sec {student.section}</td>
                    
                    {displayDates.map((dObj, idx) => {
                      const status = getStatusForSpecificDate(student.student_id, dObj.fullDateStr);
                      return (
                        <td key={idx} style={{ textAlign: 'center' }}>
                          {status ? <span className={`att-status-circle ${status}`}>{status}</span> : <span className="att-status-circle empty">-</span>}
                        </td>
                      );
                    })}
                  </tr>
                )) : <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>No students found matching these filters.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="att-legend-row">
            <div className="att-legend-item"><span className="att-status-circle P">P</span> Present</div>
            <div className="att-legend-item"><span className="att-status-circle A">A</span> Absent</div>
            <div className="att-legend-item"><span className="att-status-circle L">L</span> Late</div>
            <div className="att-legend-item"><span className="att-status-circle H">H</span> Holiday/Med</div>
          </div>
        </div>

        {isModalOpen && (
          <div className="att-modal-overlay">
            <div className="att-modal">
              <div className="att-modal-header">
                <div className="att-modal-title-group">
                  <div className="att-modal-icon"><IconCalendar /></div>
                  <div className="att-modal-title">
                    <h2>Mark Attendance</h2>
                    <p>Neon Database Sync Mode</p>
                  </div>
                </div>
              </div>

              <div className="att-modal-body">
                <div>
                  <div className="att-section-title"><IconSettings /> SESSION CONFIGURATION</div>
                  <div className="att-form-row-3">
                    <div className="att-form-group">
                      <label>Date *</label>
                      <input type="date" className="att-input" value={modalConfig.date} onChange={(e) => setModalConfig({...modalConfig, date: e.target.value})} />
                    </div>
                    <div className="att-form-group">
                      <label>Grade *</label>
                      <select className="att-input" value={modalConfig.grade} onChange={(e) => setModalConfig({...modalConfig, grade: e.target.value})}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={`Grade ${n}`}>Grade {n}</option>)}
                      </select>
                    </div>
                    <div className="att-form-group">
                      <label>Section *</label>
                      <select className="att-input" value={modalConfig.section} onChange={(e) => setModalConfig({...modalConfig, section: e.target.value})}>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                      </select>
                    </div>
                  </div>

                  <div className="att-form-row-2">
                    <div className="att-form-group">
                      <label>Period</label>
                      <select className="att-input"><option>Full day</option></select>
                    </div>
                    <div className="att-form-group">
                      <label>Marked by</label>
                      <select className="att-input" value={modalConfig.markedBy} onChange={(e) => setModalConfig({...modalConfig, markedBy: e.target.value})}>
                        <option value="">Select Teacher</option>
                        {dbTeachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.first_name} {t.last_name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="att-section-title"><IconKey /> BULK ACTIONS</div>
                  <div className="att-bulk-btns">
                    <button className="att-btn-bulk-p" onClick={() => markAll('P')}>✓ Mark all present</button>
                    <button className="att-btn-bulk-a" onClick={() => markAll('A')}>X Mark all absent</button>
                  </div>

                  <table className="att-modal-table" style={{marginTop: '15px'}}>
                    <thead>
                      <tr><th>Student</th><th>Roll No</th><th>Status</th><th>Remark</th></tr>
                    </thead>
                    <tbody>
                      {modalStudents.length > 0 ? modalStudents.map((stu) => (
                        <tr key={stu.student_id}>
                          <td style={{ fontWeight: 600 }}>{stu.name}</td>
                          <td>{stu.roll}</td>
                          <td>
                            <div className="att-toggles">
                              {['P', 'A', 'L', 'H'].map(st => (
                                <div key={st} className={`att-toggle-btn ${st.toLowerCase()} ${stu.status === st ? 'active' : ''}`} 
                                  onClick={() => updateStatus(stu.student_id, st)}>{st}</div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <input type="text" className="att-remark-input" placeholder="Note..." 
                              onChange={(e) => {
                                const val = e.target.value;
                                setDbStudents(prev => prev.map(s => s.student_id === stu.student_id ? {...s, remarks: val} : s));
                              }} />
                          </td>
                        </tr>
                      )) : <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No students found for this Grade and Section.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="att-modal-footer">
                <button className="att-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="att-btn-publish" onClick={submitAttendance}>Submit attendance</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}