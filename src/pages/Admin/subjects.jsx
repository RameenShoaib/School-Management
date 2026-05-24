import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // 👉 SweetAlert2 import kiya gaya hai
import DashboardLayout from '../../components/DashboardLayout';
import Header from '../../components/Header/header';
import './subjects.css';

/* Icons */
const IconBook = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>;
const SvgClipboard = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5h6"/><path d="M9 3h6v4H9z"/><path d="M7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M8 12h8M8 16h6"/></svg>;
const SvgBookOpen = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.5A7 7 0 0 0 5 4H3v15h2a7 7 0 0 1 7 2.5"/><path d="M12 6.5A7 7 0 0 1 19 4h2v15h-2a7 7 0 0 0-7 2.5"/><path d="M12 6.5v15"/></svg>;
const SvgCap = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 8 9-4 9 4-9 4-9-4Z"/><path d="M7 10.5v4.2c0 1.2 2.2 2.3 5 2.3s5-1.1 5-2.3v-4.2"/><path d="M21 8v6"/></svg>;
const SvgFolder = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>;
const SvgCalc = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01"/></svg>;
const SvgLanguage = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 5h8M8 3v2M10 5c-.8 4.2-2.8 7.5-6 10"/><path d="M5 9c1.2 2 3 3.7 5.5 5"/><path d="M14 20l4-9 4 9"/><path d="M15.5 17h5"/></svg>;
const SvgUrdu = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16.7 6.5c.9 0 1.6.7 1.6 1.6 0 2.9-2.3 5.3-5.2 5.3H11c-.6 0-1 .4-1 1s.4 1 1 1h6.6v2H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h2.1c1.8 0 3.2-1.5 3.2-3.3 0-.1-.1-.1-.1-.1h-1.7v-2h2.2ZM7.2 17.6c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2Z"/></svg>;
const SvgChart = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-7"/></svg>;
const SvgMore = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"/></svg>;

const getSubjectIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('math')) return <SvgCalc />;
  if (lower.includes('english')) return <SvgLanguage />;
  if (lower.includes('urdu')) return <SvgUrdu />;
  return <SvgBookOpen />;
};

export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectsData, setSubjectsData] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

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

  // 👉 NEW: Bulk Delete Logic for Subjects
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Selection',
        text: 'Bhai, pehle delete karne ke liye subject select toh karein!',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Selected ${selectedRows.length} subject(s) will be deleted permanently!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete selected'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost:5000/api/subjects/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedRows })
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Subjects removed successfully.', timer: 1500, showConfirmButton: false });
          setSelectedRows([]);
          fetchSubjects();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Server connection failed', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedSubjectId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setModalMode('edit');
    setSelectedSubjectId(subject.subject_id);
    setFormData({
      subjectName: subject.subject_name || '',
      subjectCode: subject.subject_code || '',
      gradeLevel: subject.grade_level || '',
      subjectCategory: subject.subject_category || 'Core',
      teacherName: subject.teacher_name || '',
      weeklyPeriods: subject.weekly_periods || '5',
      creditHours: subject.credit_hours || '3',
      isElective: subject.is_elective === true || subject.subject_category === 'Elective',
      hasLab: subject.has_lab === true
    });
    setIsModalOpen(true);
  };

  const handleSaveSubject = async () => {
    if (!formData.subjectName || !formData.gradeLevel) {
      alert("Please fill required fields (Subject Name & Grade Level)!");
      return;
    }

    try {
      const url = modalMode === 'edit'
        ? `http://localhost:5000/api/subjects/${selectedSubjectId}`
        : "http://localhost:5000/api/subjects";
      const response = await fetch(url, {
        method: modalMode === 'edit' ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setModalMode('add');
        setSelectedSubjectId(null);
        setFormData(initialFormState);
        setSelectedRows([]);
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
          <button className="sbj-btn-primary" onClick={openAddModal}>+ Add subject</button>
          <div className="sbj-avatar">SA</div>
        </div>
      </div>

      {/* 👉 HEADER UPDATED WITH ONDELETE PROP */}
      <Header
        onExport={handleExport}
        onRefresh={fetchSubjects}
        onDelete={handleDelete}
        onEdit={() => {
          const subject = subjectsData.find((item) => item.subject_id === selectedRows[0]);
          selectedRows.length === 1 && subject
            ? openEditModal(subject)
            : Swal.fire('Select one subject', 'Choose exactly one subject checkbox, then click Edit.', 'info');
        }}
      />

      <div className="sbj-scroll-wrapper">
        <div className="sbj-stats-row">
          <div className="sbj-stat-card purple">
            <div className="sbj-stat-icon"><SvgClipboard /></div>
            <div className="sbj-stat-copy">
              <span className="sbj-stat-title">Total subjects</span>
              <span className="sbj-stat-value">{subjectsData.length}</span>
              <span className="sbj-stat-sub neutral">Core + elective</span>
            </div>
          </div>
          <div className="sbj-stat-card blue">
            <div className="sbj-stat-icon"><SvgBookOpen /></div>
            <div className="sbj-stat-copy">
              <span className="sbj-stat-title">Core subjects</span>
              <span className="sbj-stat-value">{subjectsData.filter(s => s.subject_category === 'Core').length}</span>
              <span className="sbj-stat-sub blue">Mandatory</span>
            </div>
          </div>
          <div className="sbj-stat-card green">
            <div className="sbj-stat-icon"><SvgCap /></div>
            <div className="sbj-stat-copy">
              <span className="sbj-stat-title">Electives</span>
              <span className="sbj-stat-value">{subjectsData.filter(s => s.subject_category === 'Elective').length}</span>
              <span className="sbj-stat-sub green">Optional</span>
            </div>
          </div>
          <div className="sbj-stat-card orange">
            <div className="sbj-stat-icon"><SvgFolder /></div>
            <div className="sbj-stat-copy">
              <span className="sbj-stat-title">Unassigned</span>
              <span className="sbj-stat-value">0</span>
              <span className="sbj-stat-sub green">All covered</span>
            </div>
          </div>
        </div>

        <div className="sbj-main-grid">
          <div className="sbj-card">
            <div className="sbj-card-heading">
              <span className="sbj-card-heading-icon"><SvgBookOpen /></span>
              <h3 className="sbj-card-title">Subjects overview</h3>
            </div>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>Loading records...</td></tr>
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
                      <td>
                        <div className="sbj-subject-cell">
                          <span className={`sbj-subject-icon color-${sub.subject_id % 4}`}>
                            {getSubjectIcon(sub.subject_name)}
                          </span>
                          <span className="sbj-subject-name">{sub.subject_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`sbj-pill ${sub.subject_category.toLowerCase()}`}>
                          {sub.subject_category}
                        </span>
                      </td>
                      <td>{sub.teacher_name ? 1 : 0}</td>
                      <td>{sub.weekly_periods}</td>
                      <td>--</td>
                      <td>
                        <button className="sbj-more-btn" type="button" aria-label="More subject actions" onClick={() => Swal.fire(sub.subject_name, `Type: ${sub.subject_category}\nGrade: ${sub.grade_level || '-'}\nWeekly periods: ${sub.weekly_periods || '-'}`, 'info')}><SvgMore /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="sbj-right-col">
            <div className="sbj-card">
              <div className="sbj-card-heading">
                <span className="sbj-card-heading-icon"><SvgChart /></span>
                <h3 className="sbj-card-title">Average score by subject</h3>
              </div>
              <div className="sbj-score-box">
                <div className="sbj-score-title">Maths</div>
                <div className="sbj-score-row">
                  <div className="sbj-bar-track">
                    <div className="sbj-bar-fill blue" style={{width: '76%'}}></div>
                  </div>
                  <span className="sbj-bar-val">76%</span>
                </div>
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
                  <h2>{modalMode === 'edit' ? 'Update Subject' : 'Add New Subject'}</h2>
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
                <button className="sbj-btn-publish" onClick={handleSaveSubject}>
                  {modalMode === 'edit' ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
