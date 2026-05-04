import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Teacher.css';

/* Icons */
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const IconTeacher = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconUser = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;

export default function Teacher() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Database States
  const [teachersData, setTeachersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7; 

  // 👇 FORM STATES 👇
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    firstName: '', lastName: '', gender: '', dob: '', 
    cnic: '', phone: '', designation: '', empType: '', 
    email: '', joiningDate: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Data Mangwane ka Function (Alag kar diya taake refresh kar sakein)
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/teachers");
      const result = await response.json();

      if (result.success) {
        const formattedData = result.data.map(teacher => {
          const dateObj = new Date(teacher.joining_date);
          const joinedDate = isNaN(dateObj) ? "Unknown" : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

          return {
            id: teacher.teacher_id,
            name: `${teacher.first_name} ${teacher.last_name}`,
            empId: teacher.emp_id,
            subject: teacher.designation || "Not Assigned",
            classes: 0, 
            students: 0, 
            joined: joinedDate,
            status: teacher.status || 'Active',
            statusClass: teacher.status && teacher.status.toLowerCase() === 'on leave' ? 'status-leave' : 'status-active'
          };
        });
        setTeachersData(formattedData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Could not connect to database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 2. Input handle karna
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Form Submit Karna (Database mein add karna)
  const handleAddTeacher = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.designation || !formData.email) {
      alert("Please fill all required (*) fields (Name, Designation, and Email).");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Teacher added successfully!");
        setIsModalOpen(false); // Modal band karein
        setFormData(initialFormState); // Form khali karein
        fetchTeachers(); // Table ko foran refresh karein
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

  const filteredTeachers = teachersData.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'Active') matchesFilter = teacher.status === 'Active';
    else if (activeFilter === 'On leave') matchesFilter = teacher.status === 'On leave';
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = filteredTeachers.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(filteredTeachers.length / recordsPerPage);

  return (
    <DashboardLayout userRole="admin" currentPath="/teachers" userName="System Admin" userInitials="SA">
      <div className="tc-page-header">
        <div className="tc-header-left">
          <h2>Teachers</h2>
          <p>{teachersData.length} staff members</p>
        </div>
        <div className="tc-header-right">
          <button className="tc-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add teacher</button>
          <button className="tc-btn-secondary">Export</button>
          <div className="tc-avatar">SA</div>
        </div>
      </div>

      <Header />

      

      <div className="tc-table-card">
        <div className="tc-controls-row">
          <div className="tc-search-box">
            <SvgSearch />
            <input type="text" placeholder="Search by name, subject, employee ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="tc-filter-pills">
            {['All', 'Active', 'On leave'].map(filter => (
              <button key={filter} className={`tc-filter-pill ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="tc-table-scroll">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Name</th><th>Emp ID</th><th>Subject</th><th>Classes</th><th>Students</th><th>Joined</th><th>Status</th><th></th> 
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading teachers from database...</td></tr>
              ) : error ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</td></tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((teacher) => (
                  <tr key={teacher.id}>
                    <td style={{ fontWeight: 600 }}>{teacher.name}</td>
                    <td>{teacher.empId}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.classes}</td>
                    <td>{teacher.students}</td>
                    <td>{teacher.joined}</td>
                    <td><span className={`tc-pill ${teacher.statusClass}`}>{teacher.status}</span></td>
                    <td style={{ textAlign: 'right' }}><button className="tc-view-btn">View</button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No teachers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="tc-pagination-footer">
          <span className="tc-page-info">
            Showing {filteredTeachers.length > 0 ? firstRecordIndex + 1 : 0} to {Math.min(lastRecordIndex, filteredTeachers.length)} of {filteredTeachers.length} teachers
          </span>
          <div className="tc-page-buttons">
            <button 
              className="tc-page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              &lt;
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index + 1} 
                className={`tc-page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button 
              className="tc-page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          ✨ ADD NEW TEACHER MODAL (Working Form) ✨
          ========================================= */}
      {isModalOpen && (
        <div className="tc-modal-overlay">
          <div className="tc-modal">
            
            <div className="tc-modal-header">
              <div className="tc-modal-title-group">
                <div className="tc-modal-icon"><IconTeacher /></div>
                <div className="tc-modal-title">
                  <h2>Add New Teacher</h2>
                  <p>Register a new staff member into EduSync</p>
                </div>
              </div>
              <div className="tc-badge-pill">New staff</div>
            </div>

            <div className="tc-modal-body">
              {/* SECTION 1 */}
              <div>
                <div className="tc-section-title">Personal Information</div>
                <div className="tc-photo-upload-row">
                  <div className="tc-photo-circle"><IconUser /></div>
                  <div>
                    <button className="tc-btn-upload">Upload photo</button>
                    <div className="tc-photo-text">JPG or PNG, max 2 MB</div>
                  </div>
                </div>
                <div className="tc-form-row-3">
                  <div className="tc-form-group">
                    <label>First name <span>*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="tc-input" placeholder="e.g. Fatima" />
                  </div>
                  <div className="tc-form-group">
                    <label>Last name <span>*</span></label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="tc-input" placeholder="e.g. Noor" />
                  </div>
                  <div className="tc-form-group">
                    <label>Gender <span>*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="tc-input">
                      <option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option>
                    </select>
                  </div>
                </div>
                <div className="tc-form-row-3">
                  <div className="tc-form-group">
                    <label>Date of birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="tc-input" />
                  </div>
                  <div className="tc-form-group">
                    <label>CNIC number</label>
                    <input type="text" name="cnic" value={formData.cnic} onChange={handleInputChange} className="tc-input" placeholder="XXXXX-XXXXXXX-X" />
                  </div>
                  <div className="tc-form-group">
                    <label>Phone number <span>*</span></label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="tc-input" placeholder="📞 +92 xxx xxxxxxx" />
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div style={{marginTop: '24px'}}>
                <div className="tc-section-title">Professional Details</div>
                <div className="tc-form-row-3">
                  <div className="tc-form-group">
                    <label>Employee ID</label>
                    <input type="text" className="tc-input" placeholder="Auto-generated" disabled />
                  </div>
                  <div className="tc-form-group">
                    <label>Designation <span>*</span></label>
                    <select name="designation" value={formData.designation} onChange={handleInputChange} className="tc-input">
                      <option value="">Select</option>
                      <option value="Senior Teacher">Senior Teacher</option>
                      <option value="Junior Teacher">Junior Teacher</option>
                      <option value="Guest Lecturer">Guest Lecturer</option>
                    </select>
                  </div>
                  <div className="tc-form-group">
                    <label>Employment type</label>
                    <select name="empType" value={formData.empType} onChange={handleInputChange} className="tc-input">
                      <option value="Full time">Full time</option><option value="Part time">Part time</option>
                    </select>
                  </div>
                </div>
                <div className="tc-form-row-2">
                  <div className="tc-form-group">
                    <label>Work email <span>*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="tc-input" placeholder="✉️ teacher@school.edu" />
                  </div>
                  <div className="tc-form-group">
                    <label>Joining date <span>*</span></label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className="tc-input" />
                  </div>
                </div>
              </div>

            </div>

            <div className="tc-modal-footer">
              <div className="tc-req-text">* Required fields</div>
              <div className="tc-footer-actions">
                <button className="tc-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="tc-btn-publish" onClick={handleAddTeacher} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Add teacher ✓"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}