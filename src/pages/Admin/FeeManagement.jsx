import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './FeeManagement.css';

/* Icons */
const IconFinance = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 

// 👇 FIX: SVG ab className properly accept karega 👇
const IconSearch = ({ className }) => <svg className={className} width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

const IconCreditCard = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;
const IconNote = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;

/* Mock Data */
const feeRecords = [
  { id: 1, student: "Ayesha Khan", rollNo: "1014", grade: "Grade 7", amount: "PKR 4,500", dueDate: "Apr 30", paidOn: "Apr 12", method: "Bank transfer", status: "Paid", statusClass: "paid", action: "Receipt" },
  { id: 2, student: "Bilal Raza", rollNo: "1052", grade: "Grade 5", amount: "PKR 3,800", dueDate: "Apr 30", paidOn: "—", method: "—", status: "Pending", statusClass: "pending", action: "Remind" },
  { id: 3, student: "Sana Mirza", rollNo: "1087", grade: "Grade 9", amount: "PKR 5,200", dueDate: "Apr 30", paidOn: "Apr 8", method: "Cash", status: "Paid", statusClass: "paid", action: "Receipt" },
  { id: 4, student: "Omar Farooq", rollNo: "1011", grade: "Grade 3", amount: "PKR 3,500", dueDate: "Mar 31", paidOn: "—", method: "—", status: "Overdue", statusClass: "overdue", action: "Escalate" },
  { id: 5, student: "Zara Hussain", rollNo: "1101", grade: "Grade 10", amount: "PKR 5,800", dueDate: "Apr 30", paidOn: "Apr 15", method: "Online", status: "Paid", statusClass: "paid", action: "Receipt" },
  { id: 6, student: "Hassan Malik", rollNo: "1078", grade: "Grade 8", amount: "PKR 4,200", dueDate: "Apr 30", paidOn: "Apr 9", method: "Cash", status: "Paid", statusClass: "paid", action: "Receipt" }
];

export default function FeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [emailGuardian, setEmailGuardian] = useState(true);
  const [smsConfirm, setSmsConfirm] = useState(false);

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = 
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.includes(searchTerm);
    const matchesFilter = activeFilter === 'All' || record.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/fees" 
      userName="System Admin" 
      userInitials="SA"
    >
      <div className="fm-page-header">
        <div className="fm-header-left">
          <h2>Fee Management</h2>
          <p>Track student payments, dues, and issue receipts</p>
        </div>
        <div className="fm-header-right">
          <button className="fm-btn-primary" onClick={() => setIsModalOpen(true)}>
            Record payment
          </button>
          <div className="fm-avatar">SA</div>
        </div>
      </div>

      <Header />

      <div className="fm-table-card">
        
        <div className="fm-card-header">
          <h3>Fee records</h3>
          <div className="fm-filter-pills">
            {['All', 'Paid', 'Pending', 'Overdue'].map(filter => (
              <button 
                key={filter} 
                className={`fm-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="fm-search-area">
          <div className="fm-search-box">
            <input 
              type="text" 
              placeholder="Search by student name or roll no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="fm-table-scroll">
          <table className="fm-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Fee amount</th>
                <th>Due date</th>
                <th>Paid on</th>
                <th>Method</th>
                <th>Status</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 600 }}>{record.student}</td>
                    <td>{record.grade}</td>
                    <td>{record.amount}</td>
                    <td>{record.dueDate}</td>
                    <td>{record.paidOn}</td>
                    <td>{record.method}</td>
                    <td><span className={`fm-pill ${record.statusClass}`}>{record.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className={`fm-action-btn ${record.action === 'Escalate' ? 'escalate' : ''}`}>
                        {record.action}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fm-pagination-footer">
          <span className="fm-page-info">Showing 1–{filteredRecords.length} of 1,248</span>
          <div className="fm-page-buttons">
            <button className="fm-page-btn active">1</button>
            <button className="fm-page-btn">2</button>
            <button className="fm-page-btn">3</button>
            <button className="fm-page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* =========================================
          ✨ RECORD FEE PAYMENT MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="fm-modal-overlay">
          <div className="fm-modal">
            
            {/* Modal Header */}
            <div className="fm-modal-header">
              <div className="fm-modal-title-group">
                <div className="fm-modal-icon">💰</div>
                <div className="fm-modal-title">
                  <h2>Record Fee Payment</h2>
                  <p>Log a student's monthly or one-time fee payment</p>
                </div>
              </div>
              <div className="fm-badge-pill">New payment</div>
            </div>

            {/* Modal Body */}
            <div className="fm-modal-body">
              
              {/* SECTION 1: STUDENT LOOKUP */}
              <div>
                <div className="fm-section-title"><IconSearch /> STUDENT LOOKUP</div>
                
                <div className="fm-form-row-2">
                  <div className="fm-form-group">
                    <label>Search student <span>*</span></label>
                    <div className="fm-input-icon-wrapper">
                      {/* 👇 Yahan IconSearch ko class mil gayi hai 👇 */}
                      <IconSearch className="fm-input-icon" />
                      <input type="text" className="fm-input" defaultValue="Ayesha Khan" />
                    </div>
                  </div>
                  <div className="fm-form-group">
                    <label>Roll number</label>
                    <input type="text" className="fm-input" defaultValue="1014" />
                  </div>
                </div>

                {/* Selected Student Card */}
                <div className="fm-student-card">
                  <div className="fm-stu-info">
                    <div className="fm-stu-avatar">AK</div>
                    <div className="fm-stu-details">
                      <h4>Ayesha Khan</h4>
                      <p>Grade 7 — Section A · Roll No. 1014 · Guardian: Mr. Imran Khan</p>
                    </div>
                  </div>
                  <div className="fm-stu-fee-info">
                    <h4>PKR 4,500 / month</h4>
                    <p>✓ Last paid: March 2026</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PAYMENT DETAILS */}
              <div>
                <div className="fm-section-title"><IconCreditCard /> PAYMENT DETAILS</div>
                
                <div className="fm-form-row-3">
                  <div className="fm-form-group">
                    <label>Payment type <span>*</span></label>
                    <select className="fm-input">
                      <option>Monthly fee</option>
                      <option>Admission fee</option>
                      <option>Exam fee</option>
                    </select>
                  </div>
                  <div className="fm-form-group">
                    <label>Fee month <span>*</span></label>
                    <select className="fm-input">
                      <option>April 2026</option>
                      <option>May 2026</option>
                    </select>
                  </div>
                  <div className="fm-form-group">
                    <label>Payment date <span>*</span></label>
                    <input type="date" className="fm-input" defaultValue="2026-04-20" />
                  </div>
                </div>

                <div className="fm-form-row-3">
                  <div className="fm-form-group">
                    <label>Amount due (PKR)</label>
                    <input type="text" className="fm-input" value="Rs 4500" disabled />
                  </div>
                  <div className="fm-form-group">
                    <label>Discount / waiver (PKR)</label>
                    <input type="text" className="fm-input" defaultValue="Rs 0" />
                  </div>
                  <div className="fm-form-group">
                    <label>Amount received (PKR) <span>*</span></label>
                    <input type="text" className="fm-input" defaultValue="Rs 4500" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: FEE BREAKDOWN */}
              <div>
                <div className="fm-section-title">FEE BREAKDOWN</div>
                
                <div className="fm-breakdown-box">
                  <div className="fm-breakdown-row">
                    <div className="fm-bd-label">
                      <h4>Monthly fee</h4>
                      <p>April 2026</p>
                    </div>
                    <span className="fm-bd-val">PKR 4,500</span>
                  </div>
                  
                  <div className="fm-breakdown-row">
                    <div className="fm-bd-label">
                      <h4>Late fee surcharge</h4>
                      <p>0-14 days overdue</p>
                    </div>
                    <span className="fm-bd-val">PKR 0</span>
                  </div>

                  <div className="fm-breakdown-row">
                    <div className="fm-bd-label">
                      <h4>Discount applied</h4>
                      <p>No waiver</p>
                    </div>
                    <span className="fm-bd-val" style={{ color: '#16a34a' }}>– PKR 0</span>
                  </div>

                  <div className="fm-breakdown-total">
                    <span className="fm-bd-total-label">Total payable</span>
                    <span className="fm-bd-total-val">PKR 4,500</span>
                  </div>
                </div>

                <div className="fm-form-row-2">
                  <div className="fm-form-group">
                    <label>Payment method <span>*</span></label>
                    <div className="fm-radio-group">
                      <label className="fm-radio-label">
                        <input type="radio" name="method" defaultChecked />
                        <span className="fm-radio-circle"></span> Cash
                      </label>
                      <label className="fm-radio-label">
                        <input type="radio" name="method" />
                        <span className="fm-radio-circle"></span> Bank transfer
                      </label>
                      <label className="fm-radio-label">
                        <input type="radio" name="method" />
                        <span className="fm-radio-circle"></span> Online
                      </label>
                      <label className="fm-radio-label">
                        <input type="radio" name="method" />
                        <span className="fm-radio-circle"></span> Cheque
                      </label>
                    </div>
                  </div>
                  <div className="fm-form-group">
                    <label>Reference / transaction ID</label>
                    <input type="text" className="fm-input" placeholder="Optional — for bank/online payments" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: NOTES & RECEIPT */}
              <div>
                <div className="fm-section-title"><IconNote /> NOTES & RECEIPT</div>
                
                <div className="fm-form-row-2" style={{ alignItems: 'flex-start' }}>
                  <div className="fm-form-group">
                    <label>Remarks</label>
                    <textarea className="fm-input fm-textarea" placeholder="Any notes about this payment..."></textarea>
                  </div>
                  
                  <div className="fm-form-group">
                    <label>Receipt options</label>
                    <div className="fm-receipt-toggles">
                      <div className="fm-switch-row">
                        <div className="fm-switch-label"><h4>Print receipt</h4></div>
                        <div className={`fm-toggle ${printReceipt ? 'on' : ''}`} onClick={() => setPrintReceipt(!printReceipt)}></div>
                      </div>
                      <div className="fm-switch-row">
                        <div className="fm-switch-label"><h4>Email to guardian</h4></div>
                        <div className={`fm-toggle ${emailGuardian ? 'on' : ''}`} onClick={() => setEmailGuardian(!emailGuardian)}></div>
                      </div>
                      <div className="fm-switch-row">
                        <div className="fm-switch-label"><h4>SMS confirmation</h4></div>
                        <div className={`fm-toggle ${smsConfirm ? 'on' : ''}`} onClick={() => setSmsConfirm(!smsConfirm)}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="fm-modal-footer">
              <div className="fm-req-text">* Payment records are permanent and cannot be deleted</div>
              <div className="fm-footer-actions">
                <button className="fm-btn-discard" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="fm-btn-publish" onClick={() => setIsModalOpen(false)}>Record payment</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}