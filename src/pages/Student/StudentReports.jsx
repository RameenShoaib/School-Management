import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName, isStudentClassRecord } from './studentAccess';
import './StudentModule.css';

export default function StudentReports() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes, feesRes, examsRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/attendance`).then((r) => r.json()),
          fetch(`${API_BASE}/fees`).then((r) => r.json()),
          fetch(`${API_BASE}/exams`).then((r) => r.json()),
        ]);

        const currentStudent = studentsRes.success ? findCurrentStudent(studentsRes.data, user) : null;
        setStudent(currentStudent);

        const attendanceRows = attendanceRes.success ? attendanceRes.data : [];
        const feeRows = feesRes.success ? feesRes.data : [];
        const examRows = examsRes.success ? examsRes.data : [];

        setAttendance(attendanceRows.filter((item) => Number(item.student_id) === Number(currentStudent?.student_id)));
        setFees(feeRows.filter((item) => Number(item.student_id) === Number(currentStudent?.student_id)));
        setExams(examRows.filter((item) => isStudentClassRecord(item, currentStudent)));
      } catch (error) {
        console.error('Student reports fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user?.email, user?.id]);

  const present = attendance.filter((item) => item.status === 'Present').length;
  const attendancePercent = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;
  const totalPaid = fees.reduce((sum, item) => sum + Number(item.amount_received || 0), 0);

  return (
    <DashboardLayout userRole="student" currentPath="/student/reports" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>My reports</h2>
          <p>Personal academic, attendance, and fee summary</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-stats-grid">
        <div className="sm-stat-card"><span>Attendance report</span><strong>{attendancePercent}%</strong><small>{attendance.length} marked days</small></div>
        <div className="sm-stat-card"><span>Fee report</span><strong>{totalPaid}</strong><small>PKR paid</small></div>
        <div className="sm-stat-card"><span>Exam report</span><strong>{exams.length}</strong><small>Scheduled for your class</small></div>
        <div className="sm-stat-card"><span>Class</span><strong>{student?.grade || '-'}</strong><small>Section {student?.section || '-'}</small></div>
      </div>

      <section className="sm-panel">
        <div className="sm-panel-header">
          <h3>Available summaries</h3>
        </div>
        {loading ? (
          <div className="sm-empty">Loading reports...</div>
        ) : student ? (
          <div className="sm-list">
            <div className="sm-list-row">
              <div><strong>Attendance summary</strong><span>{present} present days out of {attendance.length} records</span></div>
              <span className="sm-pill">{attendancePercent}%</span>
            </div>
            <div className="sm-list-row">
              <div><strong>Fee payment summary</strong><span>{fees.length} payment records connected to your profile</span></div>
              <span className="sm-pill green">PKR {totalPaid}</span>
            </div>
            <div className="sm-list-row">
              <div><strong>Exam schedule summary</strong><span>{exams.length} exams found for your grade and section</span></div>
              <span className="sm-pill">View only</span>
            </div>
          </div>
        ) : (
          <div className="sm-empty">No student profile is linked with this login account.</div>
        )}
      </section>
    </DashboardLayout>
  );
}
