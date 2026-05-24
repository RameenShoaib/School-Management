import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const result = await fetch(`${API_BASE}/exams`).then((r) => r.json());
        setExams(result.success ? result.data : []);
      } catch (error) {
        console.error('Teacher exams fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const query = searchTerm.toLowerCase();
    return exam.exam_title?.toLowerCase().includes(query) ||
      exam.subject_name?.toLowerCase().includes(query) ||
      exam.grade?.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/exams" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Exams</h2>
          <p>Upcoming and scheduled assessments for your classes</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by exam, subject, or class..." />
      </div>

      <div className="tm-table-card">
        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Date</th>
                <th>Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="tm-empty">Loading exams...</td></tr>
              ) : filteredExams.length > 0 ? filteredExams.map((exam) => (
                <tr key={exam.exam_id}>
                  <td><strong>{exam.exam_title}</strong><span className="tm-muted">{exam.exam_type || 'Exam'}</span></td>
                  <td>{exam.subject_name || '-'}</td>
                  <td>{exam.grade || '-'} {exam.section ? `- Section ${exam.section}` : ''}</td>
                  <td>{exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : '-'}</td>
                  <td>{exam.total_marks || 100}</td>
                  <td><span className="tm-pill green">{exam.status || 'Scheduled'}</span></td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="tm-empty">No exams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
