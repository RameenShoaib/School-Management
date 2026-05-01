import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './subjects.css';

/* Icons */
const IconBook = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>;

/* Mock Data */
const overviewData = [
  { subject: "Mathematics", type: "Core", typeClass: "core", teachers: 8, classes: 12, avg: "76%" },
  { subject: "English", type: "Core", typeClass: "core", teachers: 7, classes: 12, avg: "81%" },
  { subject: "Science", type: "Core", typeClass: "core", teachers: 6, classes: 10, avg: "69%" },
  { subject: "Urdu", type: "Core", typeClass: "core", teachers: 4, classes: 12, avg: "84%" },
  { subject: "Social Studies", type: "Core", typeClass: "core", teachers: 5, classes: 10, avg: "77%" },
  { subject: "Physics", type: "Elective", typeClass: "elective", teachers: 3, classes: 4, avg: "66%" },
  { subject: "Computer Science", type: "Elective", typeClass: "elective", teachers: 2, classes: 4, avg: "79%" },
  { subject: "Art & Design", type: "Elective", typeClass: "elective", teachers: 2, classes: 6, avg: "88%" },
];

const barChartData = [
  { subject: "Art & Design", val: "88%", width: "88%", color: "teal" },
  { subject: "Urdu", val: "84%", width: "84%", color: "green" },
  { subject: "English", val: "81%", width: "81%", color: "blue" },
  { subject: "CS", val: "79%", width: "79%", color: "blue" },
  { subject: "Social Studies", val: "77%", width: "77%", color: "blue" },
  { subject: "Maths", val: "76%", width: "76%", color: "orange" },
  { subject: "Science", val: "69%", width: "69%", color: "red" },
  { subject: "Physics", val: "66%", width: "66%", color: "red" },
];

const alertsData = [
  { title: "Physics — Grade 10", desc: "Avg score 54%. Below threshold." },
  { title: "Science — Grade 7", desc: "Avg score 61%. Teacher on leave." }
];

export default function Subjects() {
  // 👇 Modal & Toggles States 👇
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportCard, setReportCard] = useState(true);
  const [gpaCalc, setGpaCalc] = useState(true);
  const [selfEnroll, setSelfEnroll] = useState(false);
  const [activeSubject, setActiveSubject] = useState(true);

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/subjects" 
      userName="System Admin" 
      userInitials="SA"
    >
      {/* Page Header */}
      <div className="sbj-page-header">
        <div className="sbj-header-left">
          <h2>Subjects</h2>
          <p>14 subjects across all grades</p>
        </div>
        <div className="sbj-header-right">
          {/* 👇 Click Event added for Modal 👇 */}
          <button className="sbj-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add subject</button>
          <div className="sbj-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="sbj-scroll-wrapper">
        
        {/* Top Stats Row */}
        <div className="sbj-stats-row">
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Total subjects</span>
            <span className="sbj-stat-value">14</span>
            <span className="sbj-stat-sub neutral">Core + elective</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Core subjects</span>
            <span className="sbj-stat-value">8</span>
            <span className="sbj-stat-sub blue">Mandatory</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Electives</span>
            <span className="sbj-stat-value">6</span>
            <span className="sbj-stat-sub neutral">Optional</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Unassigned</span>
            <span className="sbj-stat-value">0</span>
            <span className="sbj-stat-sub green">All covered</span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="sbj-main-grid">
          <div className="sbj-card">
            <h3 className="sbj-card-title">Subjects overview</h3>
            <table className="sbj-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Teachers</th>
                  <th>Classes</th>
                  <th>Avg score</th>
                </tr>
              </thead>
              <tbody>
                {overviewData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.subject}</td>
                    <td><span className={`sbj-pill ${item.typeClass}`}>{item.type}</span></td>
                    <td>{item.teachers}</td>
                    <td>{item.classes}</td>
                    <td style={{ fontWeight: 600 }}>{item.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sbj-right-col">
            <div className="sbj-card">
              <h3 className="sbj-card-title">Average score by subject</h3><br />
              <div>
                {barChartData.map((bar, i) => (
                  <div className="sbj-bar-row" key={i}>
                    <span className="sbj-bar-label">{bar.subject}</span>
                    <div className="sbj-bar-track">
                      <div className={`sbj-bar-fill ${bar.color}`} style={{ width: bar.width }}></div>
                    </div>
                    <span className="sbj-bar-val">{bar.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sbj-card">
              <h3 className="sbj-card-title">Needs attention</h3><br />
              <div>
                {alertsData.map((alert, i) => (
                  <div className="sbj-alert-item" key={i}>
                    <h4 className="sbj-alert-title">{alert.title}</h4>
                    <p className="sbj-alert-desc">{alert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ✨ ADD SUBJECT MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="sbj-modal-overlay">
          <div className="sbj-modal">
            
            {/* Modal Header */}
            <div className="sbj-modal-header">
              <div className="sbj-modal-title-group">
                <div className="sbj-modal-icon"><IconBook /></div>
                <div className="sbj-modal-title">
                  <h2>Add New Subject</h2>
                  <p>Define a subject and assign it to grades and teachers</p>
                </div>
              </div>
              <div className="sbj-badge-pill">New subject</div>
            </div>

            {/* Modal Body */}
            <div className="sbj-modal-body">
              
              {/* SECTION 1: SUBJECT DETAILS */}
              <div>
                <div className="sbj-section-title">Subject Details</div>
                
                <div className="sbj-form-row-2">
                  <div className="sbj-form-group">
                    <label>Subject name <span>*</span></label>
                    <input type="text" className="sbj-input" placeholder="📖 e.g. Mathematics" />
                  </div>
                  <div className="sbj-form-group">
                    <label>Subject code</label>
                    <input type="text" className="sbj-input" placeholder="e.g. MATH-07" />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Auto-generated if left blank</span>
                  </div>
                </div>

                <div className="sbj-form-row-2">
                  <div className="sbj-form-group">
                    <label>Subject type <span>*</span></label>
                    <div className="sbj-radio-group">
                      <label className="sbj-radio-label">
                        <input type="radio" name="subtype" defaultChecked />
                        <span className="sbj-radio-circle"></span> Core (mandatory)
                      </label>
                      <label className="sbj-radio-label">
                        <input type="radio" name="subtype" />
                        <span className="sbj-radio-circle"></span> Elective (optional)
                      </label>
                      <label className="sbj-radio-label">
                        <input type="radio" name="subtype" />
                        <span className="sbj-radio-circle"></span> Co-curricular
                      </label>
                    </div>
                  </div>
                  <div className="sbj-form-group">
                    <label>Department / category</label>
                    <select className="sbj-input">
                      <option>Select department</option>
                      <option>Sciences</option>
                      <option>Languages</option>
                    </select>
                  </div>
                </div>

                <div className="sbj-form-group">
                  <label>Subject description</label>
                  <textarea className="sbj-input sbj-textarea" placeholder="Brief description of this subject, its objectives, or curriculum overview..."></textarea>
                </div>
              </div>

              {/* SECTION 2: GRADE & CLASS ASSIGNMENT */}
              <div>
                <div className="sbj-section-title">Grade & Class Assignment</div>
                <div className="sbj-form-group">
                  <label>Offered in grades <span>*</span></label>
                  <div className="sbj-checkbox-group">
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((gr, idx) => (
                      <label key={idx} className="sbj-check-pill">
                        <input type="checkbox" defaultChecked={idx > 2} />
                        <span className="sbj-check-square"></span> {gr}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: EXAM & GRADING CONFIGURATION */}
              <div>
                <div className="sbj-section-title">Exam & Grading Configuration</div>
                
                <div className="sbj-form-row-4">
                  <div className="sbj-form-group">
                    <label>Total marks <span>*</span></label>
                    <input type="text" className="sbj-input" placeholder="e.g. 100" />
                  </div>
                  <div className="sbj-form-group">
                    <label>Passing marks <span>*</span></label>
                    <input type="text" className="sbj-input" placeholder="e.g. 50" />
                  </div>
                  <div className="sbj-form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Grading scale</label>
                    <select className="sbj-input">
                      <option>A-F letter grades</option>
                      <option>Percentages</option>
                    </select>
                  </div>
                </div>

                <div className="sbj-form-row-4">
                  <div className="sbj-form-group">
                    <label>Periods per week</label>
                    <input type="text" className="sbj-input" placeholder="e.g. 5" />
                  </div>
                  <div className="sbj-form-group">
                    <label>Period duration (mins)</label>
                    <input type="text" className="sbj-input" placeholder="e.g. 45" />
                  </div>
                  <div className="sbj-form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Credit hours</label>
                    <input type="text" className="sbj-input" placeholder="e.g. 3" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: TEACHER ASSIGNMENT */}
              <div>
                <div className="sbj-section-title">Teacher Assignment</div>
                <div className="sbj-form-row-2">
                  <div className="sbj-form-group">
                    <label>Primary teacher <span>*</span></label>
                    <select className="sbj-input">
                      <option>Select teacher</option>
                      <option>Ms. Fatima Noor</option>
                    </select>
                  </div>
                  <div className="sbj-form-group">
                    <label>Additional teachers</label>
                    <input type="text" className="sbj-input" placeholder="Type teacher name and press Enter..." />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>For subjects with multiple sections or teachers</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: SUBJECT SETTINGS */}
              <div>
                <div className="sbj-section-title">Subject Settings</div>
                
                <div className="sbj-switch-card">
                  <div className="sbj-switch-row">
                    <div className="sbj-switch-label">
                      <h4>Include in report card</h4>
                      <p>Show this subject in student report cards</p>
                    </div>
                    <div className={`sbj-toggle ${reportCard ? 'on' : ''}`} onClick={() => setReportCard(!reportCard)}></div>
                  </div>
                  
                  <div className="sbj-switch-row">
                    <div className="sbj-switch-label">
                      <h4>Include in GPA calculation</h4>
                      <p>Count this subject in overall grade average</p>
                    </div>
                    <div className={`sbj-toggle ${gpaCalc ? 'on' : ''}`} onClick={() => setGpaCalc(!gpaCalc)}></div>
                  </div>

                  <div className="sbj-switch-row">
                    <div className="sbj-switch-label">
                      <h4>Allow student self-enrollment</h4>
                      <p>Students can opt into this elective subject</p>
                    </div>
                    <div className={`sbj-toggle ${selfEnroll ? 'on' : ''}`} onClick={() => setSelfEnroll(!selfEnroll)}></div>
                  </div>

                  <div className="sbj-switch-row">
                    <div className="sbj-switch-label">
                      <h4>Active subject</h4>
                      <p>Subject is live and visible in this academic year</p>
                    </div>
                    <div className={`sbj-toggle ${activeSubject ? 'on' : ''}`} onClick={() => setActiveSubject(!activeSubject)}></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sbj-modal-footer">
              <div className="sbj-req-text">* Required fields</div>
              <div className="sbj-footer-actions">
                <button className="sbj-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="sbj-btn-draft">Save as draft</button>
                <button className="sbj-btn-publish" onClick={() => setIsModalOpen(false)}>Add subject</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}