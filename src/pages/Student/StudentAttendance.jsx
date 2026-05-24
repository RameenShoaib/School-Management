import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName } from './studentAccess';
import './StudentModule.css';

export default function StudentAttendance() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes, teachersRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/attendance`).then((r) => r.json()),
          fetch(`${API_BASE}/teachers`).then((r) => r.json()),
        ]);
        const currentStudent = studentsRes.success ? findCurrentStudent(studentsRes.data, user) : null;
        setStudent(currentStudent);
        const records = attendanceRes.success ? attendanceRes.data : [];
        setAttendance(records.filter((item) => Number(item.student_id) === Number(currentStudent?.student_id)));
        setTeachers(teachersRes.success ? teachersRes.data : []);
      } catch (error) {
        console.error('Student attendance fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user?.email, user?.id]);

  const present = attendance.filter((item) => item.status === 'Present').length;
  const absent = attendance.filter((item) => item.status === 'Absent').length;
  const late = attendance.filter((item) => item.status === 'Late').length;
  const percent = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;

  const getMarkedByName = (markedBy) => {
    if (!markedBy) return '-';

    const teacher = teachers.find((item) => Number(item.teacher_id) === Number(markedBy));
    if (teacher) {
      return `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || teacher.email || `Teacher ${markedBy}`;
    }

    return String(markedBy);
  };

  return (
    <DashboardLayout userRole="student" currentPath="/student/attendance" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>Attendance</h2>
          <p>Your attendance record and daily status history</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-stats-grid">
        <div className="sm-stat-card"><span>Attendance</span><strong>{percent}%</strong><small>Overall present rate</small></div>
        <div className="sm-stat-card"><span>Present</span><strong>{present}</strong><small>Total present days</small></div>
        <div className="sm-stat-card"><span>Absent</span><strong>{absent}</strong><small>Total absent days</small></div>
        <div className="sm-stat-card"><span>Late</span><strong>{late}</strong><small>Late arrivals</small></div>
      </div>

      <div className="sm-table-card">
        <div className="sm-table-scroll">
          <table className="sm-table">
            <thead>
              <tr><th>Date</th><th>Status</th><th>Remarks</th><th>Marked by</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="sm-empty">Loading attendance...</td></tr>
              ) : attendance.length > 0 ? attendance.map((item) => (
                <tr key={item.attendance_id}>
                  <td>{item.attendance_date ? new Date(item.attendance_date).toLocaleDateString() : '-'}</td>
                  <td><span className={`sm-pill ${item.status === 'Present' ? 'green' : item.status === 'Absent' ? 'red' : 'yellow'}`}>{item.status}</span></td>
                  <td>{item.remarks || '-'}</td>
                  <td>{getMarkedByName(item.marked_by)}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="sm-empty">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
