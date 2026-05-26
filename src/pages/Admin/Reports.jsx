import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DashboardLayout from '../../components/DashboardLayout';
import Header from '../../components/Header/header';
import './reports.css';

const SvgDownload = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
  </svg>
);

const SvgSchool = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 10h.01M15 10h.01" />
  </svg>
);

const SvgUsers = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SvgClass = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 5h16v11H4zM8 21h8M12 16v5" />
  </svg>
);

const SvgWallet = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 7h18v14H3zM3 7l3-4h12l3 4M16 14h3" />
  </svg>
);

const SvgReportList = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 3h8l2 2v16H6V5l2-2zM9 12h6M9 16h6M9 8h3" />
  </svg>
);

const SvgFilePdf = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6v20h12V6l-4-4zM14 2v4h4" />
    <path d="M8 15h8M8 18h5" />
  </svg>
);

const SvgFileExcel = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6v20h12V6l-4-4zM14 2v4h4M9 11l5 6M14 11l-5 6" />
  </svg>
);

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedType, setSelectedType] = useState('attendance');
  const [exportFormat, setExportFormat] = useState('PDF');

  const fetchData = async () => {
    try {
      const snapRes = await fetch('http://localhost:5000/api/reports/snapshot').then((r) => r.json());
      const recentRes = await fetch('http://localhost:5000/api/reports/recent').then((r) => r.json());
      if (snapRes.success) setSnapshot(snapRes.data);
      if (recentRes.success) setRecentReports(recentRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setSelectedReports([]);
    await fetchData();
    Swal.fire({
      icon: 'success',
      title: 'Reports refreshed',
      showConfirmButton: false,
      timer: 900
    });
  };

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('EduSync Official Report', 105, 20, { align: 'center' });
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['ID', report.report_id],
        ['Name', report.report_name],
        ['Type', report.report_type],
        ['Date', new Date(report.created_at).toLocaleString()]
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] }
    });
    doc.save(`${report.report_name}.pdf`);
  };

  const downloadCSV = (report) => {
    const filename = `${report.report_name.replace(/\s+/g, '_')}.csv`;
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['ID,Name,Type,Date', `${report.report_id},${report.report_name},${report.report_type},${report.created_at}`].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = filename;
    link.click();
  };

  const getFormat = (report) => report.format || 'PDF';
  const getReportDate = (report) => {
    if (!report.created_at) return '-';
    return new Date(report.created_at).toLocaleDateString();
  };

  const handleSelectAllReports = (e) => {
    setSelectedReports(e.target.checked ? recentReports.map((report) => report.report_id) : []);
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports((prev) => (
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    ));
  };

  const handleExportReports = () => {
    if (selectedReports.length === 0) {
      Swal.fire('No reports selected', 'Select at least one report first.', 'info');
      return;
    }
    const selected = recentReports.filter((report) => selectedReports.includes(report.report_id));
    selected.forEach((report) => {
      getFormat(report).toLowerCase().includes('excel') ? downloadCSV(report) : generatePDF(report);
    });
  };

  const handleDeleteReports = async () => {
    if (selectedReports.length === 0) {
      Swal.fire('No reports selected', 'Select reports to remove from this list.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete selected reports?',
      text: `This will delete ${selectedReports.length} generated report record(s) from the database.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch('http://localhost:5000/api/reports/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReports })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Could not delete reports.');

      setSelectedReports([]);
      await fetchData();
      Swal.fire('Deleted', data.message, 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const snapshotIcons = [<SvgUsers />, <SvgClass />, <SvgWallet />];
  const snapshotClasses = ['purple', 'green', 'orange'];
  const isAllReportsSelected = recentReports.length > 0 && recentReports.every((report) => selectedReports.includes(report.report_id));

  return (
    <DashboardLayout userRole="admin" currentPath="/reports" userName="System Admin" userInitials="SA">
      <div className="rep-page-header">
        <div className="rep-header-left">
          <h2>Reports</h2>
          <p>Generate and view school data exports</p>
        </div>
        <div className="rep-header-right">
          <button className="rep-btn-primary" onClick={() => setIsModalOpen(true)}>
            <SvgDownload />
            Generate report
          </button>
          <div className="rep-avatar">SA</div>
        </div>
      </div>

      <Header
        onEdit={() => {
          const report = recentReports.find((item) => item.report_id === selectedReports[0]);
          selectedReports.length === 1 && report
            ? Swal.fire(report.report_name, `${getFormat(report)} - ${getReportDate(report)}`, 'info')
            : Swal.fire('Select one report', 'Choose exactly one report checkbox, then click Edit.', 'info');
        }}
        onRefresh={handleRefresh}
        onDelete={handleDeleteReports}
        onExport={handleExportReports}
      />

      <div className="rep-dashboard-grid">
        <section className="rep-panel">
          <div className="rep-panel-title">
            <span className="rep-panel-icon"><SvgSchool /></span>
            <h3>School Snapshot</h3>
          </div>

          <div className="rep-snapshot-list">
            {snapshot.length === 0 && <div className="rep-empty">No snapshot data found.</div>}
            {snapshot.map((item, index) => (
              <div className="rep-snapshot-row" key={`${item.label}-${index}`}>
                <span className={`rep-snapshot-icon ${snapshotClasses[index % snapshotClasses.length]}`}>
                  {snapshotIcons[index % snapshotIcons.length]}
                </span>
                <div className="rep-snapshot-main">
                  <div className="rep-snapshot-text">
                    <span>{item.label}</span>
                    <strong>{item.val}</strong>
                  </div>
                  <div className="rep-progress-track">
                    <div className="rep-progress-fill" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rep-panel">
          <div className="rep-panel-title">
            <span className="rep-panel-icon"><SvgReportList /></span>
            <h3>Recent Reports</h3>
            <input className="rep-select-all" type="checkbox" checked={isAllReportsSelected} onChange={handleSelectAllReports} />
          </div>

          <div className="rep-recent-list-modern">
            {recentReports.length === 0 && <div className="rep-empty">No recent reports yet.</div>}
            {recentReports.map((report) => {
              const format = getFormat(report);
              const isExcel = format.toLowerCase().includes('excel');
              return (
                <div className="rep-recent-row" key={report.report_id}>
                  <input className="rep-row-checkbox" type="checkbox" checked={selectedReports.includes(report.report_id)} onChange={() => handleSelectReport(report.report_id)} />
                  <span className={`rep-file-icon ${isExcel ? 'excel' : 'pdf'}`}>
                    {isExcel ? <SvgFileExcel /> : <SvgFilePdf />}
                  </span>
                  <div className="rep-recent-copy">
                    <strong>{report.report_name}</strong>
                    <span>{format} - {getReportDate(report)}</span>
                  </div>
                  <button
                    className="rep-download-btn"
                    onClick={() => (isExcel ? downloadCSV(report) : generatePDF(report))}
                  >
                    <SvgDownload />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="rep-modal-overlay">
          <div className="rep-modal rep-generate-modal">
            <div className="rep-modal-header">
              <div className="rep-modal-title">
                <h2>Generate Report</h2>
                <p>Create a fresh school data export.</p>
              </div>
            </div>
            <div className="rep-modal-body">
              <div className="rep-form-group">
                <label>Select Type</label>
                <select className="rep-input" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="attendance">Attendance</option>
                  <option value="fees">Fees</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div className="rep-form-group">
                <label>Export Format</label>
                <select className="rep-input" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                  <option value="PDF">PDF Document</option>
                  <option value="Excel">Excel Sheet</option>
                </select>
              </div>
            </div>
            <div className="rep-modal-footer">
              <span className="rep-req-text">Reports are saved to recent exports.</span>
              <div className="rep-footer-actions">
                <button className="rep-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="rep-btn-publish" onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Wait...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
