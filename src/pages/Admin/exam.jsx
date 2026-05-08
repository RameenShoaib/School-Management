import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './exam.css';

/* SVG Icons */
const IconCalendar = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>;
const IconSettings = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47,0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>;
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

export default function Exams() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🚀 Dynamic Data States
  const [examsList, setExamsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [classesList, setClassesList] = useState([]);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Initial State
  const [formData, setFormData] = useState({
    examTitle: '',
    examType: '',
    subjectId: '',
    classId: '',
    examDate: '',
    startTime: '',
    duration: '2 hours',
    roomNumber: '',
    invigilatorId: '',
    totalMarks: 100,
    passingMarks: 50,
    weightagePercent: 30,
    gradingScale: 'A-F grades',
    notifyPortal: true,
    sendSms: true,
    autoPublish: false
  });

  // 🌍 Fetch all data
  const fetchAllData = async () => {
    try {
      const [examsRes, teachersRes, subjectsRes, classesRes] = await Promise.all([
        fetch('http://localhost:5000/api/exams').then(r => r.json()),
        fetch('http://localhost:5000/api/teachers').then(r => r.json()),
        fetch('http://localhost:5000/api/subjects').then(r => r.json()),
        fetch('http://localhost:5000/api/classes').then(r => r.json())
      ]);

      if (examsRes.success) setExamsList(examsRes.data);
      if (teachersRes.success) setTeachersList(teachersRes.data);
      if (subjectsRes.success) setSubjectsList(subjectsRes.data);
      if (classesRes.success) setClassesList(classesRes.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (toggleName) => {
    setFormData((prev) => ({ ...prev, [toggleName]: !prev[toggleName] }));
  };

  // 📝 Schedule Exam (STRICT FK FIX)
  const handleScheduleExam = async () => {
    // 1. Client-side Validation
    if (!formData.examTitle || !formData.subjectId || !formData.classId || !formData.examDate) {
      Swal.fire('Required', 'Please select a Subject, Class, and Date.', 'warning');
      return;
    }

    setIsLoading(true);

    // 2. 🔥 Strict Data Conversion (Final Safety Net)
    const payload = {
      ...formData,
      subjectId: parseInt(formData.subjectId, 10),
      classId: parseInt(formData.classId, 10),
      invigilatorId: formData.invigilatorId ? parseInt(formData.invigilatorId, 10) : null,
      totalMarks: parseInt(formData.totalMarks, 10) || 100,
      passingMarks: parseInt(formData.passingMarks, 10) || 50,
      weightagePercent: parseInt(formData.weightagePercent, 10) || 0
    };

    try {
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', 'Exam Scheduled!', 'success');
        setFormData({
          examTitle: '', examType: '', subjectId: '', classId: '',
          examDate: '', startTime: '', duration: '2 hours', roomNumber: '', invigilatorId: '',
          totalMarks: 100, passingMarks: 50, weightagePercent: 30, gradingScale: 'A-F grades',
          notifyPortal: true, sendSms: true, autoPublish: false
        });
        setIsModalOpen(false);
        fetchAllData(); 
      } else {
        // Detailed error show karega agar abhi bhi FK violation hui
        throw new Error(data.message || 'Database error occurred');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Scheduling Failed',
        text: error.message,
        footer: 'Check if Step 1 SQL query was run in Neon DB'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExams = examsList.filter(exam => 
    exam.exam_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/exams" 
      userName="System Admin" 
      userInitials="SA"
    >
      <div className="ex-page-header">
        <div className="ex-header-left">
          <h2>Exams Dashboard</h2>
          <p>View and manage school examinations</p>
        </div>
        <div className="ex-header-right">
          <button className="ex-btn-primary" onClick={() => setIsModalOpen(true)}>
            + Schedule exam
          </button>
          <div className="ex-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="ex-table-card">
        <div className="ex-card-header">
            <h3>Scheduled Exams List</h3>
        </div>

        <div className="ex-search-area">
          <div className="ex-search-box">
            <SvgSearch />
            <input 
              type="text" 
              placeholder="Search by title or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="ex-table-scroll">
          <table className="ex-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Exam Title</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Date</th>
                <th>Invigilator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam.exam_id}>
                    <td>{exam.exam_id}</td>
                    <td style={{ fontWeight: 600 }}>{exam.exam_title}</td>
                    <td>{exam.exam_type}</td>
                    <td>{exam.subject_name || '-'}</td>
                    <td>{exam.grade} {exam.section ? `(${exam.section})` : ''}</td>
                    <td>{exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : '-'}</td>
                    <td>{exam.invigilator_first_name || 'N/A'}</td>
                    <td><span className="ex-pill pass">{exam.status || 'Scheduled'}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No examinations found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="ex-modal-overlay">
          <div className="ex-modal">
            
            <div className="ex-modal-header">
              <div className="ex-modal-title-group">
                <div className="ex-modal-icon"><IconCalendar /></div>
                <div className="ex-modal-title">
                  <h2>Schedule New Exam</h2>
                  <p>Assign subject, class, and date for the exam</p>
                </div>
              </div>
            </div>

            <div className="ex-modal-body">
              <div className="ex-section-title">📱 EXAM DETAILS</div>
              
              <div className="ex-form-row-2">
                <div className="ex-form-group">
                  <label>Exam title <span>*</span></label>
                  <input name="examTitle" value={formData.examTitle} onChange={handleInputChange} className="ex-input" placeholder="Mid-term 2026" />
                </div>
                <div className="ex-form-group">
                  <label>Exam type <span>*</span></label>
                  <select name="examType" value={formData.examType} onChange={handleInputChange} className="ex-input">
                    <option value="">Select type</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Final-Term">Final-Term</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
              </div>

              <div className="ex-form-row-2">
                <div className="ex-form-group">
                  <label>Subject <span>*</span></label>
                  <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className="ex-input">
                    <option value="">Select Subject</option>
                    {subjectsList.map(subj => (
                      <option key={subj.subject_id} value={subj.subject_id}>{subj.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div className="ex-form-group">
                  <label>Class & Section <span>*</span></label>
                  <select name="classId" value={formData.classId} onChange={handleInputChange} className="ex-input">
                    <option value="">Select Class</option>
                    {classesList.map(cls => (
                      <option key={cls.class_id} value={cls.class_id}>{cls.grade} - {cls.section}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ex-form-row-3">
                <div className="ex-form-group">
                  <label>Exam date <span>*</span></label>
                  <input type="date" name="examDate" value={formData.examDate} onChange={handleInputChange} className="ex-input" />
                </div>
                <div className="ex-form-group">
                  <label>Start time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="ex-input" />
                </div>
                <div className="ex-form-group">
                  <label>Duration</label>
                  <select name="duration" value={formData.duration} onChange={handleInputChange} className="ex-input">
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
              </div>

              <div className="ex-section-title"><IconSettings /> CONFIGURATION</div>
              
              <div className="ex-form-row-4">
                <div className="ex-form-group">
                  <label>Total marks</label>
                  <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleInputChange} className="ex-input" />
                </div>
                <div className="ex-form-group">
                  <label>Passing marks</label>
                  <input type="number" name="passingMarks" value={formData.passingMarks} onChange={handleInputChange} className="ex-input" />
                </div>
                <div className="ex-form-group">
                    <label>Weightage %</label>
                    <input type="number" name="weightagePercent" value={formData.weightagePercent} onChange={handleInputChange} className="ex-input" />
                </div>
                <div className="ex-form-group">
                  <label>Grading</label>
                  <select name="gradingScale" value={formData.gradingScale} onChange={handleInputChange} className="ex-input">
                    <option value="A-F grades">A-F grades</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
              </div>

              <div className="ex-switch-list">
                <div className="ex-switch-row">
                  <div className="ex-switch-label">
                    <h4>Notify students</h4>
                  </div>
                  <div className={`ex-toggle ${formData.notifyPortal ? 'on' : ''}`} onClick={() => handleToggle('notifyPortal')}></div>
                </div>
                <div className="ex-switch-row">
                  <div className="ex-switch-label">
                    <h4>Send SMS</h4>
                  </div>
                  <div className={`ex-toggle ${formData.sendSms ? 'on' : ''}`} onClick={() => handleToggle('sendSms')}></div>
                </div>
              </div>

            </div>

            <div className="ex-modal-footer">
              <div className="ex-footer-actions">
                <button className="ex-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button 
                  className="ex-btn-publish" 
                  onClick={handleScheduleExam}
                  disabled={isLoading}
                >
                  {isLoading ? 'Wait...' : 'Schedule Exam'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}