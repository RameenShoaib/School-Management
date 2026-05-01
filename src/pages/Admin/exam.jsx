import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './exam.css';

/* SVG Icons for Modal */
const IconCalendar = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>;
const IconSettings = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>;
const IconClip = () => <svg width="24" height="24" fill="#cbd5e1" viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-1.38-1.12-2.5-2.5-2.5S8 3.62 8 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>;
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

/* Mock Data */
const examRecords = [
  { id: 1, student: "Sana Ali", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1087", section: "A", marks: 93, total: 100, percent: "93%", grade: "A", gradeClass: "ex-grade-a", result: "Pass", resultClass: "pass", rank: "🥇 1st" },
  { id: 2, student: "Ayesha Khan", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1014", section: "A", marks: 87, total: 100, percent: "87%", grade: "A-", gradeClass: "ex-grade-a", result: "Pass", resultClass: "pass", rank: "🥈 2nd" },
  { id: 3, student: "Zara Hussain", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1101", section: "A", marks: 79, total: 100, percent: "79%", grade: "B+", gradeClass: "ex-grade-b", result: "Pass", resultClass: "pass", rank: "🥉 3rd" },
  { id: 4, student: "Hassan Malik", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1078", section: "B", marks: 72, total: 100, percent: "72%", grade: "B", gradeClass: "ex-grade-b", result: "Pass", resultClass: "pass", rank: "—" },
  { id: 5, student: "Bilal Raza", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1052", section: "B", marks: 61, total: 100, percent: "61%", grade: "C+", gradeClass: "ex-grade-c", result: "Pass", resultClass: "pass", rank: "—" },
  { id: 6, student: "Nadia Sheikh", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1099", section: "C", marks: 58, total: 100, percent: "58%", grade: "C", gradeClass: "ex-grade-c", result: "Pass", resultClass: "pass", rank: "—" },
  { id: 7, student: "Omar Farooq", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1011", section: "C", marks: 44, total: 100, percent: "44%", percentClass: "fail", grade: "F", gradeClass: "ex-grade-f", result: "Fail", resultClass: "fail", rank: "—" },
  { id: 8, student: "Rania Akhter", gradeLevel: "Grade 7", subject: "Mathematics", rollNo: "1110", section: "B", marks: 38, total: 100, percent: "38%", percentClass: "fail", grade: "F", gradeClass: "ex-grade-f", result: "Fail", resultClass: "fail", rank: "—" },
  { id: 9, student: "Faizan Ahmed", gradeLevel: "Grade 8", subject: "Science", rollNo: "2015", section: "A", marks: 88, total: 100, percent: "88%", grade: "A-", gradeClass: "ex-grade-a", result: "Pass", resultClass: "pass", rank: "🥇 1st" },
  { id: 10, student: "Kashif Ali", gradeLevel: "Grade 8", subject: "Science", rollNo: "2022", section: "A", marks: 40, total: 100, percent: "40%", percentClass: "fail", grade: "F", gradeClass: "ex-grade-f", result: "Fail", resultClass: "fail", rank: "—" }
];

export default function Exams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeGrade, setActiveGrade] = useState('Grade 7');
  const [activeSubject, setActiveSubject] = useState('Mathematics');

  // 👇 Modal & Toggle States 👇
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifyPortal, setNotifyPortal] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);

  // Filter Logic
  const filteredRecords = examRecords.filter(record => {
    const matchesSearch = 
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.includes(searchTerm);
    
    const matchesStatus = activeFilter === 'All' || record.result === activeFilter;
    const matchesGrade = record.gradeLevel === activeGrade;
    const matchesSubject = record.subject === activeSubject;
    
    return matchesSearch && matchesStatus && matchesGrade && matchesSubject;
  });

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/exams" 
      userName="System Admin" 
      userInitials="SA"
    >
      <div className="ex-page-header">
        <div className="ex-header-left">
          <h2>Exams</h2>
          <p>Manage examinations, grades, and student results</p>
        </div>
        <div className="ex-header-right">
          {/* 👇 Naya 'Schedule exam' Button 👇 */}
          <button className="ex-btn-primary" onClick={() => setIsModalOpen(true)}>
            + Schedule exam
          </button>
          <div className="ex-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="ex-table-card">
        
        <div className="ex-card-header">
          <div className="ex-header-title-group">
            <h3>Exam results — {activeSubject} mid-term 2026</h3>
            <div className="ex-selectors">
              <select className="ex-select" value={activeGrade} onChange={(e) => setActiveGrade(e.target.value)}>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </select>
              <select className="ex-select" value={activeSubject} onChange={(e) => setActiveSubject(e.target.value)}>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>
          </div>
          <div className="ex-header-actions">
            <button className="ex-btn-outline">Export</button>
            <button className="ex-btn-primary">Publish results</button>
          </div>
        </div>

        <div className="ex-search-area">
          <div className="ex-search-box">
            <SvgSearch />
            <input 
              type="text" 
              placeholder="Search by student name or roll no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ex-status-filters">
            {['All', 'Pass', 'Fail'].map(filter => (
              <button 
                key={filter} 
                className={`ex-status-filter ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="ex-table-scroll">
          <table className="ex-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Roll no</th>
                <th>Section</th>
                <th>Marks obtained</th>
                <th>Total marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td style={{ fontWeight: 600 }}>{record.student}</td>
                    <td>{record.rollNo}</td>
                    <td>{record.section}</td>
                    <td>{record.marks}</td>
                    <td>{record.total}</td>
                    <td className={`ex-percent ${record.percentClass || ''}`}>{record.percent}</td>
                    <td><span className={`ex-pill ${record.gradeClass}`}>{record.grade}</span></td>
                    <td><span className={`ex-pill ${record.resultClass}`}>{record.result}</span></td>
                    <td className="ex-rank">{record.rank}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No results found for {activeGrade} - {activeSubject}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ex-pagination-footer">
          <span className="ex-page-info">Showing {filteredRecords.length} student(s)</span>
          <div className="ex-page-buttons">
            <button className="ex-page-btn active">1</button>
            <button className="ex-page-btn">2</button>
            <button className="ex-page-btn">3</button>
            <button className="ex-page-btn">&gt;</button>
          </div>
        </div>

      </div>

      {/* =========================================
          ✨ SCHEDULE EXAM MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="ex-modal-overlay">
          <div className="ex-modal">
            
            {/* Modal Header */}
            <div className="ex-modal-header">
              <div className="ex-modal-title-group">
                <div className="ex-modal-icon"><IconCalendar /></div>
                <div className="ex-modal-title">
                  <h2>Schedule New Exam</h2>
                  <p>Set date, subject, venue, and grading configuration</p>
                </div>
              </div>
              <div className="ex-badge-pill">New exam</div>
            </div>

            {/* Modal Body */}
            <div className="ex-modal-body">
              
              {/* SECTION 1: EXAM DETAILS */}
              <div>
                <div className="ex-section-title">📱 EXAM DETAILS</div>
                
                <div className="ex-form-row-2">
                  <div className="ex-form-group">
                    <label>Exam title <span>*</span></label>
                    <input type="text" className="ex-input" placeholder="📌 e.g. Mathematics Mid-term 2026" />
                  </div>
                  <div className="ex-form-group">
                    <label>Exam type <span>*</span></label>
                    <select className="ex-input">
                      <option>Select type</option>
                      <option>Mid-Term</option>
                      <option>Final-Term</option>
                    </select>
                  </div>
                </div>

                <div className="ex-form-row-3">
                  <div className="ex-form-group">
                    <label>Subject <span>*</span></label>
                    <select className="ex-input">
                      <option>Select subject</option>
                      <option>Mathematics</option>
                      <option>Science</option>
                    </select>
                  </div>
                  <div className="ex-form-group">
                    <label>Grade <span>*</span></label>
                    <select className="ex-input">
                      <option>Grade 7</option>
                    </select>
                  </div>
                  <div className="ex-form-group">
                    <label>Section(s)</label>
                    <div className="ex-checkbox-group">
                      <label className="ex-check-pill">
                        <input type="checkbox" defaultChecked />
                        <span className="ex-check-square"></span> A
                      </label>
                      <label className="ex-check-pill">
                        <input type="checkbox" defaultChecked />
                        <span className="ex-check-square"></span> B
                      </label>
                      <label className="ex-check-pill">
                        <input type="checkbox" />
                        <span className="ex-check-square"></span> C
                      </label>
                    </div>
                  </div>
                </div>

                <div className="ex-form-row-3">
                  <div className="ex-form-group">
                    <label>Exam date <span>*</span></label>
                    <input type="date" className="ex-input" defaultValue="2026-04-25" />
                  </div>
                  <div className="ex-form-group">
                    <label>Start time <span>*</span></label>
                    <input type="time" className="ex-input" defaultValue="09:00" />
                  </div>
                  <div className="ex-form-group">
                    <label>Duration</label>
                    <select className="ex-input">
                      <option>2 hours</option>
                      <option>3 hours</option>
                    </select>
                  </div>
                </div>

                <div className="ex-form-row-2">
                  <div className="ex-form-group">
                    <label>Exam room(s)</label>
                    <input type="text" className="ex-input" placeholder="🚪 e.g. R-01, R-02, R-03" />
                  </div>
                  <div className="ex-form-group">
                    <label>Invigilator <span>*</span></label>
                    <select className="ex-input">
                      <option>Assign invigilator</option>
                      <option>Ms. Fatima Noor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: GRADING CONFIGURATION */}
              <div>
                <div className="ex-section-title"><IconSettings /> GRADING CONFIGURATION</div>
                
                <div className="ex-form-row-4">
                  <div className="ex-form-group">
                    <label>Total marks <span>*</span></label>
                    <input type="text" className="ex-input" defaultValue="100" />
                  </div>
                  <div className="ex-form-group">
                    <label>Passing marks <span>*</span></label>
                    <input type="text" className="ex-input" defaultValue="50" />
                  </div>
                  <div className="ex-form-group">
                    <label>Weightage (%)</label>
                    <input type="text" className="ex-input" defaultValue="30" />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Of final grade</span>
                  </div>
                  <div className="ex-form-group">
                    <label>Grading scale</label>
                    <select className="ex-input">
                      <option>A-F grades</option>
                      <option>Percentage</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="ex-switch-list">
                  <div className="ex-switch-row">
                    <div className="ex-switch-label">
                      <h4>Notify students via portal</h4>
                      <p>Students receive exam alert on dashboard</p>
                    </div>
                    <div className={`ex-toggle ${notifyPortal ? 'on' : ''}`} onClick={() => setNotifyPortal(!notifyPortal)}></div>
                  </div>
                  
                  <div className="ex-switch-row">
                    <div className="ex-switch-label">
                      <h4>Send SMS to parents</h4>
                      <p>Guardian receives exam reminder 1 day before</p>
                    </div>
                    <div className={`ex-toggle ${sendSms ? 'on' : ''}`} onClick={() => setSendSms(!sendSms)}></div>
                  </div>

                  <div className="ex-switch-row">
                    <div className="ex-switch-label">
                      <h4>Auto-publish results</h4>
                      <p>Publish results immediately after marks entry</p>
                    </div>
                    <div className={`ex-toggle ${autoPublish ? 'on' : ''}`} onClick={() => setAutoPublish(!autoPublish)}></div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ATTACHMENT */}
              <div>
                <div className="ex-section-title">📎 QUESTION PAPER / INSTRUCTIONS (OPTIONAL)</div>
                <div className="ex-upload-area">
                  <IconClip />
                  <p><span>Click to upload</span> question paper or instructions</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>PDF, DOCX - max 10 MB</p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="ex-modal-footer">
              <div className="ex-req-text">* Required fields</div>
              <div className="ex-footer-actions">
                <button className="ex-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="ex-btn-draft">Save as draft</button>
                <button className="ex-btn-publish" onClick={() => setIsModalOpen(false)}>Schedule exam</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}