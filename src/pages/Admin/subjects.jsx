import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './subjects.css';

/* Icons */
const IconBook = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>;

export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectsData, setSubjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 Form States matching your Modal UI
  const initialFormState = {
    subjectName: '', subjectCode: '', gradeLevel: '', 
    subjectCategory: 'Core', teacherName: '', weeklyPeriods: '5',
    creditHours: '3', isElective: false, hasLab: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Fetch data from backend[cite: 1]
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

  useEffect(() => { fetchSubjects(); }, []);

  // 2. Handle Input Changes[cite: 1]
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // 3. Submit Form to Backend[cite: 1]
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
        setFormData(initialFormState); // Reset form
        fetchSubjects(); // Refresh table[cite: 1]
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) { 
      alert("Error connecting to server"); 
    }
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/subjects" userName="System Admin" userInitials="SA">
      {/* Header Section matched to Screenshot[cite: 1] */}
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

      <Header />

      

      <div className="sbj-scroll-wrapper">
        {/* Stats Row from CSS[cite: 1] */}
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
          {/* Subjects Table[cite: 1] */}
          <div className="sbj-card">
            <h3 className="sbj-card-title">Subjects overview</h3><br />
            <table className="sbj-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Teachers</th>
                  <th>Classes</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Loading records...</td></tr>
                ) : (
                  subjectsData.map((sub) => (
                    <tr key={sub.subject_id}>
                      <td>{sub.subject_name}</td>
                      <td>
                        <span className={`sbj-pill ${sub.subject_category.toLowerCase()}`}>
                          {sub.subject_category}
                        </span>
                      </td>
                      <td>{sub.teacher_name ? 1 : 0}</td>
                      <td>{sub.weekly_periods}</td>
                      <td>--</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar Section from Screenshot[cite: 1] */}
          <div className="sbj-right-col">
            <div className="sbj-card">
              <h3 className="sbj-card-title">Average score by subject</h3><br />
              <div className="sbj-bar-row">
                <span className="sbj-bar-label">Maths</span>
                <div className="sbj-bar-track"><div className="sbj-bar-fill blue" style={{width: '76%'}}></div></div>
                <span className="sbj-bar-val">76%</span>
              </div>
              {/* Add more mock bars as per UI needs */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - UI strictly matched to your CSS[cite: 1] */}
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
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 10">Grade 10</option>
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