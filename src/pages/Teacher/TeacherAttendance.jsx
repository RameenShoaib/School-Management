import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';
import Header from '../../components/Header/header';
import TeacherListView from './TeacherListView';
import './TeacherModule.css';
import { API_BASE, filterAssignedClasses, filterByClassKeys, findCurrentTeacher, getClassKey, getInitials, getStoredUser, getTeacherName } from './teacherModuleData';

const AttendancePageIcon = ({ type }) => {
  const paths = {
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    close: <><circle cx="12" cy="12" r="9" /><path d="M15 9 9 15M9 9l6 6" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    prev: <path d="m15 18-6-6 6-6" />,
    next: <path d="m9 18 6-6-6-6" />
  };

  return (
    <svg className="tm-att-icon-svg" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
};

const getStudentInitials = (student) => {
  const first = student.first_name?.[0] || '';
  const last = student.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'ST';
};

const normalizeAttendanceStatus = (status) => {
  const map = { P: 'Present', A: 'Absent', L: 'Late', H: 'Holiday' };
  return map[status] || status || 'Unmarked';
};

const attendanceColumns = [
  { key: 'student', label: 'Student', defaultWidth: 280, visible: true },
  { key: 'class', label: 'Class', defaultWidth: 220, visible: true },
  { key: 'currentStatus', label: 'Current status', defaultWidth: 180, visible: true },
  { key: 'mark', label: 'Mark', defaultWidth: 240, visible: true },
  { key: 'rollNo', label: 'Roll no', defaultWidth: 140, visible: false },
  { key: 'grade', label: 'Grade', defaultWidth: 130, visible: false },
  { key: 'section', label: 'Section', defaultWidth: 130, visible: false }
];

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [draftStatus, setDraftStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = getStoredUser();
      const [studentsRes, attendanceRes, teachersRes, classesRes] = await Promise.all([
        fetch(`${API_BASE}/students`).then((r) => r.json()),
        fetch(`${API_BASE}/attendance`).then((r) => r.json()),
        fetch(`${API_BASE}/teachers`).then((r) => r.json()),
        fetch(`${API_BASE}/classes`).then((r) => r.json()),
      ]);
      const teachersData = teachersRes.success ? teachersRes.data : [];
      const matchedTeacher = findCurrentTeacher(teachersData, user);
      setStudents(studentsRes.success ? studentsRes.data : []);
      setAttendance(attendanceRes.success ? attendanceRes.data : []);
      setTeachers(teachersData);
      setClasses(classesRes.success ? classesRes.data : []);
      setCurrentTeacher(matchedTeacher);
    } catch (error) {
      console.error('Teacher attendance fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const teacherName = getTeacherName(currentTeacher);
  const teacherInitials = getInitials(teacherName);
  const assignedClasses = useMemo(() => filterAssignedClasses(classes, teacherName), [classes, teacherName]);
  const assignedClassKeys = useMemo(() => new Set(assignedClasses.map(getClassKey)), [assignedClasses]);
  const assignedStudents = useMemo(() => filterByClassKeys(students, assignedClassKeys), [students, assignedClassKeys]);

  const classOptions = useMemo(
    () => [...new Set(assignedStudents.map(getClassKey).filter(Boolean))].sort(),
    [assignedStudents]
  );

  const filteredStudents = assignedStudents.filter((student) => {
    const query = searchTerm.toLowerCase();
    const classKey = getClassKey(student);
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(query) ||
      String(student.roll_no || '').toLowerCase().includes(query) ||
      String(student.grade || '').toLowerCase().includes(query);
    const matchesClass = classFilter === 'all' || classKey === classFilter;
    return matchesSearch && matchesClass;
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
          markedBy: currentTeacher?.teacher_id || teachers[0]?.teacher_id || 'Teacher',
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

  const renderAttendanceCell = (student, column) => {
    const values = {
      class: `${student.grade || '-'} - Section ${student.section || '-'}`,
      currentStatus: <span className={`tm-att-status ${String(statusForStudent(student.student_id)).toLowerCase()}`}>{normalizeAttendanceStatus(statusForStudent(student.student_id))}</span>,
      mark: (
        <label className="tm-att-mark-select">
          <select value={draftStatus[student.student_id] || ''} onChange={(e) => setDraftStatus({ ...draftStatus, [student.student_id]: e.target.value })}>
            <option value="">No change</option>
            <option value="P">Present</option>
            <option value="A">Absent</option>
            <option value="L">Late</option>
            <option value="H">Holiday</option>
          </select>
          <AttendancePageIcon type="chevron" />
        </label>
      ),
      rollNo: student.roll_no || '-',
      grade: student.grade || '-',
      section: student.section || '-'
    };

    if (column.key === 'student') {
      return (
        <div className="tm-att-student-cell">
          <span className={`tm-att-avatar color-${student.student_id % 4}`}>{getStudentInitials(student)}</span>
          <div>
            <strong>{student.first_name} {student.last_name}</strong>
            <span>{student.roll_no || '-'}</span>
          </div>
        </div>
      );
    }

    return values[column.key] || '-';
  };

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/attendance" userName={teacherName} userInitials={teacherInitials}>
      <div className="tm-att-page">
        <div className="tm-att-header">
          <div className="tm-att-title-group">
            <span className="tm-att-title-icon"><AttendancePageIcon type="calendar" /></span>
            <div>
              <h1>Class attendance</h1>
              <p>Mark attendance for your class roster</p>
            </div>
          </div>
          <button className="tm-att-save-btn" onClick={submitAttendance}><AttendancePageIcon type="save" /> Save attendance</button>
        </div>
        <Header />

        <div className="tm-att-toolbar">
          <label className="tm-att-control">
            <AttendancePageIcon type="calendar" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="tm-att-control tm-att-select-control">
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All classes</option>
              {classOptions.map((item) => <option key={item} value={item}>{item.replace('-', ' - Section ')}</option>)}
            </select>
            <AttendancePageIcon type="chevron" />
          </label>
          <button className="tm-att-bulk present" onClick={() => setAll('P')}><AttendancePageIcon type="check" /> Mark all present</button>
          <button className="tm-att-bulk absent" onClick={() => setAll('A')}><AttendancePageIcon type="close" /> Mark all absent</button>
        </div>

        <TeacherListView
          storageKey="edusync.teacher.attendance.columnView.v1"
          columnDefinitions={attendanceColumns}
          rows={filteredStudents}
          getRowId={(student) => student.student_id}
          renderCell={renderAttendanceCell}
          isLoading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by student, roll no, or grade..."
          emptyMessage="No students found."
          itemLabel="students"
        />
      </div>
    </DashboardLayout>
  );
}
