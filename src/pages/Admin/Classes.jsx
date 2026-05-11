import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // 👉 SweetAlert2 import kiya gaya hai
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Classes.css';

/* Icons */
const IconSchool = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>;
const IconInfo = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

// Helper function to safely parse null/undefined
const val = (v) => (v !== null && v !== undefined) ? v : '';

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7; 

  // 🗄️ Database States
  const [classesData, setClassesData] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]); 
  const [availableTeachers, setAvailableTeachers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // 📝 Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    grade: '', section: 'A', maxCapacity: '', roomNumber: '', 
    academicYear: '2025 - 2026', notes: '', teacher: '', 
    coTeacher: 'None', startTime: '08:00', endTime: '14:00'
  };
  const [formData, setFormData] = useState(initialFormState);
  const [selectedSubjects, setSelectedSubjects] = useState([]); 
  const [attTracking, setAttTracking] = useState(true);
  const [gradebook, setGradebook] = useState(true);
  const [portalAccess, setPortalAccess] = useState(true);

  // 1. Fetch Classes 
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/classes");
      const result = await response.json();
      
      if (result.success) {
        const formattedData = result.data.map(cls => {
          let subCount = 0;
          try {
             const parsedSubs = typeof cls.subjects === 'string' ? JSON.parse(cls.subjects) : cls.subjects;
             subCount = Array.isArray(parsedSubs) ? parsedSubs.length : 0;
          } catch(e) { subCount = 0; }

          return {
            id: cls.class_id,
            grade: cls.grade,
            section: cls.section,
            teacher: cls.teacher_name,
            students: cls.max_capacity, 
            attendance: Math.floor(Math.random() * 15) + 85, 
            subjects: subCount,
            avgGrade: ["A", "A-", "B+", "B", "B-"][Math.floor(Math.random() * 5)], 
            status: subCount > 0 ? "ACTIVE" : "SUB ASSIGNED",
            statusClass: subCount > 0 ? "cl-status-active" : "cl-status-sub",
            rawData: cls 
          };
        });
        setClassesData(formattedData);
      }
    } catch (err) { console.error("Failed to fetch classes:", err); } 
    finally { setIsLoading(false); }
  };

  const fetchAvailableSubjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subjects");
      const result = await response.json();
      if (result.success) {
        const subjectNames = result.data.map(s => s.subject_name).filter(Boolean);
        setAvailableSubjects([...new Set(subjectNames)]);
      }
    } catch (err) { console.error("Failed to fetch available subjects:", err); }
  };

  const fetchAvailableTeachers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teachers");
      const result = await response.json();
      if (result.success) {
        const teacherNames = result.data.map(t => `${t.first_name} ${t.last_name}`.trim()).filter(Boolean);
        setAvailableTeachers([...new Set(teacherNames)]);
      }
    } catch (err) { console.error("Failed to fetch available teachers:", err); }
  };

  useEffect(() => {
    fetchClasses();
    fetchAvailableSubjects(); 
    fetchAvailableTeachers(); 
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setFormData(initialFormState);
    setSelectedSubjects([]); 
    setAttTracking(true);
    setGradebook(true);
    setPortalAccess(true);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    const c = record.rawData;
    setModalMode('edit');
    setSelectedClassId(record.id);
    
    setFormData({
      grade: val(c.grade),
      section: val(c.section),
      maxCapacity: val(c.max_capacity),
      roomNumber: val(c.room_number),
      academicYear: val(c.academic_year) || '2025 - 2026',
      notes: val(c.notes),
      teacher: val(c.teacher_name),
      coTeacher: val(c.co_teacher) || 'None',
      startTime: val(c.start_time) || '08:00',
      endTime: val(c.end_time) || '14:00'
    });

    let dbSubjects = c.subjects || [];
    if (typeof dbSubjects === 'string') {
      try { dbSubjects = JSON.parse(dbSubjects); } catch(e) { dbSubjects = []; }
    }
    setSelectedSubjects(Array.isArray(dbSubjects) ? dbSubjects : []);

    let settings = c.settings || {};
    if (typeof settings === 'string') {
      try { settings = JSON.parse(settings); } catch(e) { settings = {}; }
    }
    setAttTracking(settings.attTracking !== false);
    setGradebook(settings.gradebook !== false);
    setPortalAccess(settings.portalAccess !== false);

    setIsModalOpen(true);
  };

  const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleSubjectToggle = (subject) => { setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]); };

  const handleFinalSubmit = async () => {
    if (!formData.grade || !formData.teacher || !formData.maxCapacity) {
      alert("Please fill all required (*) fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = { ...formData, subjects: selectedSubjects, settings: { attTracking, gradebook, portalAccess } };
    const url = modalMode === 'add' ? "http://localhost:5000/api/classes" : `http://localhost:5000/api/classes/${selectedClassId}`;
    const method = modalMode === 'add' ? "POST" : "PUT";

    try {
      const response = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (data.success) { setIsModalOpen(false); fetchClasses(); } 
      else { alert("Error: " + data.message); }
    } catch (err) { alert("Failed to connect to server."); } 
    finally { setIsSubmitting(false); }
  };

  // Filters & Pagination Logic
  const filteredRecords = classesData.filter(cls => 
    cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacher && cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = filteredRecords.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVisibleIds = currentRecords.map(cls => cls.id);
      setSelectedRows(allVisibleIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id] 
    );
  };

  const isAllSelected = currentRecords.length > 0 && currentRecords.every(cls => selectedRows.includes(cls.id));

  // 👉 EXPORT TO EXCEL/CSV LOGIC (WITH SWEET ALERT)
  const handleExport = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one class from the checkboxes to export.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Okay'
      });
      return;
    }

    // Filter only selected classes
    const selectedData = classesData.filter(record => selectedRows.includes(record.id));

    // Create CSV Headers
    const headers = ["Class ID", "Grade", "Section", "Class Teacher", "Students Capacity", "Attendance %", "Avg Grade", "Subjects Count", "Status"];
    
    // Create CSV Rows Data
    const csvRows = selectedData.map(record => {
      return [
        record.id,
        `"${record.grade}"`,
        `"${record.section}"`,
        `"${record.teacher || 'Not Assigned'}"`,
        `"${record.students}"`,
        `"${record.attendance}%"`,
        `"${record.avgGrade}"`,
        `"${record.subjects}"`,
        `"${record.status}"`
      ].join(',');
    });

    // Combine Headers and Rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Classes_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/classes" userName="System Admin" userInitials="SA">
      <div className="cl-page-header">
        <div className="cl-header-left">
          <h2>Classes</h2>
          <p>{classesData.length} active classes across grades</p>
        </div>
        <div className="cl-header-right">
          <button className="cl-btn-primary" onClick={openAddModal}>+ Add class</button>
          <div className="cl-avatar">SA</div>
        </div>
      </div>

      {/* 👉 HEADER MEIN EXPORT AUR REFRESH CONNECT KAR DIYE HAIN */}
      <Header onExport={handleExport} onRefresh={fetchClasses} />

      <div className="cl-table-card">
        
        {/* Filters Row */}
        <div className="cl-filters-row">
          <div className="cl-search-input">
            <SvgSearch />
            <input 
              type="text" 
              placeholder="Search by class name, teacher..." 
              value={searchTerm} 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedRows([]); // Reset on search
              }} 
            />
          </div>
          <div className="cl-filter-group">
            <select className="cl-filter-select"><option>All grades</option></select>
            <select className="cl-filter-select"><option>All sections</option></select>
            <select className="cl-filter-select"><option>All statuses</option></select>
          </div>
        </div>

        {/* Table Container */}
        <div className="cl-table-container">
          <table className="cl-list-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll} 
                  />
                </th>
                <th>Class</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Class teacher</th>
                <th>Students</th>
                <th>Attendance</th>
                <th>Avg grade</th>
                <th>Subjects</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading classes...</td></tr>
              ) : currentRecords.length === 0 ? (
                <tr><td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No classes found.</td></tr>
              ) : (
                currentRecords.map((cls) => {
                  return (
                    <tr key={cls.id} className={selectedRows.includes(cls.id) ? 'selected-row' : ''}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(cls.id)}
                          onChange={() => handleSelectRow(cls.id)} 
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{cls.grade} — Section {cls.section}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Room - {cls.rawData.academic_year || '2025-26'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{cls.grade}</td>
                      <td>{cls.section}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: '#334155' }}>
                          {cls.teacher || 'Not Assigned'}
                        </div>
                      </td>
                      <td>
                        <div className="cl-progress-cell">
                          <div className="cl-progress-bar">
                            <div className="cl-progress-fill blue" style={{ width: `${(cls.students / 40) * 100}%` }}></div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{cls.students || 0}/40</span>
                        </div>
                      </td>
                      <td>
                        <div className="cl-progress-cell">
                          <div className="cl-progress-bar">
                            <div className={`cl-progress-fill ${cls.attendance > 90 ? 'green' : 'red'}`} style={{ width: `${cls.attendance}%` }}></div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{cls.attendance}%</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{cls.avgGrade}</td>
                      <td>{cls.subjects}</td>
                      <td><span className={`cl-status-pill ${cls.statusClass}`}>{cls.status}</span></td>
                      <td><button className="cl-btn-view" onClick={() => openEditModal(cls)}>View / Edit</button></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="cl-pagination-footer">
          <span className="cl-page-info">
            Showing {currentRecords.length > 0 ? firstRecordIndex + 1 : 0} to {Math.min(lastRecordIndex, filteredRecords.length)} of {filteredRecords.length} classes
          </span>
          <div className="cl-page-buttons">
            <button className="cl-page-btn" onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setSelectedRows([]); }} disabled={currentPage === 1} style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>&lt;</button>
            {[...Array(totalPages)].map((_, index) => (
              <button key={index + 1} className={`cl-page-btn ${currentPage === index + 1 ? 'active' : ''}`} onClick={() => { setCurrentPage(index + 1); setSelectedRows([]); }}>{index + 1}</button>
            ))}
            <button className="cl-page-btn" onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setSelectedRows([]); }} disabled={currentPage === totalPages || totalPages === 0} style={{ cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}>&gt;</button>
          </div>
        </div>

      </div>

      {/* ======================================= */}
      {/* MODAL */}
      {/* ======================================= */}
      {isModalOpen && (
        <div className="cl-modal-overlay">
          <div className="cl-modal">
            <div className="cl-modal-header">
              <div className="cl-modal-title-group">
                <div className="cl-modal-icon"><IconSchool /></div>
                <div className="cl-modal-title">
                  <h2>{modalMode === 'add' ? 'Add New Class' : 'Update Class Settings'}</h2>
                  <p>{modalMode === 'add' ? 'Create a new class and assign a teacher and subjects' : `Editing settings for ${formData.grade}`}</p>
                </div>
              </div>
              <div className="cl-badge-pill">{modalMode === 'add' ? 'Setup required' : 'Update record'}</div>
            </div>

            <div className="cl-modal-body">
              <div>
                <div className="cl-section-title">Class Details</div>
                <div className="cl-form-row-3">
                  <div className="cl-form-group">
                    <label>Grade <span>*</span></label>
                    <select name="grade" value={formData.grade} onChange={handleInputChange} className="cl-input">
                      <option value="">Select grade</option>
                      {[...Array(10)].map((_, i) => (<option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>))}
                    </select>
                  </div>
                  <div className="cl-form-group">
                    <label>Section <span>*</span></label>
                    <div className="cl-radio-group">
                      {['A', 'B', 'C', 'D'].map(sec => (
                        <label className="cl-radio-label" key={sec}>
                          <input type="radio" name="section" value={sec} checked={formData.section === sec} onChange={handleInputChange} />
                          <span className="cl-radio-circle"></span> {sec}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="cl-form-group">
                    <label>Max capacity <span>*</span></label>
                    <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} className="cl-input" placeholder="e.g. 40" />
                  </div>
                </div>

                <div className="cl-form-row-2">
                  <div className="cl-form-group">
                    <label>Class room number</label>
                    <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} className="cl-input" placeholder="📍 e.g. R-12" />
                  </div>
                  <div className="cl-form-group">
                    <label>Academic year <span>*</span></label>
                    <select name="academicYear" value={formData.academicYear} onChange={handleInputChange} className="cl-input">
                      <option value="2025 - 2026">2025 - 2026</option>
                      <option value="2026 - 2027">2026 - 2027</option>
                    </select>
                  </div>
                </div>

                <div className="cl-form-group">
                  <label>Class description / notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="cl-input cl-textarea" placeholder="Any special notes about this class..."></textarea>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div className="cl-section-title">Teacher Assignment</div>
                <div className="cl-form-row-2">
                  
                  {/* 👉 DYNAMIC CLASS TEACHER */}
                  <div className="cl-form-group">
                    <label>Class / homeroom teacher <span>*</span></label>
                    <select name="teacher" value={formData.teacher} onChange={handleInputChange} className="cl-input">
                      <option value="">Select teacher</option>
                      {availableTeachers.length > 0 ? (
                        availableTeachers.map((tName, i) => (
                          <option key={i} value={tName}>{tName}</option>
                        ))
                      ) : (
                        <option disabled>No teachers found in DB</option>
                      )}
                    </select>
                  </div>

                  {/* 👉 DYNAMIC CO-TEACHER */}
                  <div className="cl-form-group">
                    <label>Co-teacher (optional)</label>
                    <select name="coTeacher" value={formData.coTeacher} onChange={handleInputChange} className="cl-input">
                      <option value="None">None</option>
                      {availableTeachers.map((tName, i) => (
                        <option key={i} value={tName}>{tName}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div className="cl-section-title">Subject & Timetable Assignment</div>
                <div className="cl-alert-box" style={{ marginBottom: '16px' }}>
                  <IconInfo />
                  <p>Assign the subjects that will be taught in this class.</p>
                </div>

                <div className="cl-form-group">
                  <label>Subjects for this class <span>*</span></label>
                  <div className="cl-checkbox-group">
                    {availableSubjects.length > 0 ? availableSubjects.map(sub => (
                      <label className="cl-check-pill" key={sub}>
                        <input type="checkbox" checked={selectedSubjects.includes(sub)} onChange={() => handleSubjectToggle(sub)} />
                        <span className="cl-check-square"></span> {sub}
                      </label>
                    )) : (<p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>No subjects available. Please add subjects first.</p>)}
                  </div>
                </div>

                <div className="cl-form-row-2" style={{ marginTop: '16px' }}>
                  <div className="cl-form-group">
                    <label>School start time</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="cl-input" />
                  </div>
                  <div className="cl-form-group">
                    <label>School end time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="cl-input" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
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

            <div className="cl-modal-footer">
              <div className="cl-req-text">* Required fields</div>
              <div className="cl-footer-actions">
                <button className="cl-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="cl-btn-publish" onClick={handleFinalSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : modalMode === 'add' ? 'Create class' : 'Update class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}