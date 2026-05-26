import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName } from './studentAccess';
import './StudentModule.css';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await fetch(`${API_BASE}/students`).then((r) => r.json());
        setStudent(result.success ? findCurrentStudent(result.data, user) : null);
      } catch (error) {
        console.error('Student profile fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, user?.id]);

  return (
    <DashboardLayout userRole="student" currentPath="/student/profile" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>My profile</h2>
          <p>Personal, academic, guardian, and fee information</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <section className="sm-panel">
        <div className="sm-panel-header">
          <h3>Student information</h3>
        </div>
        {loading ? (
          <div className="sm-empty">Loading profile...</div>
        ) : student ? (
          <div className="sm-profile-grid" style={{ padding: 16 }}>
            <div className="sm-info-item"><span>Full name</span><strong>{studentName}</strong></div>
            <div className="sm-info-item"><span>Roll no</span><strong>{student.roll_no || '-'}</strong></div>
            <div className="sm-info-item"><span>Class</span><strong>{student.grade || '-'} - Section {student.section || '-'}</strong></div>
            <div className="sm-info-item"><span>Date of birth</span><strong>{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '-'}</strong></div>
            <div className="sm-info-item"><span>Email</span><strong>{student.email || '-'}</strong></div>
            <div className="sm-info-item"><span>Phone</span><strong>{student.phone || '-'}</strong></div>
            <div className="sm-info-item"><span>Guardian</span><strong>{student.guardian_name || '-'}</strong></div>
            <div className="sm-info-item"><span>Guardian contact</span><strong>{student.guardian_contact || '-'}</strong></div>
            <div className="sm-info-item"><span>Fee status</span><strong>{student.fee_status || 'Pending'}</strong></div>
            <div className="sm-info-item"><span>Status</span><strong>{student.status || 'Active'}</strong></div>
          </div>
        ) : (
          <div className="sm-empty">No profile found for this account.</div>
        )}
      </section>
    </DashboardLayout>
  );
}
