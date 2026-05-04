import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Classes.css';

/* Icons */
const IconSchool = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>;
const IconInfo = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

export default function Classes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 👇 Database States 👇
  const [classesData, setClassesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 Form States 👇
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    grade: '', section: 'A', maxCapacity: '', roomNumber: '', 
    academicYear: '2025 - 2026', notes: '', teacher: '', 
    coTeacher: 'None', startTime: '08:00', endTime: '14:00'
  };
  const [formData, setFormData] = useState(initialFormState);
  
  // Subjects Checkbox State
  const [selectedSubjects, setSelectedSubjects] = useState(['Mathematics', 'English', 'Science', 'Urdu', 'Social Studies']);
  
  // Toggles State
  const [attTracking, setAttTracking] = useState(true);
  const [gradebook, setGradebook] = useState(true);
  const [portalAccess, setPortalAccess] = useState(true);

  // 1. Fetch Classes from Database
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/classes");
      const result = await response.json();
      
      if (result.success) {
        // Format API data to match UI needs
        const formattedData = result.data.map(cls => ({
          id: cls.class_id,
          grade: cls.grade,
          section: `Section ${cls.section}`,
          teacher: cls.teacher_name,
          students: cls.max_capacity, // Temporary using capacity as students count
          attendance: "95%", // Mock placeholder
          subjects: cls.subjects ? cls.subjects.length : 0,
          avgGrade: "B+", // Mock placeholder
          status: "Active",
          statusClass: "active"
        }));
        setClassesData(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 2. Handle Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Checkboxes
  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  // 3. Submit Form
  const handleAddClass = async () => {
    if (!formData.grade || !formData.teacher || !formData.maxCapacity) {
      alert("Please fill all required (*) fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...formData,
      subjects: selectedSubjects,
      settings: { attTracking, gradebook, portalAccess }
    };

    try {
      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setSelectedSubjects(['Mathematics', 'English', 'Science', 'Urdu', 'Social Studies']);
        fetchClasses(); // Refresh Table
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

  return (
    <DashboardLayout userRole="admin" currentPath="/classes" userName="System Admin" userInitials="SA">
      <div className="cl-page-header">
        <div className="cl-header-left">
          <h2>Classes</h2>
          <p>{classesData.length} active classes across grades</p>
        </div>
        <div className="cl-header-right">
          <button className="cl-btn-primary" onClick={() => setIsModalOpen(true)}>+ Add class</button>
          <div className="cl-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="cl-stats-row">
        <div className="cl-stat-card">
          <span className="cl-stat-title">Total classes</span>
          <span className="cl-stat-value">{classesData.length}</span>
          <span className="cl-stat-sub neutral">Grades 1 - 10</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Avg class size</span>
          <span className="cl-stat-value">39</span>
          <span className="cl-stat-sub neutral">Students per class</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Sections</span>
          <span className="cl-stat-value">A, B, C, D</span>
          <span className="cl-stat-sub green">Configured</span>
        </div>
        <div className="cl-stat-card">
          <span className="cl-stat-title">Full capacity</span>
          <span className="cl-stat-value">94%</span>
          <span className="cl-stat-sub orange">Near max</span>
        </div>
      </div>

      <div className="cl-scroll-wrapper">
        <div className="cl-cards-grid">
          {isLoading ? (
            <div style={{ padding: '2rem', color: '#64748b' }}>Loading classes...</div>
          ) : classesData.length === 0 ? (
            <div style={{ padding: '2rem', color: '#64748b' }}>No classes found. Add your first class!</div>
          ) : (
            classesData.map((cls) => (
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
                    <span className="cl-inner-label">Capacity</span>
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
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="cl-modal-overlay">
          <div className="cl-modal">
            
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

            <div className="cl-modal-body">
              
              {/* SECTION 1: CLASS DETAILS */}
              <div>
                <div className="cl-section-title">Class Details</div>
                
                <div className="cl-form-row-3">
                  <div className="cl-form-group">
                    <label>Grade <span>*</span></label>
                    <select name="grade" value={formData.grade} onChange={handleInputChange} className="cl-input">
                      <option value="">Select grade</option>
                      <option value="Grade 1">Grade 1</option><option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option><option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option><option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option><option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option><option value="Grade 10">Grade 10</option>
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
                    <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} className="cl-input" placeholder="🚪 e.g. R-12" />
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

              {/* SECTION 2: TEACHER ASSIGNMENT */}
              <div style={{ marginTop: '24px' }}>
                <div className="cl-section-title">Teacher Assignment</div>
                <div className="cl-form-row-2">
                  <div className="cl-form-group">
                    <label>Class / homeroom teacher <span>*</span></label>
                    <select name="teacher" value={formData.teacher} onChange={handleInputChange} className="cl-input">
                      <option value="">Select teacher</option>
                      <option value="Ms. Fatima Noor">Ms. Fatima Noor</option>
                      <option value="Mr. Ahmed Raza">Mr. Ahmed Raza</option>
                      <option value="Ms. Hira Khan">Ms. Hira Khan</option>
                    </select>
                  </div>
                  <div className="cl-form-group">
                    <label>Co-teacher (optional)</label>
                    <select name="coTeacher" value={formData.coTeacher} onChange={handleInputChange} className="cl-input">
                      <option value="None">None</option>
                      <option value="Ms. Sana">Ms. Sana</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SUBJECT ASSIGNMENT */}
              <div style={{ marginTop: '24px' }}>
                <div className="cl-section-title">Subject & Timetable Assignment</div>
                
                <div className="cl-alert-box" style={{ marginBottom: '16px' }}>
                  <IconInfo />
                  <p>Assign the subjects that will be taught in this class.</p>
                </div>

                <div className="cl-form-group">
                  <label>Subjects for this class <span>*</span></label>
                  <div className="cl-checkbox-group">
                    {['Mathematics', 'English', 'Science', 'Urdu', 'Social Studies', 'Physics', 'Computer Science', 'Art & Design'].map(sub => (
                      <label className="cl-check-pill" key={sub}>
                        <input 
                          type="checkbox" 
                          checked={selectedSubjects.includes(sub)} 
                          onChange={() => handleSubjectToggle(sub)} 
                        />
                        <span className="cl-check-square"></span> {sub}
                      </label>
                    ))}
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

              {/* SECTION 4: CLASS SETTINGS */}
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
                <button className="cl-btn-publish" onClick={handleAddClass} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create class'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}