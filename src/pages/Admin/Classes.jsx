import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Classes.css';

/* Icons */
const IconSchool = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>;
const IconInfo = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

/* Mock Data */
const classesData = [
  { id: 1, grade: "Grade 7", section: "Section A", teacher: "Ms. Fatima", students: 32, attendance: "96%", subjects: 7, avgGrade: "B+", status: "Active", statusClass: "active" },
  { id: 2, grade: "Grade 9", section: "Section A", teacher: "Mr. Ahmed", students: 30, attendance: "94%", subjects: 8, avgGrade: "A-", status: "Active", statusClass: "active" },
  { id: 3, grade: "Grade 5", section: "Section B", teacher: "Ms. Hira", students: 35, attendance: "91%", subjects: 6, avgGrade: "B", status: "Active", statusClass: "active" },
  { id: 4, grade: "Grade 10", section: "Section A", teacher: "Mr. Riaz", students: 28, attendance: "98%", subjects: 9, avgGrade: "A", status: "Active", statusClass: "active" },
  { id: 5, grade: "Grade 3", section: "Section C", teacher: "Ms. Zainab", students: 38, attendance: "85%", subjects: 5, avgGrade: "B-", status: "Sub assigned", statusClass: "sub" },
  { id: 6, grade: "Grade 1", section: "Section A", teacher: "Ms. Sana", students: 40, attendance: "97%", subjects: 4, avgGrade: "A", status: "Active", statusClass: "active" },
];

export default function Classes() {
  // 👇 Modal & Toggles States 👇
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attTracking, setAttTracking] = useState(true);
  const [gradebook, setGradebook] = useState(true);
  const [portalAccess, setPortalAccess] = useState(true);

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/classes" 
      userName="System Admin" 
      userInitials="SA"
    >
      <div className="cl-page-header">
        <div className="cl-header-left">
          <h2>Classes</h2>
          <p>32 active classes across 10 grades</p>
        </div>
        <div className="cl-header-right">
          {/* 👇 Modal Open Button 👇 */}
          <button className="cl-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add class</button>
          <div className="cl-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="cl-stats-row">
        <div className="cl-stat-card">
          <span className="cl-stat-title">Total classes</span>
          <span className="cl-stat-value">32</span>
          <span className="cl-stat-sub neutral">Grades 1 - 10</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Avg class size</span>
          <span className="cl-stat-value">39</span>
          <span className="cl-stat-sub neutral">Students per class</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Sections</span>
          <span className="cl-stat-value">A, B, C</span>
          <span className="cl-stat-sub green">3 per grade</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Full capacity</span>
          <span className="cl-stat-value">94%</span>
          <span className="cl-stat-sub orange">Near max</span>
        </div>
      </div>

      <div className="cl-scroll-wrapper">
        <div className="cl-cards-grid">
          {classesData.map((cls) => (
            <div className="cl-card" key={cls.id}>
              <div className="cl-card-header">
                <div className="cl-card-title-group">
                  <h3>{cls.grade} — {cls.section}</h3>
                  <p>Class teacher: {cls.teacher}</p>
                </div>
                <span className={`cl-pill ${cls.statusClass}`}>{cls.status}</span>
              </div>
              <div className="cl-inner-grid">
                <div className="cl-inner-box">
                  <span className="cl-inner-label">Students</span>
                  <span className="cl-inner-val">{cls.students}</span>
                </div>
                <div className="cl-inner-box">
                  <span className="cl-inner-label">Attendance</span>
                  <span className="cl-inner-val">{cls.attendance}</span>
                </div>
                <div className="cl-inner-box">
                  <span className="cl-inner-label">Subjects</span>
                  <span className="cl-inner-val">{cls.subjects}</span>
                </div>
                <div className="cl-inner-box">
                  <span className="cl-inner-label">Avg grade</span>
                  <span className="cl-inner-val">{cls.avgGrade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          ✨ ADD CLASS MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="cl-modal-overlay">
          <div className="cl-modal">
            
            {/* Modal Header */}
            <div className="cl-modal-header">
              <div className="cl-modal-title-group">
                <div className="cl-modal-icon"><IconSchool /></div>
                <div className="cl-modal-title">
                  <h2>Add New Class</h2>
                  <p>Create a new class and assign a teacher and subjects</p>
                </div>
              </div>
              <div className="cl-badge-pill">Setup required</div>
            </div>

            {/* Modal Body */}
            <div className="cl-modal-body">
              
              {/* SECTION 1: CLASS DETAILS */}
              <div>
                <div className="cl-section-title">Class Details</div>
                
                <div className="cl-form-row-3">
                  <div className="cl-form-group">
                    <label>Grade <span>*</span></label>
                    <select className="cl-input">
                      <option>Select grade</option>
                      <option>Grade 1</option>
                      <option>Grade 2</option>
                    </select>
                  </div>
                  <div className="cl-form-group">
                    <label>Section <span>*</span></label>
                    <div className="cl-radio-group">
                      <label className="cl-radio-label">
                        <input type="radio" name="section" defaultChecked />
                        <span className="cl-radio-circle"></span> A
                      </label>
                      <label className="cl-radio-label">
                        <input type="radio" name="section" />
                        <span className="cl-radio-circle"></span> B
                      </label>
                      <label className="cl-radio-label">
                        <input type="radio" name="section" />
                        <span className="cl-radio-circle"></span> C
                      </label>
                      <label className="cl-radio-label">
                        <input type="radio" name="section" />
                        <span className="cl-radio-circle"></span> D
                      </label>
                    </div>
                  </div>
                  <div className="cl-form-group">
                    <label>Max capacity <span>*</span></label>
                    <input type="text" className="cl-input" placeholder="e.g. 40" />
                  </div>
                </div>

                <div className="cl-form-row-2">
                  <div className="cl-form-group">
                    <label>Class room number</label>
                    <input type="text" className="cl-input" placeholder="🚪 e.g. R-12" />
                  </div>
                  <div className="cl-form-group">
                    <label>Academic year <span>*</span></label>
                    <select className="cl-input">
                      <option>2025 - 2026</option>
                    </select>
                  </div>
                </div>

                <div className="cl-form-group">
                  <label>Class description / notes</label>
                  <textarea className="cl-input cl-textarea" placeholder="Any special notes about this class..."></textarea>
                </div>
              </div>

              {/* SECTION 2: TEACHER ASSIGNMENT */}
              <div>
                <div className="cl-section-title">Teacher Assignment</div>
                <div className="cl-form-row-2">
                  <div className="cl-form-group">
                    <label>Class / homeroom teacher <span>*</span></label>
                    <select className="cl-input">
                      <option>Select teacher</option>
                      <option>Ms. Fatima Noor</option>
                    </select>
                  </div>
                  <div className="cl-form-group">
                    <label>Co-teacher (optional)</label>
                    <select className="cl-input">
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SUBJECT & TIMETABLE ASSIGNMENT */}
              <div>
                <div className="cl-section-title">Subject & Timetable Assignment</div>
                
                <div className="cl-alert-box">
                  <IconInfo />
                  <p>Assign the subjects that will be taught in this class. You can configure detailed timetable slots later from the Timetable section.</p>
                </div>

                <div className="cl-form-group">
                  <label>Subjects for this class <span>*</span></label>
                  <div className="cl-checkbox-group">
                    {/* Checkbox Pills */}
                    <label className="cl-check-pill">
                      <input type="checkbox" defaultChecked />
                      <span className="cl-check-square"></span> Mathematics
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" defaultChecked />
                      <span className="cl-check-square"></span> English
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" defaultChecked />
                      <span className="cl-check-square"></span> Science
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" defaultChecked />
                      <span className="cl-check-square"></span> Urdu
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" defaultChecked />
                      <span className="cl-check-square"></span> Social Studies
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" />
                      <span className="cl-check-square"></span> Physics
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" />
                      <span className="cl-check-square"></span> Computer Science
                    </label>
                    <label className="cl-check-pill">
                      <input type="checkbox" />
                      <span className="cl-check-square"></span> Art & Design
                    </label>
                  </div>
                </div>

                <div className="cl-form-row-2">
                  <div className="cl-form-group">
                    <label>School start time</label>
                    <input type="time" className="cl-input" defaultValue="08:00" />
                  </div>
                  <div className="cl-form-group">
                    <label>School end time</label>
                    <input type="time" className="cl-input" defaultValue="14:00" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CLASS SETTINGS */}
              <div>
                <div className="cl-section-title">Class Settings</div>
                
                <div className="cl-switch-card">
                  <div className="cl-switch-row">
                    <div className="cl-switch-label">
                      <h4>Enable attendance tracking</h4>
                      <p>Mark daily attendance for this class</p>
                    </div>
                    <div className={`cl-toggle ${attTracking ? 'on' : ''}`} onClick={() => setAttTracking(!attTracking)}></div>
                  </div>
                  
                  <div className="cl-switch-row">
                    <div className="cl-switch-label">
                      <h4>Enable gradebook</h4>
                      <p>Track assignment and exam results</p>
                    </div>
                    <div className={`cl-toggle ${gradebook ? 'on' : ''}`} onClick={() => setGradebook(!gradebook)}></div>
                  </div>

                  <div className="cl-switch-row">
                    <div className="cl-switch-label">
                      <h4>Allow student portal access</h4>
                      <p>Students can view timetable and results</p>
                    </div>
                    <div className={`cl-toggle ${portalAccess ? 'on' : ''}`} onClick={() => setPortalAccess(!portalAccess)}></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="cl-modal-footer">
              <div className="cl-req-text">* Required fields</div>
              <div className="cl-footer-actions">
                <button className="cl-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="cl-btn-publish" onClick={() => setIsModalOpen(false)}>Create class</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}