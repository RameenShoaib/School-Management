import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, classesRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/classes`).then((r) => r.json()),
        ]);
        setStudents(studentsRes.success ? studentsRes.data : []);
        setClasses(classesRes.success ? classesRes.data : []);
      } catch (error) {
        console.error('Teacher students fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const classOptions = useMemo(() => {
    const fromClasses = classes.map((item) => `${item.grade}-${item.section}`);
    const fromStudents = students.map((item) => `${item.grade}-${item.section}`);
    return [...new Set([...fromClasses, ...fromStudents].filter((item) => item && !item.startsWith('undefined')))].sort();
  }, [classes, students]);

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.toLowerCase();
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const classKey = `${student.grade}-${student.section}`;
    const matchesSearch = fullName.includes(query) || student.roll_no?.toLowerCase().includes(query);
    const matchesClass = classFilter === 'all' || classKey === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/students" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>My students</h2>
          <p>Roster view for class monitoring and quick lookup</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or roll no..." />
        <select className="tm-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All classes</option>
          {classOptions.map((item) => <option key={item} value={item}>{item.replace('-', ' - Section ')}</option>)}
        </select>
      </div>

      <div className="tm-table-card">
        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll no</th>
                <th>Class</th>
                <th>Guardian</th>
                <th>Fee status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="tm-empty">Loading students...</td></tr>
              ) : filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td><strong>{student.first_name} {student.last_name}</strong><span className="tm-muted">{student.email || 'No email'}</span></td>
                  <td>{student.roll_no || '-'}</td>
                  <td>{student.grade} - Section {student.section}</td>
                  <td>{student.guardian_name || '-'}</td>
                  <td><span className={`tm-pill ${student.fee_status === 'Paid' ? 'green' : 'yellow'}`}>{student.fee_status || 'Pending'}</span></td>
                  <td>{student.status || 'Active'}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="tm-empty">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
