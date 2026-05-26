import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [draftStatus, setDraftStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, attendanceRes, teachersRes] = await Promise.all([
        fetch(`${API_BASE}/students`).then((r) => r.json()),
        fetch(`${API_BASE}/attendance`).then((r) => r.json()),
        fetch(`${API_BASE}/teachers`).then((r) => r.json()),
      ]);
      setStudents(studentsRes.success ? studentsRes.data : []);
      setAttendance(attendanceRes.success ? attendanceRes.data : []);
      setTeachers(teachersRes.success ? teachersRes.data : []);
    } catch (error) {
      console.error('Teacher attendance fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const classOptions = useMemo(
    () => [...new Set(students.map((item) => `${item.grade}-${item.section}`).filter(Boolean))].sort(),
    [students]
  );

  const filteredStudents = students.filter((student) => {
    const classKey = `${student.grade}-${student.section}`;
    return classFilter === 'all' || classKey === classFilter;
  });

  const statusForStudent = (studentId) => {
    if (draftStatus[studentId]) return draftStatus[studentId];
    const record = attendance.find((item) => Number(item.student_id) === Number(studentId) && item.attendance_date?.startsWith(date));
    return record?.status || 'Unmarked';
  };

  const setAll = (status) => {
    const next = {};
    filteredStudents.forEach((student) => {
      next[student.student_id] = status;
    });
    setDraftStatus(next);
  };

  const submitAttendance = async () => {
    const selectedStudents = filteredStudents.filter((student) => draftStatus[student.student_id]);
    if (selectedStudents.length === 0) {
      Swal.fire('No changes', 'Mark at least one student before saving.', 'info');
      return;
    }

    const teacher = teachers[0];
    const attendanceList = selectedStudents.map((student) => ({
      student_id: student.student_id,
      status: draftStatus[student.student_id],
      remarks: '',
    }));

    try {
      const response = await fetch(`${API_BASE}/attendance/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          classId: 1,
          markedBy: teacher?.teacher_id || 'Teacher',
          attendanceList,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Saved', 'Attendance saved successfully.', 'success');
        setDraftStatus({});
        fetchData();
      } else {
        Swal.fire('Error', data.message || 'Could not save attendance.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Server connection failed.', 'error');
    }
  };

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/attendance" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Class attendance</h2>
          <p>Mark attendance for your class roster</p>
        </div>
        <button className="tm-action primary" onClick={submitAttendance}>Save attendance</button>
      </div>

      <div className="tm-toolbar">
        <input className="tm-search" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="tm-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All classes</option>
          {classOptions.map((item) => <option key={item} value={item}>{item.replace('-', ' - Section ')}</option>)}
        </select>
        <button className="tm-action" onClick={() => setAll('P')}>Mark all present</button>
        <button className="tm-action" onClick={() => setAll('A')}>Mark all absent</button>
      </div>

      <div className="tm-table-card">
        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Current status</th>
                <th>Mark</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="tm-empty">Loading roster...</td></tr>
              ) : filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td><strong>{student.first_name} {student.last_name}</strong><span className="tm-muted">{student.roll_no || '-'}</span></td>
                  <td>{student.grade} - Section {student.section}</td>
                  <td><span className="tm-pill">{statusForStudent(student.student_id)}</span></td>
                  <td>
                    <select className="tm-select" value={draftStatus[student.student_id] || ''} onChange={(e) => setDraftStatus({ ...draftStatus, [student.student_id]: e.target.value })}>
                      <option value="">No change</option>
                      <option value="P">Present</option>
                      <option value="A">Absent</option>
                      <option value="L">Late</option>
                      <option value="H">Holiday</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="tm-empty">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
