import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { API_BASE, findCurrentStudent, getStoredUser, getStudentInitials, getStudentName } from './studentAccess';
import './StudentModule.css';

export default function StudentFees() {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const studentName = getStudentName(student);
  const initials = getStudentInitials(student);

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const [studentsRes, feesRes] = await Promise.all([
          fetch(`${API_BASE}/students`).then((r) => r.json()),
          fetch(`${API_BASE}/fees`).then((r) => r.json()),
        ]);
        const currentStudent = studentsRes.success ? findCurrentStudent(studentsRes.data, user) : null;
        setStudent(currentStudent);
        const records = feesRes.success ? feesRes.data : [];
        setFees(records.filter((item) => Number(item.student_id) === Number(currentStudent?.student_id)));
      } catch (error) {
        console.error('Student fees fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [user?.email, user?.id]);

  const totalPaid = fees.reduce((sum, item) => sum + Number(item.amount_received || 0), 0);
  const totalDue = fees.reduce((sum, item) => sum + Number(item.amount_due || 0), 0);

  return (
    <DashboardLayout userRole="student" currentPath="/student/fees" userName={studentName} userInitials={initials}>
      <div className="sm-page-header">
        <div>
          <h2>Fees</h2>
          <p>Fee payment history and current account status</p>
        </div>
        <div className="sm-avatar">{initials}</div>
      </div>

      <div className="sm-stats-grid">
        <div className="sm-stat-card"><span>Monthly fee</span><strong>{student?.monthly_fee || 0}</strong><small>PKR configured</small></div>
        <div className="sm-stat-card"><span>Total paid</span><strong>{totalPaid}</strong><small>PKR received</small></div>
        <div className="sm-stat-card"><span>Total due</span><strong>{totalDue}</strong><small>PKR billed</small></div>
        <div className="sm-stat-card"><span>Status</span><strong>{student?.fee_status || 'Pending'}</strong><small>Current account state</small></div>
      </div>

      <div className="sm-table-card">
        <div className="sm-table-scroll">
          <table className="sm-table">
            <thead>
              <tr><th>Month</th><th>Payment date</th><th>Due</th><th>Received</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="sm-empty">Loading fees...</td></tr>
              ) : fees.length > 0 ? fees.map((item) => (
                <tr key={item.payment_id}>
                  <td><strong>{item.fee_month || '-'}</strong><span className="sm-muted">{item.payment_type || 'Monthly fee'}</span></td>
                  <td>{item.payment_date ? new Date(item.payment_date).toLocaleDateString() : '-'}</td>
                  <td>PKR {item.amount_due || 0}</td>
                  <td>PKR {item.amount_received || 0}</td>
                  <td>{item.payment_method || '-'}</td>
                  <td><span className="sm-pill green">Paid</span></td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="sm-empty">No fee payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
