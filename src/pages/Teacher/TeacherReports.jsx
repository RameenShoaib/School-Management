import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './TeacherModule.css';

const API_BASE = 'http://localhost:5000/api';

export default function TeacherReports() {
  const [snapshot, setSnapshot] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [snapshotRes, recentRes] = await Promise.all([
          fetch(`${API_BASE}/reports/snapshot`).then((r) => r.json()),
          fetch(`${API_BASE}/reports/recent`).then((r) => r.json()),
        ]);
        setSnapshot(snapshotRes.success ? snapshotRes.data : []);
        setRecentReports(recentRes.success ? recentRes.data : []);
      } catch (error) {
        console.error('Teacher reports fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <DashboardLayout userRole="teacher" currentPath="/teacher/reports" userName="Teacher" userInitials="TR">
      <div className="tm-page-header">
        <div>
          <h2>Reports</h2>
          <p>Read-only reporting snapshots for teacher workflows</p>
        </div>
        <div className="tm-avatar">TR</div>
      </div>

      <div className="tm-stats-grid">
        {snapshot.length > 0 ? snapshot.map((item) => (
          <div className="tm-stat-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.val}</strong>
            <small>Current school snapshot</small>
          </div>
        )) : (
          <div className="tm-stat-card">
            <span>Reports</span>
            <strong>{loading ? '...' : 0}</strong>
            <small>No snapshot data available</small>
          </div>
        )}
      </div>

      <section className="tm-panel">
        <div className="tm-panel-header">
          <h3>Recent reports</h3>
        </div>
        <div className="tm-list">
          {recentReports.length > 0 ? recentReports.map((report) => (
            <div className="tm-list-row" key={report.report_id}>
              <div>
                <strong>{report.report_name}</strong>
                <span>{report.report_type} | {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'No date'}</span>
              </div>
              <span className="tm-pill">{report.format || 'PDF'}</span>
            </div>
          )) : <div className="tm-empty">{loading ? 'Loading reports...' : 'No reports found.'}</div>}
        </div>
      </section>
    </DashboardLayout>
  );
}
