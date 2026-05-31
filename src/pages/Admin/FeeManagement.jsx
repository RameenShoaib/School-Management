import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';
import Header from '../../components/Header/header';
import AdminListView from '../../components/AdminListView';
import './FeeManagement.css';

const IconSearch = ({ className }) => <svg className={className} width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.505 4.505 0 0 1 9.5 14Z"/></svg>;
const SvgFeeDoc = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4"/><path d="M10 12h5M10 16h4"/></svg>;
const SvgDate = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>;
const SvgMore = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"/></svg>;
const FeeLineIcon = ({ type }) => {
  const paths = {
    close: <path d="M18 6 6 18M6 6l12 12" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    wallet: <path d="M20 7H5a2 2 0 0 0 0 4h15v8H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h15v4ZM16 14h.01" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>
  };

  return (
    <svg className="fm-line-icon" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
};

export default function FeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [feeRecords, setFeeRecords] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const recordsPerPage = 7;

  // 痩 NEW: Checkbox Selection State
  const [selectedRows, setSelectedRows] = useState([]);

  // Search/Lookup State
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form Initial State
  const initialFormState = {
    paymentType: 'Monthly fee',
    feeMonth: 'May 2026',
    paymentDate: new Date().toISOString().split('T')[0],
    amountDue: 4500,
    discountAmount: 0,
    amountReceived: 4500,
    paymentMethod: 'Cash',
    transactionId: '',
    remarks: '',
    printReceipt: true,
    emailGuardian: true,
    smsConfirm: false
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const feeRes = await fetch('http://localhost:5000/api/fees').then(r => r.json());
      const stuRes = await fetch('http://localhost:5000/api/students').then(r => r.json());
      if (feeRes.success) setFeeRecords(feeRes.data);
      if (stuRes.success) setAllStudents(stuRes.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = async () => {
    setSelectedRows([]);
    setCurrentPage(1);
    await fetchData();
    Swal.fire({
      icon: 'success',
      title: 'Fee records refreshed',
      showConfirmButton: false,
      timer: 900
    });
  };

  // 👉 NEW: Bulk Delete Logic for Fee Records
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Selection',
        text: 'Bhai, pehle delete karne ke liye record select toh karein!',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Selected ${selectedRows.length} fee record(s) will be deleted permanently!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete selected'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost:5000/api/fees/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedRows })
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Records removed successfully.', timer: 1500, showConfirmButton: false });
          setSelectedRows([]);
          fetchData();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Server connection failed', 'error');
      }
    }
  };

  // 👉 NEW: Export Logic Added
  const handleExport = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select fee records from the table to export.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const selectedData = feeRecords.filter(record => selectedRows.includes(record.payment_id));
    const headers = ["Payment ID", "Student Name", "Roll No", "Grade", "Amount Received", "Date", "Method", "Status"];

    const csvRows = selectedData.map(r => [
      r.payment_id,
      `"${r.first_name} ${r.last_name}"`,
      `"${r.roll_no}"`,
      `"${r.grade}"`,
      `"PKR ${r.amount_received}"`,
      `"${new Date(r.payment_date).toLocaleDateString()}"`,
      `"${r.payment_method}"`,
      "Paid"
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Fee_Records_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStudentSearch = (val) => {
    setStudentSearch(val);
    const found = allStudents.find(s =>
      s.roll_no.toLowerCase() === val.toLowerCase() ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(val.toLowerCase())
    );
    setSelectedStudent(found || null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedPaymentId(null);
    setFormData(initialFormState);
    setStudentSearch('');
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const formatDateToInput = (value) => {
    if (!value) return new Date().toISOString().split('T')[0];
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
  };

  const openEditModal = (record) => {
    const fullName = `${record.first_name || ''} ${record.last_name || ''}`.trim();
    const student = allStudents.find((item) => item.student_id === record.student_id) || {
      student_id: record.student_id,
      first_name: record.first_name || '',
      last_name: record.last_name || '',
      roll_no: record.roll_no || '',
      grade: record.grade || ''
    };
    setModalMode('edit');
    setSelectedPaymentId(record.payment_id);
    setSelectedStudent(student);
    setStudentSearch(fullName || record.roll_no || '');
    setFormData({
      paymentType: record.payment_type || 'Monthly fee',
      feeMonth: record.fee_month || 'May 2026',
      paymentDate: formatDateToInput(record.payment_date),
      amountDue: record.amount_due || record.amount_received || 4500,
      discountAmount: record.discount_amount || 0,
      amountReceived: record.amount_received || 4500,
      paymentMethod: record.payment_method || 'Cash',
      transactionId: record.transaction_id || '',
      remarks: record.remarks || '',
      printReceipt: record.print_receipt !== false,
      emailGuardian: record.email_guardian !== false,
      smsConfirm: record.sms_confirm === true
    });
    setIsModalOpen(true);
  };

  const focusFeeForm = () => {
    setTimeout(() => {
      const modalBody = document.querySelector('.fm-modal-body');
      const searchField = document.querySelector('.fm-modal [name="studentSearch"]');
      modalBody?.scrollTo({ top: 0, behavior: 'smooth' });
      searchField?.focus?.({ preventScroll: true });
    }, 120);
  };

  const showFeeFormNotice = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Student required',
      text: 'Please find and select a student before saving this payment.',
      confirmButtonText: 'Review form',
      buttonsStyling: false,
      customClass: {
        container: 'fm-swal-container',
        popup: 'fm-swal-popup',
        title: 'fm-swal-title',
        htmlContainer: 'fm-swal-text',
        confirmButton: 'fm-swal-confirm'
      }
    }).then(focusFeeForm);
  };

  const handleRecordPayment = async (e) => {
    if (e) e.preventDefault();
    if (!selectedStudent) {
      showFeeFormNotice();
      return;
    }
    setLoading(true);
    const payload = { ...formData, studentId: selectedStudent.student_id };
    try {
      const url = modalMode === 'edit'
        ? `http://localhost:5000/api/fees/${selectedPaymentId}`
        : 'http://localhost:5000/api/fees';
      const response = await fetch(url, {
        method: modalMode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: modalMode === 'edit' ? 'Payment Updated!' : 'Payment Recorded!',
          text: `Fee for ${selectedStudent.first_name} has been updated.`,
          confirmButtonColor: '#16a34a'
        });
        setIsModalOpen(false);
        fetchData();
        setStudentSearch('');
        setSelectedStudent(null);
        setSelectedPaymentId(null);
        setModalMode('add');
        setSelectedRows([]);
        setFormData(initialFormState);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      Swal.fire('Error', 'Could not save payment: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = feeRecords.filter(record => {
    const fullName = `${record.first_name} ${record.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) ||
      (record.roll_no || '').toLowerCase().includes(search) ||
      (record.grade || '').toLowerCase().includes(search);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const formatAmount = (value) => {
    const numeric = Number(value || 0);
    return `PKR ${numeric.toLocaleString('en-US')}`;
  };

  const getFeeName = (record) => record.payment_type || record.fee_type || 'Tuition Fee';
  const getFeeSub = (record) => record.fee_month || record.academic_year || '2025-2026';

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = currentRecords.map(r => r.payment_id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const isAllSelected = currentRecords.length > 0 && currentRecords.every(r => selectedRows.includes(r.payment_id));

  const feeColumns = [
    { key: 'fee', label: 'Fee Name', width: 260 },
    { key: 'grade', label: 'Grade', width: 120 },
    { key: 'amount', label: 'Amount (PKR)', width: 150 },
    { key: 'date', label: 'Due Date', width: 210 },
    { key: 'method', label: 'Method', width: 140 },
    { key: 'status', label: 'Status', width: 120 }
  ];

  const renderFeeCell = (record, column) => {
    if (column.key === 'fee') {
      return (
        <div className="fm-fee-cell">
          <span className={`fm-fee-icon color-${record.payment_id % 4}`}><SvgFeeDoc /></span>
          <div>
            <span className="fm-fee-name">{getFeeName(record)}</span>
            <span className="fm-fee-sub">{getFeeSub(record)}</span>
          </div>
        </div>
      );
    }
    if (column.key === 'grade') return <span className={`fm-grade-pill color-${record.payment_id % 4}`}>{record.grade || '-'}</span>;
    if (column.key === 'amount') return formatAmount(record.amount_received);
    if (column.key === 'date') {
      return (
        <span className="fm-date-cell">
          <SvgDate />
          {record.payment_date ? new Date(record.payment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}
        </span>
      );
    }
    if (column.key === 'method') return record.payment_method || '-';
    if (column.key === 'status') return <span className="fm-pill paid">Active</span>;
    return '-';
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/fees" userName="System Admin" userInitials="SA">
      <div className="fm-page-header">
        <div className="fm-header-left">
          <h2>Fee Management</h2>
          <p>Track and manage all fee structures</p>
        </div>
        <div className="fm-header-right">
          <button className="fm-btn-primary" onClick={openAddModal}>+ Record payment</button>
          <div className="fm-avatar">SA</div>
        </div>
      </div>

      {/* 👉 onDelete linked here */}
      <Header
        onExport={handleExport}
        onRefresh={handleRefresh}
        onDelete={handleDelete}
        onEdit={() => {
          const record = feeRecords.find((item) => item.payment_id === selectedRows[0]);
          selectedRows.length === 1 && record
            ? openEditModal(record)
            : Swal.fire('Select one fee record', 'Choose exactly one fee checkbox, then click Edit.', 'info');
        }}
      />

      <AdminListView
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
          setSelectedRows([]);
        }}
        searchPlaceholder="Search fee structures..."
        searchIcon={<SvgSearch />}
        showConfigure={false}
        columns={feeColumns}
        rows={currentRecords}
        getRowId={(record) => record.payment_id}
        renderCell={renderFeeCell}
        selectedRows={selectedRows}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        renderActions={(record) => (
          <button className="fm-more-btn" type="button" aria-label="More fee actions" onClick={() => Swal.fire(getFeeName(record), `Student: ${record.first_name || ''} ${record.last_name || ''}\nAmount: ${formatAmount(record.amount_received)}\nMethod: ${record.payment_method || '-'}`, 'info')}>
            <SvgMore />
          </button>
        )}
        actionsHeader=""
        actionsWidth={70}
        emptyMessage="No fee records found."
        paginationLabel={`Showing ${currentRecords.length > 0 ? indexOfFirstRecord + 1 : 0} to ${Math.min(indexOfLastRecord, filteredRecords.length)} of ${filteredRecords.length} records`}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          setSelectedRows([]);
        }}
      />

      {false && <div className="fm-table-card">
        <div className="fm-search-area">
          <div className="fm-search-box">
            <SvgSearch />
            <input
              type="text"
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setSelectedRows([]);
              }}
            />
          </div>
        </div>

        <div className="fm-table-scroll">
          <table className="fm-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Fee Name <span className="fm-sort">↕</span></th>
                <th>Grade <span className="fm-sort">↕</span></th>
                <th>Amount (PKR) <span className="fm-sort">↕</span></th>
                <th>Due Date <span className="fm-sort">↕</span></th>
                <th>Method <span className="fm-sort">↕</span></th>
                <th>Status <span className="fm-sort">↕</span></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((r) => (
                  <tr key={r.payment_id} className={selectedRows.includes(r.payment_id) ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(r.payment_id)}
                        onChange={() => handleSelectRow(r.payment_id)}
                      />
                    </td>
                    <td>
                      <div className="fm-fee-cell">
                        <span className={`fm-fee-icon color-${r.payment_id % 4}`}><SvgFeeDoc /></span>
                        <div>
                          <span className="fm-fee-name">{getFeeName(r)}</span>
                          <span className="fm-fee-sub">{getFeeSub(r)}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={`fm-grade-pill color-${r.payment_id % 4}`}>{r.grade || '-'}</span></td>
                    <td>{formatAmount(r.amount_received)}</td>
                    <td><span className="fm-date-cell"><SvgDate />{new Date(r.payment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></td>
                    <td>{r.payment_method}</td>
                    <td><span className="fm-pill paid">Active</span></td>
                    <td><button className="fm-more-btn" type="button" aria-label="More fee actions" onClick={() => Swal.fire(getFeeName(r), `Student: ${r.first_name || ''} ${r.last_name || ''}\nAmount: ${formatAmount(r.amount_received)}\nMethod: ${r.payment_method || '-'}`, 'info')}><SvgMore /></button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>No fee records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fm-pagination-footer">
          <span className="fm-page-info">
            Showing {currentRecords.length > 0 ? indexOfFirstRecord + 1 : 0} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
          </span>
          <div className="fm-page-buttons">
            <button className="fm-page-btn" onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setSelectedRows([]); }} disabled={currentPage === 1}>&lt;</button>
            {[...Array(totalPages)].map((_, index) => (
              <button key={index + 1} className={`fm-page-btn ${currentPage === index + 1 ? 'active' : ''}`} onClick={() => { setCurrentPage(index + 1); setSelectedRows([]); }}>{index + 1}</button>
            ))}
            <button className="fm-page-btn" onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setSelectedRows([]); }} disabled={currentPage === totalPages || totalPages === 0}>&gt;</button>
          </div>
        </div>
      </div>}

      {isModalOpen && (
        <div className="fm-modal-overlay">
          <div className="fm-modal">
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon"><FeeLineIcon type="wallet" /></div>
                <div className="fm-modal-title">
                  <h2>{modalMode === 'edit' ? 'Update Fee Payment' : 'Record Fee Payment'}</h2>
                  <p>Record and save fee payment details for the student</p>
                </div>
              </div>
              <button className="fm-modal-close" type="button" onClick={() => setIsModalOpen(false)} aria-label="Close fee payment form">
                <FeeLineIcon type="close" />
              </button>
            </div>
            <div className="fm-modal-body">
              <div className="fm-modal-card fm-search-card">
                <div className="fm-section-heading">
                  <span className="fm-step-badge">1</span>
                  <div>
                    <div className="fm-section-title">SEARCH STUDENT</div>
                    <p className="fm-section-subtitle">Find and select the student to record the payment</p>
                  </div>
                </div>
                <div className="fm-search-input-shell">
                  <FeeLineIcon type="search" />
                  <input
                    type="text"
                    name="studentSearch"
                    className="fm-input"
                    placeholder="Search by Name or Roll No..."
                    value={studentSearch}
                    onChange={(e) => handleStudentSearch(e.target.value)}
                  />
                </div>
                {selectedStudent && (
                  <div className="fm-student-card">
                    <div className="fm-stu-info">
                      <span className="fm-stu-avatar">{`${selectedStudent.first_name?.[0] || ''}${selectedStudent.last_name?.[0] || ''}`.toUpperCase()}</span>
                      <div className="fm-stu-details">
                        <h4>{selectedStudent.first_name} {selectedStudent.last_name}</h4>
                        <p>Grade {selectedStudent.grade} | Roll: {selectedStudent.roll_no}</p>
                      </div>
                    </div>
                    <div className="fm-stu-fee-info">
                      <h4>{formatAmount(formData.amountReceived)}</h4>
                      <p>Selected student</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="fm-modal-card fm-payment-card">
                <div className="fm-section-heading">
                  <span className="fm-step-badge">2</span>
                  <div>
                    <div className="fm-section-title">PAYMENT INFO</div>
                    <p className="fm-section-subtitle">Enter payment details below</p>
                  </div>
                </div>
                <div className="fm-form-row-2">
                  <div className="fm-form-group">
                    <label>Fee Month <span>*</span></label>
                    <div className="fm-input-shell">
                      <FeeLineIcon type="calendar" />
                      <select name="feeMonth" value={formData.feeMonth} onChange={handleInputChange} className="fm-input">
                        <option>April 2026</option>
                        <option>May 2026</option>
                      </select>
                    </div>
                  </div>
                  <div className="fm-form-group">
                    <label>Amount Received (PKR) <span>*</span></label>
                    <div className="fm-input-shell">
                      <span className="fm-currency-chip">Rs</span>
                      <input type="number" name="amountReceived" value={formData.amountReceived} onChange={handleInputChange} className="fm-input" />
                    </div>
                  </div>
                </div>
                <div className="fm-form-row-2">
                  <div className="fm-form-group">
                    <label>Payment Method <span>*</span></label>
                    <div className="fm-input-shell">
                      <FeeLineIcon type="card" />
                      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="fm-input">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Online</option>
                      </select>
                    </div>
                  </div>
                  <div className="fm-form-group">
                    <label>Transaction ID</label>
                    <div className="fm-input-shell">
                      <span className="fm-hash-chip">#</span>
                      <input type="text" name="transactionId" value={formData.transactionId} onChange={handleInputChange} className="fm-input" placeholder="Optional" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fm-modal-footer">
              <button className="fm-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="fm-btn-publish" onClick={handleRecordPayment} disabled={loading}>
                <FeeLineIcon type="save" /> {loading ? 'Processing...' : (modalMode === 'edit' ? 'Update Payment' : 'Save Payment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
