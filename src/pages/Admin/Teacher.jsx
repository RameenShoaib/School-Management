import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // 👉 SweetAlert2 import kiya gaya hai
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Teacher.css';

/* Icons */
const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const SvgColumns = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9 5v14M15 5v14"/></svg>;
const SvgMore = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>;
const SvgEye = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
const SvgEyeOff = () => <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 3 18 18"/><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"/><path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1"/><path d="M6.1 6.8C3.5 8.7 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1"/></svg>;
const SvgGrip = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 5.5A1.5 1.5 0 1 1 6 5.5a1.5 1.5 0 0 1 3 0Zm0 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9-13A1.5 1.5 0 1 1 15 5.5a1.5 1.5 0 0 1 3 0Zm0 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>;
const IconTeacher = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconUser = () => <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;

// Helpers
const formatDateToPKT = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const options = { timeZone: 'Asia/Karachi' };
  const year = new Intl.DateTimeFormat('en-US', { ...options, year: 'numeric' }).format(d);
  const month = new Intl.DateTimeFormat('en-US', { ...options, month: '2-digit' }).format(d);
  const day = new Intl.DateTimeFormat('en-US', { ...options, day: '2-digit' }).format(d);
  return `${year}-${month}-${day}`;
};
const val = (v) => (v !== null && v !== undefined) ? v : '';
const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase() || 'TC';

const TEACHER_VIEW_STORAGE_KEY = 'edusync.admin.teachers.columnView.v1';
const teacherColumnDefinitions = [
  { key: 'name', label: 'Name', defaultWidth: 260, visible: true },
  { key: 'empId', label: 'Emp ID', defaultWidth: 130, visible: true },
  { key: 'subject', label: 'Subject', defaultWidth: 210, visible: true },
  { key: 'classes', label: 'Classes', defaultWidth: 120, visible: true },
  { key: 'students', label: 'Students', defaultWidth: 130, visible: true },
  { key: 'joined', label: 'Joined', defaultWidth: 140, visible: true },
  { key: 'status', label: 'Status', defaultWidth: 140, visible: true },
  { key: 'email', label: 'Email', defaultWidth: 230, visible: false },
  { key: 'phone', label: 'Phone', defaultWidth: 170, visible: false },
  { key: 'employmentType', label: 'Employment Type', defaultWidth: 180, visible: false }
];

const buildDefaultTeacherColumns = () => teacherColumnDefinitions.map((column, index) => ({
  ...column,
  width: column.defaultWidth,
  order: index
}));

export default function Teacher() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [draftColumns, setDraftColumns] = useState([]);
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const [dragOverColumnKey, setDragOverColumnKey] = useState(null);
  const [tableDragColumnKey, setTableDragColumnKey] = useState(null);
  const [tableDragTargetKey, setTableDragTargetKey] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  
  // Checkbox Selection State
  const [selectedRows, setSelectedRows] = useState([]);

  // Database States
  const [teachersData, setTeachersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7; 
  const [columns, setColumns] = useState(() => {
    const defaults = buildDefaultTeacherColumns();
    try {
      const saved = JSON.parse(localStorage.getItem(TEACHER_VIEW_STORAGE_KEY));
      if (!Array.isArray(saved)) return defaults;
      return defaults.map((column) => {
        const savedColumn = saved.find((item) => item.key === column.key);
        return savedColumn
          ? {
              ...column,
              visible: savedColumn.visible !== false,
              width: Number(savedColumn.width) || column.defaultWidth,
              order: Number.isFinite(savedColumn.order) ? savedColumn.order : column.order
            }
          : column;
      });
    } catch {
      return defaults;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    firstName: '', lastName: '', gender: '', dob: '', 
    cnic: '', phone: '', designation: '', empType: 'Full time', 
    email: '', joiningDate: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/teachers");
      const result = await response.json();

      if (result.success) {
        const formattedData = result.data.map(teacher => {
          const dateObj = new Date(teacher.joining_date);
          const joinedDate = isNaN(dateObj) ? "Unknown" : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

          return {
            id: teacher.teacher_id,
            name: `${teacher.first_name} ${teacher.last_name}`,
            empId: teacher.emp_id,
            subject: teacher.designation || "Not Assigned",
            classes: 0, 
            students: 0, 
            joined: joinedDate,
            status: teacher.status || 'Active',
            statusClass: teacher.status && teacher.status.toLowerCase() === 'on leave' ? 'status-leave' : 'status-active',
            email: teacher.email,
            phone: teacher.phone_number,
            employmentType: teacher.employment_type,
            rawData: teacher 
          };
        });
        setTeachersData(formattedData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Could not connect to database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const compactColumns = columns.map(({ key, visible, width, order }) => ({ key, visible, width, order }));
    localStorage.setItem(TEACHER_VIEW_STORAGE_KEY, JSON.stringify(compactColumns));
  }, [columns]);

  // 👉 NEW: Bulk Delete Logic
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({ icon: 'info', title: 'No Selection', text: 'Bhai, pehle delete karne ke liye teacher select toh karein!', confirmButtonColor: '#2563eb' });
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Selected ${selectedRows.length} teacher(s) will be deleted permanently!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost:5000/api/teachers/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedRows })
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire({ icon: 'success', title: 'Deleted!', showConfirmButton: false, timer: 1500 });
          setSelectedRows([]);
          fetchTeachers();
        } else { Swal.fire('Error', data.message, 'error'); }
      } catch (err) { Swal.fire('Error', 'Server connection failed', 'error'); }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    const t = record.rawData;
    setModalMode('edit');
    setSelectedTeacherId(record.id);
    
    setFormData({
      firstName: val(t.first_name),
      lastName: val(t.last_name),
      gender: val(t.gender),
      dob: formatDateToPKT(t.date_of_birth),
      cnic: val(t.cnic),
      phone: val(t.phone_number), 
      designation: val(t.designation),
      empType: val(t.employment_type), 
      email: val(t.email),
      joiningDate: formatDateToPKT(t.joining_date)
    });
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.designation || !formData.email) {
      alert("Please fill all required (*) fields (Name, Designation, and Email).");
      return;
    }

    setIsSubmitting(true);
    const url = modalMode === 'add' ? "http://localhost:5000/api/teachers" : `http://localhost:5000/api/teachers/${selectedTeacherId}`;
    const method = modalMode === 'add' ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false); 
        fetchTeachers(); 
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderedColumns = [...columns].sort((a, b) => a.order - b.order);
  const visibleColumns = orderedColumns.filter((column) => column.visible);

  const getColumnValue = (teacher, key) => ({
    name: teacher.name,
    empId: teacher.empId,
    subject: teacher.subject,
    classes: teacher.classes,
    students: teacher.students,
    joined: teacher.joined,
    status: teacher.status,
    email: teacher.email,
    phone: teacher.phone,
    employmentType: teacher.employmentType
  }[key] ?? '');

  const renderColumnValue = (teacher, column) => {
    if (column.key === 'name') {
      return (
        <button className="tc-record-link" type="button" onClick={() => openEditModal(teacher)}>
          {teacher.name}
        </button>
      );
    }
    if (column.key === 'status') return <span className={`tc-pill ${teacher.statusClass}`}>{teacher.status}</span>;
    return getColumnValue(teacher, column.key) || '-';
  };

  const handleColumnToggle = (key) => {
    setColumns((prev) => prev.map((column) => column.key === key ? { ...column, visible: !column.visible } : column));
  };

  const handleColumnWidthChange = (key, width) => {
    const numericWidth = Math.max(100, Math.min(Number(width) || 100, 440));
    setColumns((prev) => prev.map((column) => column.key === key ? { ...column, width: numericWidth } : column));
  };

  const moveColumnTo = (sourceKey, targetKey) => {
    setColumns((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const sourceIndex = sorted.findIndex((column) => column.key === sourceKey);
      const targetIndex = sorted.findIndex((column) => column.key === targetKey);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return prev;
      const reordered = [...sorted];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered.map((column, order) => ({ ...column, order }));
    });
  };

  const handleColumnDragStart = (e, key) => {
    e.dataTransfer.setData('text/plain', key);
    e.dataTransfer.effectAllowed = 'move';
    setTableDragColumnKey(key);
  };

  const handleColumnDrop = (e, targetKey) => {
    e.preventDefault();
    moveColumnTo(e.dataTransfer.getData('text/plain'), targetKey);
    setTableDragColumnKey(null);
    setTableDragTargetKey(null);
  };

  const handleColumnDragEnd = () => {
    setTableDragColumnKey(null);
    setTableDragTargetKey(null);
  };

  const startColumnResize = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columns.find((column) => column.key === key)?.width || 140;
    const handleMouseMove = (moveEvent) => handleColumnWidthChange(key, startWidth + moveEvent.clientX - startX);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('tc-resizing-columns');
    };
    document.body.classList.add('tc-resizing-columns');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const resetColumns = () => setColumns(buildDefaultTeacherColumns());

  const openColumnModal = () => {
    setDraftColumns([...columns].sort((a, b) => a.order - b.order));
    setColumnSearchTerm('');
    setIsColumnModalOpen(true);
  };

  const closeColumnModal = () => {
    setIsColumnModalOpen(false);
    setColumnSearchTerm('');
    setDraftColumns([]);
    setDraggedColumnKey(null);
    setDragOverColumnKey(null);
  };

  const applyColumnChanges = () => {
    setColumns(draftColumns.map((column, order) => ({ ...column, order })));
    closeColumnModal();
  };

  const sortDraftVisibleFirst = () => {
    setDraftColumns((prev) => [...prev]
      .sort((a, b) => Number(b.visible) - Number(a.visible) || a.order - b.order)
      .map((column, order) => ({ ...column, order })));
  };

  const handleDraftColumnToggle = (key) => {
    setDraftColumns((prev) => prev.map((column) => column.key === key ? { ...column, visible: !column.visible } : column));
  };

  const moveDraftColumnTo = (sourceKey, targetKey) => {
    setDraftColumns((prev) => {
      const sourceIndex = prev.findIndex((column) => column.key === sourceKey);
      const targetIndex = prev.findIndex((column) => column.key === targetKey);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return prev;
      const reordered = [...prev];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered.map((column, order) => ({ ...column, order }));
    });
  };

  const handleDraftColumnDragStart = (e, key) => {
    e.dataTransfer.setData('text/plain', key);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedColumnKey(key);
  };

  const handleDraftColumnDrop = (e, targetKey) => {
    e.preventDefault();
    moveDraftColumnTo(e.dataTransfer.getData('text/plain'), targetKey);
    setDraggedColumnKey(null);
    setDragOverColumnKey(null);
  };

  const handleDraftColumnDragEnd = () => {
    setDraggedColumnKey(null);
    setDragOverColumnKey(null);
  };

  const modalColumns = (draftColumns.length ? draftColumns : orderedColumns)
    .filter((column) => column.label.toLowerCase().includes(columnSearchTerm.toLowerCase().trim()));
  const draftVisibleCount = (draftColumns.length ? draftColumns : orderedColumns).filter((column) => column.visible).length;

  const filteredTeachers = teachersData.filter(teacher => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch = !search || visibleColumns.some((column) => String(getColumnValue(teacher, column.key)).toLowerCase().includes(search));
    
    let matchesFilter = true;
    if (activeFilter === 'Active') matchesFilter = teacher.status === 'Active';
    else if (activeFilter === 'On leave') matchesFilter = teacher.status === 'On leave';
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]); // Search ya filter change hone par selection reset
  }, [searchTerm, activeFilter]);

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = filteredTeachers.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(filteredTeachers.length / recordsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVisibleIds = currentRecords.map(record => record.id);
      setSelectedRows(allVisibleIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id] 
    );
  };

  const isAllSelected = currentRecords.length > 0 && currentRecords.every(record => selectedRows.includes(record.id));

  // 👉 EXPORT TO EXCEL/CSV LOGIC FOR TEACHERS (WITH SWEET ALERT)
  const handleExport = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select at least one teacher from the checkboxes to export.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Okay'
      });
      return;
    }

    // Filter only selected teachers
    const selectedData = teachersData.filter(record => selectedRows.includes(record.id));

    // Create CSV Headers
    const headers = ["Teacher ID", "Full Name", "Employee ID", "Designation/Subject", "Classes", "Students", "Joined Date", "Status"];
    
    // Create CSV Rows Data
    const csvRows = selectedData.map(record => {
      return [
        record.id,
        `"${record.name}"`, 
        `"${record.empId}"`,
        `"${record.subject}"`,
        `"${record.classes}"`,
        `"${record.students}"`,
        `"${record.joined}"`,
        `"${record.status}"`
      ].join(',');
    });

    // Combine Headers and Rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Teachers_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout userRole="admin" currentPath="/teachers" userName="System Admin" userInitials="SA">
      <div className="tc-page-header">
        <div className="tc-header-left">
          <h2>Teachers</h2>
          <p>Manage all staff members and their details</p>
        </div>
        <div className="tc-header-right">
          <button className="tc-btn-primary" onClick={openAddModal}>+ Add teacher</button>
          {/* ❌ UPRA WALA PURANA EXPORT BUTTON HATA DIYA HAI */}
          <div className="tc-avatar">SA</div>
        </div>
      </div>

 <Header
   onExport={handleExport}
   onRefresh={fetchTeachers}
   onDelete={handleDelete}
   onEdit={() => {
     const selectedRecord = teachersData.find(record => record.id === selectedRows[0]);
     selectedRows.length === 1 && selectedRecord
       ? openEditModal(selectedRecord)
       : Swal.fire('Select one teacher', 'Choose exactly one teacher checkbox, then click Edit.', 'info');
   }}
 />

      <div className="tc-table-card">
        <div className="tc-controls-row">
          <div className="tc-search-box">
            <SvgSearch />
            <input type="text" placeholder="Search by name, subject, employee ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="tc-filter-pills">
            <button className="tc-configure-btn" type="button" onClick={openColumnModal}>
              <SvgColumns />
              Configure columns
            </button>
            {['All', 'Active', 'On leave'].map(filter => (
              <button key={filter} className={`tc-filter-pill ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="tc-table-scroll">
          <table className="tc-table" style={{ minWidth: `${visibleColumns.reduce((total, column) => total + column.width, 220) + 190}px` }}>
            <thead>
              <tr>
                {/* 👉 Header Checkbox */}
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll} 
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`tc-configurable-th ${tableDragColumnKey === column.key ? 'is-table-dragging' : ''} ${tableDragTargetKey === column.key && tableDragColumnKey !== column.key ? 'is-table-drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleColumnDragStart(e, column.key)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setTableDragTargetKey(column.key);
                    }}
                    onDragLeave={() => setTableDragTargetKey((current) => current === column.key ? null : current)}
                    onDrop={(e) => handleColumnDrop(e, column.key)}
                    onDragEnd={handleColumnDragEnd}
                    style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
                  >
                    <span className="tc-column-label">{column.label}</span>
                    <span className="tc-column-drag-hint">Drag</span>
                    <span className="tc-resize-handle" onMouseDown={(e) => startColumnResize(e, column.key)} />
                  </th>
                ))}
                <th style={{ width: '150px', minWidth: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={visibleColumns.length + 2} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading teachers from database...</td></tr>
              ) : error ? (
                <tr><td colSpan={visibleColumns.length + 2} style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</td></tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((teacher) => (
                  <tr key={teacher.id} className={selectedRows.includes(teacher.id) ? 'selected-row' : ''}>
                    {/* 👉 Row Checkbox */}
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(teacher.id)}
                        onChange={() => handleSelectRow(teacher.id)} 
                      />
                    </td>
                    {visibleColumns.map((column) => (
                      <td key={column.key} style={{ width: `${column.width}px`, minWidth: `${column.width}px`, maxWidth: `${column.width}px` }}>
                        <div className="tc-cell-content">{renderColumnValue(teacher, column)}</div>
                      </td>
                    ))}
                    <td>
                      <div className="tc-actions-cell">
                        <button className="tc-view-btn" onClick={() => openEditModal(teacher)}>View / Edit</button>
                        <button className="tc-more-btn" type="button" aria-label={`More actions for ${teacher.name}`} onClick={() => Swal.fire(teacher.name, `Employee ID: ${teacher.empId}\nDesignation: ${teacher.subject}\nStatus: ${teacher.status}`, 'info')}><SvgMore /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={visibleColumns.length + 2} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No teachers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="tc-pagination-footer">
          <span className="tc-page-info">
            Showing {filteredTeachers.length > 0 ? firstRecordIndex + 1 : 0} to {Math.min(lastRecordIndex, filteredTeachers.length)} of {filteredTeachers.length} teachers
          </span>
          <div className="tc-page-buttons">
            <button className="tc-page-btn" onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setSelectedRows([]); }} disabled={currentPage === 1} style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>&lt;</button>
            {[...Array(totalPages)].map((_, index) => (
              <button key={index + 1} className={`tc-page-btn ${currentPage === index + 1 ? 'active' : ''}`} onClick={() => { setCurrentPage(index + 1); setSelectedRows([]); }}>{index + 1}</button>
            ))}
            <button className="tc-page-btn" onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setSelectedRows([]); }} disabled={currentPage === totalPages || totalPages === 0} style={{ cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}>&gt;</button>
          </div>
        </div>
      </div>

      {isColumnModalOpen && (
        <div className="tc-column-overlay">
          <div className="tc-column-modal">
            <div className="tc-column-header">
              <div>
                <h2>Configure View</h2>
                <p>Choose which columns appear in the teachers list.</p>
              </div>
              <button className="tc-column-close" type="button" onClick={closeColumnModal} aria-label="Close configure view">x</button>
            </div>
            <div className="tc-column-search">
              <SvgSearch />
              <input type="text" placeholder="Search columns..." value={columnSearchTerm} onChange={(e) => setColumnSearchTerm(e.target.value)} />
            </div>
            <div className="tc-column-list-header">
              <span>Columns</span>
              <button type="button" onClick={sortDraftVisibleFirst}>Visible first ({draftVisibleCount})</button>
            </div>
            <div className="tc-column-list">
              {modalColumns.map((column) => (
                <div
                  className={`tc-column-row ${draggedColumnKey === column.key ? 'is-dragging' : ''} ${dragOverColumnKey === column.key && draggedColumnKey !== column.key ? 'is-drag-over' : ''}`}
                  key={column.key}
                  draggable
                  onDragStart={(e) => handleDraftColumnDragStart(e, column.key)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverColumnKey(column.key); }}
                  onDragLeave={() => setDragOverColumnKey((current) => current === column.key ? null : current)}
                  onDrop={(e) => handleDraftColumnDrop(e, column.key)}
                  onDragEnd={handleDraftColumnDragEnd}
                >
                  <button className={`tc-column-visibility ${column.visible ? 'visible' : 'hidden'}`} type="button" onClick={() => handleDraftColumnToggle(column.key)} aria-label={`${column.visible ? 'Hide' : 'Show'} ${column.label}`}>
                    {column.visible ? <SvgEye /> : <SvgEyeOff />}
                  </button>
                  <span className="tc-column-row-label">{column.label}</span>
                  <button className="tc-column-grip" type="button" draggable onDragStart={(e) => handleDraftColumnDragStart(e, column.key)} onDragEnd={handleDraftColumnDragEnd} aria-label={`Drag ${column.label}`}>
                    <SvgGrip />
                  </button>
                </div>
              ))}
            </div>
            <div className="tc-column-footer">
              <button className="tc-column-cancel" type="button" onClick={closeColumnModal}>Cancel</button>
              <button className="tc-column-apply" type="button" onClick={applyColumnChanges}>Apply Changes</button>
            </div>
          </div>
        </div>
      )}

      {false && isColumnModalOpen && (
        <div className="tc-column-overlay">
          <div className="tc-column-modal">
            <div className="tc-column-header">
              <div>
                <h2>Configure Teacher View</h2>
                <p>Choose which columns appear in the teachers list.</p>
              </div>
              <button className="tc-column-close" type="button" onClick={() => setIsColumnModalOpen(false)}>×</button>
            </div>
            <div className="tc-column-toolbar">
              <span>{visibleColumns.length} visible columns</span>
              <button type="button" onClick={resetColumns}>Reset default view</button>
            </div>
            <div className="tc-column-list">
              {orderedColumns.map((column) => (
                <div className="tc-column-row" key={column.key}>
                  <div className="tc-column-main">
                    <label className="tc-column-check">
                      <input type="checkbox" checked={column.visible} onChange={() => handleColumnToggle(column.key)} />
                      <span>{column.label}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="tc-column-footer">
              <p>Search scans only the columns visible in this view.</p>
              <button className="tc-btn-primary" type="button" onClick={() => setIsColumnModalOpen(false)}>Apply view</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="tc-modal-overlay">
          <div className="tc-modal-wide">
            
            <div className="tc-modal-header" style={{ borderBottom: 'none' }}>
              <div className="tc-modal-title-group">
                <div className="tc-modal-icon"><IconTeacher /></div>
                <div className="tc-modal-title">
                  <h2>{modalMode === 'add' ? 'Add New Teacher' : 'Update Teacher Profile'}</h2>
                  <p>{modalMode === 'add' ? 'Register a new staff member into EduSync' : `Editing records for ${formData.firstName}`}</p>
                </div>
              </div>
              <div className="tc-badge-pill">{modalMode === 'add' ? 'New staff' : 'Update record'}</div>
            </div>

            <div className="tc-modal-body-scroll">
              <div className="tc-form-card">
                <div className="tc-section-title-new">Personal Information</div>
                <div className="tc-photo-row">
                  <div className="tc-avatar-circle"><IconUser /></div>
                  <div>
                    <button className="tc-upload-btn-new" type="button" onClick={() => Swal.fire('Upload photo', 'Photo upload storage is not connected yet.', 'info')}>Upload photo</button>
                    <p style={{fontSize:'10px', color:'#94a3b8', margin:'4px 0 0 0'}}>JPG or PNG, max 2 MB</p>
                  </div>
                </div>
                <div className="tc-row-3">
                  <div><label className="tc-label-new">First name <span>*</span></label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="tc-input-new" placeholder="e.g. Fatima" /></div>
                  <div><label className="tc-label-new">Last name <span>*</span></label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="tc-input-new" placeholder="e.g. Noor" /></div>
                  <div><label className="tc-label-new">Gender <span>*</span></label><select name="gender" value={formData.gender} onChange={handleInputChange} className="tc-input-new"><option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option></select></div>
                </div>
                <div className="tc-row-3">
                  <div><label className="tc-label-new">Date of birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="tc-input-new" /></div>
                  <div><label className="tc-label-new">CNIC number</label><input type="text" name="cnic" value={formData.cnic} onChange={handleInputChange} className="tc-input-new" placeholder="XXXXX-XXXXXXX-X" /></div>
                  <div><label className="tc-label-new">Phone number <span>*</span></label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="tc-input-new" placeholder="📞 +92 xxx xxxxxxx" /></div>
                </div>
              </div>

              <div className="tc-form-card">
                <div className="tc-section-title-new">Professional Details</div>
                <div className="tc-row-3">
                  <div><label className="tc-label-new">Employee ID</label><input type="text" className="tc-input-new" placeholder="Auto-generated" disabled /></div>
                  <div><label className="tc-label-new">Designation <span>*</span></label><select name="designation" value={formData.designation} onChange={handleInputChange} className="tc-input-new"><option value="">Select</option><option value="Senior Teacher">Senior Teacher</option><option value="Junior Teacher">Junior Teacher</option><option value="Guest Lecturer">Guest Lecturer</option></select></div>
                  <div><label className="tc-label-new">Employment type</label><select name="empType" value={formData.empType} onChange={handleInputChange} className="tc-input-new"><option value="Full time">Full time</option><option value="Part time">Part time</option></select></div>
                </div>
                <div className="tc-row-2">
                  <div><label className="tc-label-new">Work email <span>*</span></label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="tc-input-new" placeholder="✉️ teacher@school.edu" /></div>
                  <div><label className="tc-label-new">Joining date <span>*</span></label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className="tc-input-new" /></div>
                </div>
              </div>
            </div>

            <div className="tc-modal-footer" style={{ borderTop: '1px solid #f1f5f9', background: 'white', padding: '20px 30px' }}>
              <div className="tc-req-text" style={{ fontSize: '11px', color: '#94a3b8' }}>* Required fields</div>
              <div className="tc-footer-actions">
                <button className="tc-btn-discard" style={{ background:'white', border:'1px solid #cbd5e1', padding:'10px 20px', borderRadius:'8px', fontWeight:600, color:'#475569', cursor:'pointer' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="tc-btn-publish" style={{ background:'#2563eb', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:600, color:'white', cursor:'pointer', marginLeft:'10px' }} onClick={handleFinalSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : modalMode === 'add' ? "Add teacher ✓" : "Update Records ✓"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
