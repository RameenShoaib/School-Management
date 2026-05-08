import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './reports.css';

/* Purane Icons wapis */
const IconReport = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>;
const IconSearch = ({ className }) => <svg className={className} width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedType, setSelectedType] = useState('attendance');
  const [exportFormat, setExportFormat] = useState('PDF');

  const fetchData = async () => {
    try {
      const snapRes = await fetch('http://localhost:5000/api/reports/snapshot').then(r => r.json());
      const recentRes = await fetch('http://localhost:5000/api/reports/recent').then(r => r.json());
      if (snapRes.success) setSnapshot(snapRes.data);
      if (recentRes.success) setRecentReports(recentRes.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportName: `${selectedType.toUpperCase()} Export - ${new Date().toLocaleDateString()}`,
          reportType: selectedType,
          format: exportFormat,
          generatedBy: 'System Admin'
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
        Swal.fire({ icon: 'success', title: 'Generated', showConfirmButton: false, timer: 1500 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("EduSync Official Report", 105, 20, { align: "center" });
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["ID", report.report_id],
        ["Name", report.report_name],
        ["Type", report.report_type],
        ["Date", new Date(report.created_at).toLocaleString()]
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] } 
    });
    doc.save(`${report.report_name}.pdf`);
  };

  const downloadCSV = (report) => {
    const filename = `${report.report_name.replace(/\s+/g, '_')}.csv`;
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["ID,Name,Type,Date", `${report.report_id},${report.report_name},${report.report_type},${report.created_at}`].join("\n");
    window.open(encodeURI(csvContent));
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/reports" userName="System Admin" userInitials="SA">
      <div className="fm-page-header">
        <div className="fm-header-left">
          <h2>Reports</h2>
          <p>Generate and view school data exports</p>
        </div>
        <div className="fm-header-right">
          <button className="fm-btn-primary" onClick={() => setIsModalOpen(true)}>Generate report</button>
          <div className="fm-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="fm-table-card">
        <div className="rep-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
          {/* Snapshot Section */}
          <div className="rep-card-box" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px' }}>
             <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>School Snapshot</h3>
             {snapshot.map((s, i) => (
               <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>{s.label}</span>
                    <b>{s.val}</b>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '70%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                  </div>
               </div>
             ))}
          </div>

          {/* History Section */}
          <div className="rep-card-box" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px' }}>
             <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Recent Reports</h3>
             <div className="rep-list">
                {recentReports.map(r => (
                  <div key={r.report_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '13px' }}>
                      <b>{r.report_name}</b><br/>
                      <small style={{ color: '#64748b' }}>{r.format} • {new Date(r.created_at).toLocaleDateString()}</small>
                    </div>
                    <button 
                      onClick={() => r.format === 'PDF' ? generatePDF(r) : downloadCSV(r)}
                      style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                    >Download</button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fm-modal-overlay">
          <div className="fm-modal">
            <div className="fm-modal-header"><h2>Generate Report</h2></div>
            <div className="fm-modal-body">
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Select Type</label>
              <select className="fm-input" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="attendance">Attendance</option>
                <option value="fees">Fees</option>
                <option value="academic">Academic</option>
              </select>

              <label style={{ fontSize: '12px', display: 'block', margin: '15px 0 5px' }}>Export Format</label>
              <select className="fm-input" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option value="PDF">PDF Document</option>
                <option value="Excel">Excel Sheet</option>
              </select>
            </div>
            <div className="fm-modal-footer">
              <button className="fm-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="fm-btn-publish" onClick={handleGenerate} disabled={loading}>{loading ? 'Wait...' : 'Generate'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}