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
  
  // Database States
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form & Stepper States
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7; 

  const initialFormState = {
    firstName: '', middleName: '', lastName: '', 
    dob: '', gender: '', bloodGroup: '', cnic: '', religion: '',
    email: '', phone: '', address: '', city: '', province: '', postalCode: '',
    grade: '', section: '', rollNo: '', admissionDate: '', prevSchool: '',
    guardianName: '', guardianRelation: '', guardianOccupation: '', guardianContact: '', guardianEmail: '',
    monthlyFee: '', feeDiscount: '', notes: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const result = await response.json();
      if (result.success) {
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
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.address)) {
      alert("Please fill all required (*) fields in Personal Info & Address.");
      return;
    }
    if (step === 2 && (!formData.grade || !formData.section || !formData.admissionDate)) {
      alert("Please fill all required (*) fields in Academic Details.");
      return;
    }
    if (step === 3 && (!formData.guardianName || !formData.guardianContact)) {
      alert("Please fill all required (*) fields in Guardian Info.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleAddStudent = async () => {
    if (!formData.monthlyFee) {
      alert("Please enter the Monthly Fee.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false); 
        setStep(1); 
        setFormData(initialFormState); 
        fetchStudents(); 
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = studentsData.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.rollNo && record.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = filteredRecords.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <DashboardLayout userRole="admin" currentPath="/students" userName="System Admin" userInitials="SA">
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
            <input type="text" placeholder="Search by name, roll no..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        <div className="st-table-scroll">
          <table className="st-table">
            <thead>
              <tr>
                <th>Name</th><th>Roll No</th><th>Grade</th><th>Section</th><th>Guardian</th><th>Fee Status</th><th>Status</th><th></th> 
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>Loading data...</td></tr> : 
               currentRecords.length > 0 ? currentRecords.map((record) => (
                <tr key={record.id}>
                  <td style={{ fontWeight: 600 }}>{record.name}</td>
                  <td>{record.rollNo}</td><td>{record.grade}</td><td>{record.section}</td>
                  <td>{record.guardian}</td>
                  <td><span className={`st-pill ${record.feeClass}`}>{record.feeStatus}</span></td>
                  <td><span className={`st-pill ${record.statusClass}`}>{record.status}</span></td>
                  <td style={{ textAlign: 'right' }}><button className="st-view-btn">View</button></td>
                </tr>
              )) : <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No records found.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* 👇 DYNAMIC PAGINATION FOOTER (Text matched with Teacher page) 👇 */}
        <div className="st-pagination-footer">
          <span className="st-page-info">
            Showing {currentRecords.length} of {filteredRecords.length}
          </span>
          <div className="st-page-buttons">
            <button 
              className="st-page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              &lt;
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index + 1} 
                className={`st-page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button 
              className="st-page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="st-modal-overlay">
          <div className="st-modal">
            
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

            <div className="st-stepper">
              <div className={`st-step ${step >= 1 ? 'active current' : ''}`}><span className="st-step-circle">{step > 1 ? '✓' : '1'}</span> Personal info</div>
              <div className="st-step-line"></div>
              <div className={`st-step ${step >= 2 ? 'active current' : ''}`}><span className="st-step-circle">{step > 2 ? '✓' : '2'}</span> Academic details</div>
              <div className="st-step-line"></div>
              <div className={`st-step ${step >= 3 ? 'active current' : ''}`}><span className="st-step-circle">{step > 3 ? '✓' : '3'}</span> Guardian info</div>
              <div className="st-step-line"></div>
              <div className={`st-step ${step >= 4 ? 'active current' : ''}`}><span className="st-step-circle">4</span> Fee & documents</div>
            </div>

            <div className="st-modal-body">
              {step === 1 && (
                <>
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
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="st-input" placeholder="e.g. Ayesha" />
                      </div>
                      <div className="st-form-group">
                        <label>Middle name</label>
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="st-input" placeholder="Optional" />
                      </div>
                      <div className="st-form-group">
                        <label>Last name <span>*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="st-input" placeholder="e.g. Khan" />
                      </div>
                    </div>

                    <div className="st-form-row-3">
                      <div className="st-form-group">
                        <label>Date of birth <span>*</span></label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="st-input" />
                      </div>
                      <div className="st-form-group">
                        <label>Gender <span>*</span></label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="st-input">
                          <option value="">Select gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                      <div className="st-form-group">
                        <label>Blood group</label>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="st-input">
                          <option value="">Select</option><option value="O+">O+</option><option value="A+">A+</option><option value="B+">B+</option>
                        </select>
                      </div>
                    </div>

                    <div className="st-form-row-3">
                      <div className="st-form-group">
                        <label>CNIC / B-Form number</label>
                        <input type="text" name="cnic" value={formData.cnic} onChange={handleInputChange} className="st-input" placeholder="XXXXX-XXXXXXX-X" />
                      </div>
                      <div className="st-form-group">
                        <label>Religion</label>
                        <select name="religion" value={formData.religion} onChange={handleInputChange} className="st-input">
                          <option value="">Select</option><option value="Islam">Islam</option><option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="st-form-group"></div>
                    </div>
                  </div>

                  <div style={{marginTop: '24px'}}>
                    <div className="st-section-title">Contact & Address</div>
                    <div className="st-form-row-3">
                      <div className="st-form-group">
                        <label>Student email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="st-input" placeholder="✉️ student@school.edu" />
                      </div>
                      <div className="st-form-group">
                        <label>Phone number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="st-input" placeholder="📞 +92 xxx xxxxxxx" />
                      </div>
                      <div className="st-form-group"></div> 
                    </div>

                    <div className="st-form-group" style={{ marginBottom: '16px' }}>
                      <label>Home address <span>*</span></label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="st-input" placeholder="Street, area, city" />
                    </div>

                    <div className="st-form-row-3">
                      <div className="st-form-group">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="st-input" placeholder="e.g. Karachi" />
                      </div>
                      <div className="st-form-group">
                        <label>Province</label>
                        <select name="province" value={formData.province} onChange={handleInputChange} className="st-input">
                          <option value="">Select</option><option value="Sindh">Sindh</option><option value="Punjab">Punjab</option>
                        </select>
                      </div>
                      <div className="st-form-group">
                        <label>Postal code</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="st-input" placeholder="75500" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <div className="st-section-title">Academic Details</div>
                  <div className="st-form-row-3">
                    <div className="st-form-group">
                      <label>Grade <span>*</span></label>
                      <select name="grade" value={formData.grade} onChange={handleInputChange} className="st-input">
                        <option value="">Select grade</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 10">Grade 10</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label>Section <span>*</span></label>
                      <select name="section" value={formData.section} onChange={handleInputChange} className="st-input">
                        <option value="">Select section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label>Roll number</label>
                      <input type="text" className="st-input" placeholder="Auto-generated" disabled />
                    </div>
                  </div>

                  <div className="st-form-row-3">
                    <div className="st-form-group">
                      <label>Admission date <span>*</span></label>
                      <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="st-input" />
                    </div>
                    <div className="st-form-group">
                      <label>Previous school (if any)</label>
                      <input type="text" name="prevSchool" value={formData.prevSchool} onChange={handleInputChange} className="st-input" placeholder="Name of previous school" />
                    </div>
                    <div className="st-form-group"></div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="st-section-title">Guardian Information</div>
                  <div className="st-form-row-3">
                    <div className="st-form-group">
                      <label>Guardian name <span>*</span></label>
                      <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="st-input" placeholder="Full name" />
                    </div>
                    <div className="st-form-group">
                      <label>Relationship</label>
                      <select name="guardianRelation" value={formData.guardianRelation} onChange={handleInputChange} className="st-input">
                        <option value="">Select</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                      </select>
                    </div>
                    <div className="st-form-group">
                      <label>Occupation</label>
                      <input type="text" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleInputChange} className="st-input" placeholder="e.g. Engineer" />
                    </div>
                  </div>

                  <div className="st-form-row-3">
                    <div className="st-form-group">
                      <label>Guardian contact <span>*</span></label>
                      <input type="text" name="guardianContact" value={formData.guardianContact} onChange={handleInputChange} className="st-input" placeholder="📞 +92 xxx xxxxxxx" />
                    </div>
                    <div className="st-form-group">
                      <label>Guardian email</label>
                      <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleInputChange} className="st-input" placeholder="✉️ guardian@email.com" />
                    </div>
                    <div className="st-form-group"></div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="st-section-title">Fee & Documents</div>
                  <div className="st-form-row-3">
                    <div className="st-form-group">
                      <label>Monthly fee (PKR) <span>*</span></label>
                      <input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleInputChange} className="st-input" placeholder="Rs e.g. 4500" />
                    </div>
                    <div className="st-form-group">
                      <label>Fee waiver / discount</label>
                      <select name="feeDiscount" value={formData.feeDiscount} onChange={handleInputChange} className="st-input">
                        <option value="">No discount</option>
                        <option value="10%">10% Sibling discount</option>
                      </select>
                    </div>
                    <div className="st-form-group"></div>
                  </div>

                  <div className="st-alert-box" style={{marginTop: '15px'}}>
                    <IconInfo />
                    <p>Upload at least the birth certificate and guardian CNIC to complete enrollment.</p>
                  </div>

                  <div className="st-form-row-2" style={{ alignItems: 'stretch', marginTop: '15px' }}>
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
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="st-input st-textarea" placeholder="Any special requirements, medical conditions..."></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="st-modal-footer">
              <div className="st-req-text">* Required fields - Step {step} of 4</div>
              <div className="st-footer-actions">
                <button className="st-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                {step > 1 && <button className="st-btn-draft" onClick={prevStep}>← Back</button>}
                {step < 4 ? (
                  <button className="st-btn-publish" onClick={nextStep}>Save & continue →</button>
                ) : (
                  <button className="st-btn-publish" onClick={handleAddStudent} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Registration ✓"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}