import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const teacherNameFromRecord = (teacher) => {
  if (!teacher) return 'Teacher';
  return `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || teacher.email || 'Teacher';
};

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();
  const teacherName = teacherNameFromRecord(teacher);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [teachersRes, classesRes, studentsRes, attendanceRes, examsRes] = await Promise.all([
          fetch(`${API_BASE}/teachers`).then((r) => r.json()),
          fetch(`${API_BASE}/classes`).then((r) => r.json()),
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/attendance`).then((r) => r.json()),
          fetch(`${API_BASE}/exams`).then((r) => r.json()),
        ]);

        const teachers = teachersRes.success ? teachersRes.data : [];
        const matchedTeacher =
          teachers.find((item) => Number(item.user_id) === Number(user?.id)) ||
          teachers.find((item) => item.email?.toLowerCase() === user?.email?.toLowerCase()) ||
          teachers[0] ||
          null;

        setTeacher(matchedTeacher);
        setClasses(classesRes.success ? classesRes.data : []);
        setStudents(studentsRes.success ? studentsRes.data : []);
        setAttendance(attendanceRes.success ? attendanceRes.data : []);
        setExams(examsRes.success ? examsRes.data : []);
      } catch (error) {
        console.error('Teacher dashboard fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.email, user?.id]);

  const assignedClasses = useMemo(() => {
    if (!teacherName || teacherName === 'Teacher') return classes;
    return classes.filter((item) => {
      const mainTeacher = item.teacher_name?.toLowerCase();
      const coTeacher = item.co_teacher?.toLowerCase();
      const target = teacherName.toLowerCase();
      return mainTeacher === target || coTeacher === target;
    });
  }, [classes, teacherName]);

  const classKeys = useMemo(
    () => new Set(assignedClasses.map((item) => `${item.grade}-${item.section}`)),
    [assignedClasses]
  );

  const assignedStudents = students.filter((student) => classKeys.has(`${student.grade}-${student.section}`));
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((item) => item.attendance_date?.startsWith(today));
  const presentToday = todayAttendance.filter((item) => item.status === 'Present').length;
  const upcomingExams = exams
    .filter((exam) => !exam.exam_date || new Date(exam.exam_date) >= new Date(today))
    .slice(0, 5);

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/dashboard" userName={teacherName} userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Teacher dashboard</h2>
          <p>{loading ? 'Loading your workspace...' : `Welcome back, ${teacherName}`}</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-stats-grid">
        <div className="tm-stat-card">
          <span>Assigned classes</span>
          <strong>{assignedClasses.length}</strong>
          <small>Homeroom or co-teacher</small>
        </div>
        <div className="tm-stat-card">
          <span>My students</span>
          <strong>{assignedStudents.length}</strong>
          <small>Across assigned classes</small>
        </div>
        <div className="tm-stat-card">
          <span>Present today</span>
          <strong>{presentToday}</strong>
          <small>Marked attendance records</small>
        </div>
        <div className="tm-stat-card">
          <span>Upcoming exams</span>
          <strong>{upcomingExams.length}</strong>
          <small>Scheduled from today onward</small>
        </div>
      </div>

      <div className="tm-two-col">
        <section className="tm-panel">
          <div className="tm-panel-header">
            <h3>My classes</h3>
            <a href="/teacher/classes">View all</a>
          </div>
          <div className="tm-list">
            {assignedClasses.length > 0 ? assignedClasses.slice(0, 5).map((item) => (
              <div className="tm-list-row" key={item.class_id}>
                <div>
                  <strong>{item.grade} - Section {item.section}</strong>
                  <span>Room {item.room_number || 'N/A'} | {item.academic_year || 'Current year'}</span>
                </div>
                <span className="tm-pill">{item.max_capacity || 0} seats</span>
              </div>
            )) : <div className="tm-empty">No classes assigned yet.</div>}
          </div>
        </section>

        <section className="tm-panel">
          <div className="tm-panel-header">
            <h3>Upcoming exams</h3>
            <a href="/teacher/exams">View all</a>
          </div>
          <div className="tm-list">
            {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
              <div className="tm-list-row" key={exam.exam_id}>
                <div>
                  <strong>{exam.exam_title}</strong>
                  <span>{exam.subject_name || 'Subject'} | {exam.grade || 'Class'} {exam.section || ''}</span>
                </div>
                <span className="tm-pill">{exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : 'Unscheduled'}</span>
              </div>
            )) : <div className="tm-empty">No upcoming exams found.</div>}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
