import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName, isStudentClassRecord } from './studentAccess';
import './StudentModule.css';

export default function StudentExams() {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const [studentsRes, examsRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/exams`).then((r) => r.json()),
        ]);
        const currentStudent = studentsRes.success ? findCurrentStudent(studentsRes.data, user) : null;
        setStudent(currentStudent);
        const records = examsRes.success ? examsRes.data : [];
        setExams(records.filter((exam) => isStudentClassRecord(exam, currentStudent)));
      } catch (error) {
        console.error('Student exams fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user?.email, user?.id]);

  const filteredExams = exams.filter((exam) => {
    const query = searchTerm.toLowerCase();
    return exam.exam_title?.toLowerCase().includes(query) || exam.subject_name?.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="student" currentPath="/student/exams" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>Exams</h2>
          <p>Exam schedule and assessment details for your grade</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-toolbar">
        <input className="sm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search exam or subject..." />
      </div>

      <div className="sm-table-card">
        <div className="sm-table-scroll">
          <table className="sm-table">
            <thead>
              <tr><th>Exam</th><th>Subject</th><th>Date</th><th>Time</th><th>Marks</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="sm-empty">Loading exams...</td></tr>
              ) : filteredExams.length > 0 ? filteredExams.map((exam) => (
                <tr key={exam.exam_id}>
                  <td><strong>{exam.exam_title}</strong><span className="sm-muted">{exam.exam_type || 'Exam'}</span></td>
                  <td>{exam.subject_name || '-'}</td>
                  <td>{exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : '-'}</td>
                  <td>{exam.start_time || '-'}</td>
                  <td>{exam.total_marks || 100}</td>
                  <td><span className="sm-pill green">{exam.status || 'Scheduled'}</span></td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="sm-empty">No exams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
