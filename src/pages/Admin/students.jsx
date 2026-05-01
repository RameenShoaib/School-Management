import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './students.css';

/* Icons */
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const IconStudent = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>;
const IconUser = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const IconFolder = () => <svg width="24" height="24" fill="#fbbf24" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>;
const IconInfo = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 👇 Nayi States Database Data ke liye 👇
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Component load hotay hi Data fetch karna
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students");
        const result = await response.json();

        if (result.success) {
          // Data ko frontend format mein map kar rahe hain
          const formattedData = result.data.map(student => ({
            id: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
            rollNo: student.roll_no,
            grade: student.grade,
            section: student.section,
            guardian: student.guardian_name,
            feeStatus: student.fee_status ? student.fee_status.toUpperCase() : "PENDING",
            feeClass: student.fee_status ? student.fee_status.toLowerCase() : "pending",
            status: student.status ? student.status.toUpperCase() : "ACTIVE",
            statusClass: student.status && student.status.toLowerCase() === 'on leave' ? 'leave' : 'active'
          }));
          
          setStudentsData(formattedData);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Could not connect to database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty array ka matlab hai sirf page load par chalega

  // Filtering Logic
  const filteredRecords = studentsData.filter(record => {
    return (
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.includes(searchTerm) ||
      record.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/students" 
      userName="System Admin" 
      userInitials="SA"
    >
      <div className="st-page-header">
        <div className="st-header-left">
          <h2>Students Directory</h2>
          <p>Manage all student records, fee status, and details</p>
        </div>
        <div className="st-header-right">
          <button className="st-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add student</button>
          <button className="st-btn-secondary">Export</button>
          <div className="st-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="st-table-card">
        <div className="st-search-area">
          <div className="st-search-box">
            <SvgSearch />
            <input 
              type="text" 
              placeholder="Search by name, roll no, class..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="st-table-scroll">
          <table className="st-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Guardian</th>
                <th>Fee Status</th>
                <th>Status</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              {/* 👇 Loading & Error Handling 👇 */}
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading students from database...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    {error}
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 600 }}>{record.name}</td>
                    <td>{record.rollNo}</td>
                    <td>{record.grade}</td>
                    <td>{record.section}</td>
                    <td>{record.guardian}</td>
                    <td><span className={`st-pill ${record.feeClass}`}>{record.feeStatus}</span></td>
                    <td><span className={`st-pill ${record.statusClass}`}>{record.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="st-view-btn">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="st-pagination-footer">
          <span className="st-page-info">Showing {filteredRecords.length} records</span>
          <div className="st-page-buttons">
            <button className="st-page-btn active">1</button>
            <button className="st-page-btn">2</button>
            <button className="st-page-btn">3</button>
            <button className="st-page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* =========================================
          ✨ ADD STUDENT MODAL ✨ (Untouched)
          ========================================= */}
      {isModalOpen && (
        <div className="st-modal-overlay">
          <div className="st-modal">
            
            {/* Modal Header */}
            <div className="st-modal-header">
              <div className="st-modal-title-group">
                <div className="st-modal-icon"><IconStudent /></div>
                <div className="st-modal-title">
                  <h2>Add New Student</h2>
                  <p>Register a new student into the school system</p>
                </div>
              </div>
              <div className="st-badge-pill">New enrollment</div>
            </div>

            {/* Stepper tracker */}
            <div className="st-stepper">
              <div className="st-step active"><span className="st-step-icon">✓</span> Personal info</div>
              <div className="st-step-line"></div>
              <div className="st-step current"><span className="st-step-circle">2</span> Academic details</div>
              <div className="st-step-line"></div>
              <div className="st-step"><span className="st-step-circle">3</span> Guardian info</div>
              <div className="st-step-line"></div>
              <div className="st-step"><span className="st-step-circle">4</span> Fee & documents</div>
            </div>

            {/* Modal Body */}
            <div className="st-modal-body">
              
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div>
                <div className="st-section-title">Personal Information</div>
                
                <div className="st-photo-upload-row">
                  <div className="st-photo-circle"><IconUser /></div>
                  <div>
                    <button className="st-btn-upload">Upload photo</button>
                    <div className="st-photo-text">JPG or PNG, max 2 MB</div>
                  </div>
                </div>

                <div className="st-form-row-3">
                  <div className="st-form-group">
                    <label>First name <span>*</span></label>
                    <input type="text" className="st-input" placeholder="e.g. Ayesha" />
                  </div>
                  <div className="st-form-group">
                    <label>Middle name</label>
                    <input type="text" className="st-input" placeholder="Optional" />
                  </div>
                  <div className="st-form-group">
                    <label>Last name <span>*</span></label>
                    <input type="text" className="st-input" placeholder="e.g. Khan" />
                  </div>
                </div>

                <div className="st-form-row-3">
                  <div className="st-form-group">
                    <label>Date of birth <span>*</span></label>
                    <input type="date" className="st-input" />
                  </div>
                  <div className="st-form-group">
                    <label>Gender <span>*</span></label>
                    <select className="st-input">
                      <option>Select gender</option>
                      <option>Female</option>
                      <option>Male</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label>Blood group</label>
                    <select className="st-input">
                      <option>Select</option>
                      <option>O+</option>
                      <option>A+</option>
                      <option>B+</option>
                    </select>
                  </div>
                </div>

                <div className="st-form-row-2">
                  <div className="st-form-group">
                    <label>CNIC / B-Form number</label>
                    <input type="text" className="st-input" placeholder="XXXXX-XXXXXXX-X" />
                  </div>
                  <div className="st-form-group">
                    <label>Religion</label>
                    <select className="st-input">
                      <option>Select</option>
                      <option>Islam</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONTACT & ADDRESS */}
              <div>
                <div className="st-section-title">Contact & Address</div>
                
                <div className="st-form-row-2">
                  <div className="st-form-group">
                    <label>Student email</label>
                    <input type="email" className="st-input" placeholder="✉️ student@school.edu" />
                  </div>
                  <div className="st-form-group">
                    <label>Phone number</label>
                    <input type="text" className="st-input" placeholder="📞 +92 xxx xxxxxxx" />
                  </div>
                </div>

                <div className="st-form-group" style={{ marginBottom: '16px' }}>
                  <label>Home address <span>*</span></label>
                  <input type="text" className="st-input" placeholder="Street, area, city" />
                </div>

                <div className="st-form-row-3">
                  <div className="st-form-group">
                    <label>City</label>
                    <input type="text" className="st-input" placeholder="e.g. Karachi" />
                  </div>
                  <div className="st-form-group">
                    <label>Province</label>
                    <select className="st-input">
                      <option>Select</option>
                      <option>Sindh</option>
                      <option>Punjab</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label>Postal code</label>
                    <input type="text" className="st-input" placeholder="75500" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ACADEMIC DETAILS */}
              <div>
                <div className="st-section-title">Academic Details</div>
                
                <div className="st-form-row-3">
                  <div className="st-form-group">
                    <label>Grade <span>*</span></label>
                    <select className="st-input">
                      <option>Select grade</option>
                      <option>Grade 7</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label>Section <span>*</span></label>
                    <select className="st-input">
                      <option>Select section</option>
                      <option>A</option>
                      <option>B</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label>Roll number</label>
                    <input type="text" className="st-input" placeholder="Auto-generated" disabled />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Leave blank to auto-assign</span>
                  </div>
                </div>

                <div className="st-form-row-2">
                  <div className="st-form-group">
                    <label>Admission date <span>*</span></label>
                    <input type="date" className="st-input" defaultValue="2026-04-20" />
                  </div>
                  <div className="st-form-group">
                    <label>Previous school (if any)</label>
                    <input type="text" className="st-input" placeholder="Name of previous school" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: GUARDIAN INFORMATION */}
              <div>
                <div className="st-section-title">Guardian Information</div>
                
                <div className="st-form-row-3">
                  <div className="st-form-group">
                    <label>Guardian name <span>*</span></label>
                    <input type="text" className="st-input" placeholder="Full name" />
                  </div>
                  <div className="st-form-group">
                    <label>Relationship</label>
                    <select className="st-input">
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label>Occupation</label>
                    <input type="text" className="st-input" placeholder="e.g. Engineer" />
                  </div>
                </div>

                <div className="st-form-row-2">
                  <div className="st-form-group">
                    <label>Guardian contact <span>*</span></label>
                    <input type="text" className="st-input" placeholder="📞 +92 xxx xxxxxxx" />
                  </div>
                  <div className="st-form-group">
                    <label>Guardian email</label>
                    <input type="email" className="st-input" placeholder="✉️ guardian@email.com" />
                  </div>
                </div>
              </div>

              {/* SECTION 5: FEE & DOCUMENTS */}
              <div>
                <div className="st-section-title">Fee & Documents</div>
                
                <div className="st-form-row-2">
                  <div className="st-form-group">
                    <label>Monthly fee (PKR) <span>*</span></label>
                    <input type="text" className="st-input" placeholder="Rs e.g. 4500" />
                  </div>
                  <div className="st-form-group">
                    <label>Fee waiver / discount</label>
                    <select className="st-input">
                      <option>No discount</option>
                      <option>10% Sibling discount</option>
                    </select>
                  </div>
                </div>

                <div className="st-alert-box">
                  <IconInfo />
                  <p>Upload at least the birth certificate and guardian CNIC to complete enrollment.</p>
                </div>

                <div className="st-form-row-2" style={{ alignItems: 'stretch' }}>
                  <div className="st-form-group">
                    <label>Documents to upload</label>
                    <div className="st-upload-area">
                      <IconFolder />
                      <p><span>Click to upload</span> documents</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Birth cert, CNIC, transfer cert - PDF, JPG</p>
                    </div>
                  </div>
                  <div className="st-form-group">
                    <label>Additional notes</label>
                    <textarea className="st-input st-textarea" placeholder="Any special requirements, medical conditions, or notes..."></textarea>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="st-modal-footer">
              <div className="st-req-text">* Required fields - Step 2 of 4</div>
              <div className="st-footer-actions">
                <button className="st-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="st-btn-draft">← Back</button>
                <button className="st-btn-publish" onClick={() => setIsModalOpen(false)}>Save & continue →</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}