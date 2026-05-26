import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
};

export default function TeacherClasses() {
  const [teacherName, setTeacherName] = useState('Teacher');
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = getUser();
        const [teachersRes, classesRes] = await Promise.all([
          fetch(`${API_BASE}/teachers`).then((r) => r.json()),
          fetch(`${API_BASE}/classes`).then((r) => r.json()),
        ]);
        const teachers = teachersRes.success ? teachersRes.data : [];
        const matchedTeacher =
          teachers.find((item) => Number(item.user_id) === Number(user.id)) ||
          teachers.find((item) => item.email?.toLowerCase() === user.email?.toLowerCase()) ||
          teachers[0];
        const name = matchedTeacher ? `${matchedTeacher.first_name} ${matchedTeacher.last_name}`.trim() : 'Teacher';

        setTeacherName(name);
        setClasses(classesRes.success ? classesRes.data : []);
      } catch (error) {
        console.error('Teacher classes fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignedClasses = useMemo(() => {
    const target = teacherName.toLowerCase();
    const owned = classes.filter((item) => (
      item.teacher_name?.toLowerCase() === target || item.co_teacher?.toLowerCase() === target
    ));
    return owned.length > 0 ? owned : classes;
  }, [classes, teacherName]);

  const filteredClasses = assignedClasses.filter((item) => {
    const query = searchTerm.toLowerCase();
    return item.grade?.toLowerCase().includes(query) ||
      item.section?.toLowerCase().includes(query) ||
      item.room_number?.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/classes" userName={teacherName} userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>My classes</h2>
          <p>Classes assigned to your timetable and homeroom responsibilities</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by grade, section, or room..." />
      </div>

      <div className="tm-table-card">
        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Room</th>
                <th>Academic year</th>
                <th>Subjects</th>
                <th>Schedule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="tm-empty">Loading classes...</td></tr>
              ) : filteredClasses.length > 0 ? filteredClasses.map((item) => {
                const subjects = Array.isArray(item.subjects) ? item.subjects : [];
                return (
                  <tr key={item.class_id}>
                    <td><strong>{item.grade} - Section {item.section}</strong><span className="tm-muted">{item.teacher_name || 'Teacher not assigned'}</span></td>
                    <td>{item.room_number || 'N/A'}</td>
                    <td>{item.academic_year || 'Current'}</td>
                    <td>{subjects.length > 0 ? subjects.join(', ') : 'No subjects assigned'}</td>
                    <td>{item.start_time || '--'} to {item.end_time || '--'}</td>
                    <td><span className="tm-pill green">{item.status || 'Active'}</span></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" className="tm-empty">No classes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
