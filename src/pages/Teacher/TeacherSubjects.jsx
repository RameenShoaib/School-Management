import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const result = await fetch(`${API_BASE}/subjects`).then((r) => r.json());
        setSubjects(result.success ? result.data : []);
      } catch (error) {
        console.error('Teacher subjects fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const query = searchTerm.toLowerCase();
    return subject.subject_name?.toLowerCase().includes(query) ||
      subject.grade_level?.toLowerCase().includes(query) ||
      subject.subject_category?.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/subjects" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Subjects</h2>
          <p>Curriculum subjects available across assigned classes</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search subjects..." />
      </div>

      <div className="tm-table-card">
        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Grade</th>
                <th>Category</th>
                <th>Weekly periods</th>
                <th>Lab</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="tm-empty">Loading subjects...</td></tr>
              ) : filteredSubjects.length > 0 ? filteredSubjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td><strong>{subject.subject_name}</strong><span className="tm-muted">{subject.teacher_name || 'No teacher assigned'}</span></td>
                  <td>{subject.subject_code || '-'}</td>
                  <td>{subject.grade_level || '-'}</td>
                  <td><span className="tm-pill">{subject.subject_category || 'Core'}</span></td>
                  <td>{subject.weekly_periods || '-'}</td>
                  <td>{subject.has_lab ? 'Yes' : 'No'}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="tm-empty">No subjects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
