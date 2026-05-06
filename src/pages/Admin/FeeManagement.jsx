import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './FeeManagement.css';

const IconSearch = ({ className }) => <svg className={className} width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

export default function FeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [feeRecords, setFeeRecords] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search/Lookup State
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form Initial State
  const [formData, setFormData] = useState({
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
  });

  const fetchData = async () => {
    try {
      const feeRes = await fetch('http://localhost:5000/api/fees').then(r => r.json());
      const stuRes = await fetch('http://localhost:5000/api/students').then(r => r.json());
      if (feeRes.success) setFeeRecords(feeRes.data);
      if (stuRes.success) setAllStudents(stuRes.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

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

  // 📝 MAIN SUBMIT FUNCTION
  const handleRecordPayment = async (e) => {
    if (e) e.preventDefault(); // Form prevent default browser behavior
    
    if (!selectedStudent) {
      Swal.fire('Selection Required', 'Please find and select a student first.', 'warning');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      studentId: selectedStudent.student_id
    };

    try {
      const response = await fetch('http://localhost:5000/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await response.json();

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded!',
          text: `Fee for ${selectedStudent.first_name} has been updated.`,
          confirmButtonColor: '#16a34a'
        });
        setIsModalOpen(false);
        fetchData(); // Refresh list
        // Reset Search
        setStudentSearch('');
        setSelectedStudent(null);
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
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || record.roll_no.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <DashboardLayout userRole="admin" currentPath="/fees" userName="System Admin" userInitials="SA">
      <div className="fm-page-header">
        <div className="fm-header-left">
          <h2>Fee Management</h2>
          <p>Track student payments and dues</p>
        </div>
        <div className="fm-header-right">
          <button className="fm-btn-primary" onClick={() => setIsModalOpen(true)}>Record payment</button>
          <div className="fm-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="fm-table-card">
        <div className="fm-search-area">
          <div className="fm-search-box">
            <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        <div className="fm-table-scroll">
          <table className="fm-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Amount Received</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.payment_id}>
                    <td><b>{r.first_name} {r.last_name}</b><br/><small>{r.roll_no}</small></td>
                    <td>{r.grade}</td>
                    <td>PKR {r.amount_received}</td>
                    <td>{new Date(r.payment_date).toLocaleDateString()}</td>
                    <td>{r.payment_method}</td>
                    <td><span className="fm-pill paid">Paid</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>No fee records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fm-modal-overlay">
          <div className="fm-modal">
            <div className="fm-modal-header">
                <h2>Record Fee Payment</h2>
            </div>

            <div className="fm-modal-body">
              <div className="fm-section-title"><IconSearch /> 1. SEARCH STUDENT</div>
              <input 
                type="text" 
                className="fm-input" 
                placeholder="Search by Name or Roll No..." 
                value={studentSearch} 
                onChange={(e) => handleStudentSearch(e.target.value)} 
              />

              {selectedStudent && (
                <div className="fm-student-card" style={{marginTop: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                    <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>
                    <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Grade {selectedStudent.grade} | Roll: {selectedStudent.roll_no}</p>
                </div>
              )}

              <div className="fm-section-title" style={{marginTop: '20px'}}>2. PAYMENT INFO</div>
              <div className="fm-form-row-2">
                <div className="fm-form-group">
                  <label>Fee Month</label>
                  <select name="feeMonth" value={formData.feeMonth} onChange={handleInputChange} className="fm-input">
                    <option>April 2026</option>
                    <option>May 2026</option>
                  </select>
                </div>
                <div className="fm-form-group">
                  <label>Amount Received (PKR)</label>
                  <input type="number" name="amountReceived" value={formData.amountReceived} onChange={handleInputChange} className="fm-input" />
                </div>
              </div>

              <div className="fm-form-row-2">
                <div className="fm-form-group">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="fm-input">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Online</option>
                  </select>
                </div>
                <div className="fm-form-group">
                  <label>Transaction ID</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleInputChange} className="fm-input" placeholder="Optional" />
                </div>
              </div>
            </div>

            <div className="fm-modal-footer">
              <button className="fm-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button 
                className="fm-btn-publish" 
                onClick={handleRecordPayment} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Save Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}