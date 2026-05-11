import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // 👉 SweetAlert2 import kiya gaya hai
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './subjects.css';

/* Icons */
const IconBook = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>;

export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectsData, setSubjectsData] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // 👉 NEW: Checkbox Selection State
  const [selectedRows, setSelectedRows] = useState([]);

  const initialFormState = {
    subjectName: '', subjectCode: '', gradeLevel: '', 
    subjectCategory: 'Core', teacherName: '', weeklyPeriods: '5',
    creditHours: '3', isElective: false, hasLab: false
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/subjects");
      const result = await response.json();
      if (result.success) setSubjectsData(result.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/classes");
      const result = await response.json();
      if (result.success) {
        const uniqueGrades = [...new Set(result.data.map(c => c.grade).filter(Boolean))];
        setAvailableGrades(uniqueGrades);
      }
    } catch (err) { console.error("Failed to fetch classes for grades:", err); }
  };

  useEffect(() => { 
    fetchSubjects(); 
    fetchClasses(); 
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddSubject = async () => {
    if (!formData.subjectName || !formData.gradeLevel) {
      alert("Please fill required fields (Subject Name & Grade Level)!");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData(initialFormState); 
        fetchSubjects(); 
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) { alert("Error connecting to server"); }
  };

  // 👉 Checkbox Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = subjectsData.map(sub => sub.subject_id);
      setSelectedRows(allIds);
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

  const isAllSelected = subjectsData.length > 0 && subjectsData.every(sub => selectedRows.includes(sub.subject_id));

  // 👉 EXPORT TO EXCEL/CSV LOGIC (WITH SWEET ALERT)
  const handleExport = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one subject from the checkboxes to export.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Okay'
      });
      return;
    }

    // Filter only selected subjects
    const selectedData = subjectsData.filter(record => selectedRows.includes(record.subject_id));

    // Create CSV Headers
    const headers = ["Subject ID", "Subject Name", "Type", "Teachers Assigned", "Weekly Classes", "Avg Score"];
    
    // Create CSV Rows Data
    const csvRows = selectedData.map(record => {
      return [
        record.subject_id,
        `"${record.subject_name}"`,
        `"${record.subject_category}"`,
        `"${record.teacher_name ? 1 : 0}"`,
        `"${record.weekly_periods}"`,
        `"--"` // Static dash just like your table view
      ].join(',');
    });

    // Combine Headers and Rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Subjects_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/subjects" userName="System Admin" userInitials="SA">
      <div className="sbj-page-header">
        <div className="sbj-header-left">
          <h2>Subjects</h2>
          <p>{subjectsData.length} subjects across all grades</p>
        </div>
        <div className="sbj-header-right">
          <button className="sbj-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add subject</button>
          <div className="sbj-avatar">SA</div>
        </div>
      </div>

      {/* 👉 HEADER MEIN EXPORT AUR REFRESH CONNECT KAR DIYE HAIN */}
      <Header onExport={handleExport} onRefresh={fetchSubjects} />

      <div className="sbj-scroll-wrapper">
        <div className="sbj-stats-row">
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Total subjects</span>
            <span className="sbj-stat-value">{subjectsData.length}</span>
            <span className="sbj-stat-sub neutral">Core + elective</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Core subjects</span>
            <span className="sbj-stat-value">{subjectsData.filter(s => s.subject_category === 'Core').length}</span>
            <span className="sbj-stat-sub blue">Mandatory</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Electives</span>
            <span className="sbj-stat-value">{subjectsData.filter(s => s.subject_category === 'Elective').length}</span>
            <span className="sbj-stat-sub green">Optional</span>
          </div>
          <div className="sbj-stat-card">
            <span className="sbj-stat-title">Unassigned</span>
            <span className="sbj-stat-value">0</span>
            <span className="sbj-stat-sub green">All covered</span>
          </div>
        </div>

        <div className="sbj-main-grid">
          <div className="sbj-card">
            <h3 className="sbj-card-title">Subjects overview</h3>
            <table className="sbj-table">
              <thead>
                <tr>
                  {/* 👉 Header Checkbox */}
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll} 
                    />
                  </th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Teachers</th>
                  <th>Classes</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>Loading records...</td></tr>
                ) : (
                  subjectsData.map((sub) => (
                    <tr key={sub.subject_id} className={selectedRows.includes(sub.subject_id) ? 'selected-row' : ''}>
                      {/* 👉 Row Checkbox */}
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(sub.subject_id)}
                          onChange={() => handleSelectRow(sub.subject_id)} 
                        />
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                        {sub.subject_name}
                      </td>
                      <td>
                        <span className={`sbj-pill ${sub.subject_category.toLowerCase()}`}>
                          {sub.subject_category}
                        </span>
                      </td>
                      <td style={{ color: '#334155' }}>{sub.teacher_name ? 1 : 0}</td>
                      <td style={{ color: '#334155' }}>{sub.weekly_periods}</td>
                      <td style={{ fontWeight: 600, color: '#334155' }}>--</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="sbj-right-col">
            <div className="sbj-card">
              <h3 className="sbj-card-title">Average score by subject</h3>
              <div className="sbj-bar-row" style={{ marginTop: '16px' }}>
                <span className="sbj-bar-label" style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>Maths</span>
                <div className="sbj-bar-track" style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', margin: '8px 0' }}>
                  <div className="sbj-bar-fill blue" style={{width: '76%', height: '100%', background: '#2563eb', borderRadius: '4px'}}></div>
                </div>
                <span className="sbj-bar-val" style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>76%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="sbj-modal-overlay">
          <div className="sbj-modal">
            <div className="sbj-modal-header">
              <div className="sbj-modal-title-group">
                <div className="sbj-modal-icon"><IconBook /></div>
                <div className="sbj-modal-title">
                  <h2>Add New Subject</h2>
                  <p>Define a new subject for the curriculum</p>
                </div>
              </div>
              <div className="sbj-badge-pill">New Curriculum</div>
            </div>

            <div className="sbj-modal-body">
              <div className="sbj-section-title">General Information</div>
              <div className="sbj-form-row-2">
                <div className="sbj-form-group">
                  <label>Subject Name <span>*</span></label>
                  <input type="text" name="subjectName" value={formData.subjectName} onChange={handleInputChange} className="sbj-input" placeholder="e.g. Mathematics" />
                </div>
                <div className="sbj-form-group">
                  <label>Subject Code</label>
                  <input type="text" name="subjectCode" value={formData.subjectCode} onChange={handleInputChange} className="sbj-input" placeholder="e.g. MATH-101" />
                </div>
              </div>

              <div className="sbj-form-row-2">
                <div className="sbj-form-group">
                  <label>Grade Level <span>*</span></label>
                  <select name="gradeLevel" value={formData.gradeLevel} onChange={handleInputChange} className="sbj-input">
                    <option value="">Select Grade</option>
                    {availableGrades.length > 0 ? (
                      availableGrades.map((g, index) => (
                        <option key={index} value={g}>{g}</option>
                      ))
                    ) : (
                      [...Array(10)].map((_, i) => (
                        <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="sbj-form-group">
                  <label>Subject Category</label>
                  <div className="sbj-radio-group">
                    <label className="sbj-radio-label">
                      <input type="radio" name="subjectCategory" value="Core" checked={formData.subjectCategory === 'Core'} onChange={handleInputChange} />
                      <span className="sbj-radio-circle"></span> Core
                    </label>
                    <label className="sbj-radio-label">
                      <input type="radio" name="subjectCategory" value="Elective" checked={formData.subjectCategory === 'Elective'} onChange={handleInputChange} />
                      <span className="sbj-radio-circle"></span> Elective
                    </label>
                  </div>
                </div>
              </div>

              <div className="sbj-section-title">Settings</div>
              <div className="sbj-switch-card">
                <div className="sbj-switch-row">
                  <div className="sbj-switch-label">
                    <h4>Elective Subject</h4>
                    <p>Mark if students can choose this as an option</p>
                  </div>
                  <div className={`sbj-toggle ${formData.isElective ? 'on' : ''}`} onClick={() => setFormData({...formData, isElective: !formData.isElective})}></div>
                </div>
                <div className="sbj-switch-row">
                  <div className="sbj-switch-label">
                    <h4>Lab Required</h4>
                    <p>Requires practical lab sessions</p>
                  </div>
                  <div className={`sbj-toggle ${formData.hasLab ? 'on' : ''}`} onClick={() => setFormData({...formData, hasLab: !formData.hasLab})}></div>
                </div>
              </div>
            </div>

            <div className="sbj-modal-footer">
              <span className="sbj-req-text">* Required fields</span>
              <div className="sbj-footer-actions">
                <button className="sbj-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="sbj-btn-publish" onClick={handleAddSubject}>Add Subject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}