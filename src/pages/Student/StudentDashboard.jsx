import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName, isStudentClassRecord } from './studentAccess';
import './StudentModule.css';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes, examsRes, feesRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/attendance`).then((r) => r.json()),
          fetch(`${API_BASE}/exams`).then((r) => r.json()),
          fetch(`${API_BASE}/fees`).then((r) => r.json()),
        ]);

        const students = studentsRes.success ? studentsRes.data : [];
        const currentStudent = findCurrentStudent(students, user);
        setStudent(currentStudent);
        setAttendance(attendanceRes.success ? attendanceRes.data : []);
        setExams(examsRes.success ? examsRes.data : []);
        setFees(feesRes.success ? feesRes.data : []);
      } catch (error) {
        console.error('Student dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.email, user?.id]);

  const myAttendance = attendance.filter((item) => Number(item.student_id) === Number(student?.student_id));
  const presentCount = myAttendance.filter((item) => item.status === 'Present').length;
  const attendancePercent = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const myExams = useMemo(() => exams.filter((exam) => isStudentClassRecord(exam, student)), [exams, student]);

  const myFees = fees.filter((item) => Number(item.student_id) === Number(student?.student_id));
  const paidTotal = myFees.reduce((sum, item) => sum + Number(item.amount_received || 0), 0);

  return (
    <DashboardLayout userRole="student" currentPath="/student/dashboard" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>Student dashboard</h2>
          <p>{loading ? 'Loading your portal...' : `${student?.grade || 'Grade'} - Section ${student?.section || '-'}`}</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-stats-grid">
        <div className="sm-stat-card">
          <span>Attendance</span>
          <strong>{attendancePercent}%</strong>
          <small>{myAttendance.length} marked days</small>
        </div>
        <div className="sm-stat-card">
          <span>Upcoming exams</span>
          <strong>{myExams.length}</strong>
          <small>For your grade</small>
        </div>
        <div className="sm-stat-card">
          <span>Fee paid</span>
          <strong>{paidTotal}</strong>
          <small>PKR received</small>
        </div>
        <div className="sm-stat-card">
          <span>Roll no</span>
          <strong>{student?.roll_no || '-'}</strong>
          <small>Current enrollment</small>
        </div>
      </div>

      <div className="sm-two-col">
        <section className="sm-panel">
          <div className="sm-panel-header">
            <h3>Upcoming exams</h3>
            <a href="/student/exams">View all</a>
          </div>
          <div className="sm-list">
            {myExams.length > 0 ? myExams.slice(0, 5).map((exam) => (
              <div className="sm-list-row" key={exam.exam_id}>
                <div>
                  <strong>{exam.exam_title}</strong>
                  <span>{exam.subject_name || 'Subject'} | {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : 'Unscheduled'}</span>
                </div>
                <span className="sm-pill">{exam.status || 'Scheduled'}</span>
              </div>
            )) : <div className="sm-empty">No exams found.</div>}
          </div>
        </section>

        <section className="sm-panel">
          <div className="sm-panel-header">
            <h3>My profile</h3>
            <a href="/student/profile">Details</a>
          </div>
          <div className="sm-profile-grid" style={{ padding: 16 }}>
            <div className="sm-info-item"><span>Name</span><strong>{studentName}</strong></div>
            <div className="sm-info-item"><span>Guardian</span><strong>{student?.guardian_name || '-'}</strong></div>
            <div className="sm-info-item"><span>Email</span><strong>{student?.email || '-'}</strong></div>
            <div className="sm-info-item"><span>Status</span><strong>{student?.status || 'Active'}</strong></div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
