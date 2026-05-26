import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName } from './studentAccess';
import './StudentModule.css';

export default function StudentSubjects() {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/subjects`).then((r) => r.json()),
        ]);
        const currentStudent = studentsRes.success ? findCurrentStudent(studentsRes.data, user) : null;
        setStudent(currentStudent);
        const records = subjectsRes.success ? subjectsRes.data : [];
        setSubjects(records.filter((subject) => currentStudent && subject.grade_level === currentStudent.grade));
      } catch (error) {
        console.error('Student subjects fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user?.email, user?.id]);

  return (
    <DashboardLayout userRole="student" currentPath="/student/subjects" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>Subjects</h2>
          <p>Subjects and curriculum assigned to your grade</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-table-card">
        <div className="sm-table-scroll">
          <table className="sm-table">
            <thead>
              <tr><th>Subject</th><th>Code</th><th>Category</th><th>Teacher</th><th>Weekly periods</th><th>Lab</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="sm-empty">Loading subjects...</td></tr>
              ) : subjects.length > 0 ? subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td><strong>{subject.subject_name}</strong><span className="sm-muted">{subject.grade_level || student?.grade || '-'}</span></td>
                  <td>{subject.subject_code || '-'}</td>
                  <td><span className="sm-pill">{subject.subject_category || 'Core'}</span></td>
                  <td>{subject.teacher_name || '-'}</td>
                  <td>{subject.weekly_periods || '-'}</td>
                  <td>{subject.has_lab ? 'Yes' : 'No'}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="sm-empty">No subjects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
