import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import Header from '../../components/Header/header'; 
import './Announcement.css';

/* Mock Data exactly like your wireframe */
const announcementList = [
  {
    title: "Mid-term exams begin April 25",
    meta: "Posted Apr 10 · Admin · All students",
    desc: "Exams will be held from April 25 to May 2. Students are advised to check their timetables.",
    tags: [{ text: "All students", color: "blue" }, { text: "Read by 94%", color: "gray" }],
    badge: { text: "Urgent", type: "urgent" }
  },
  {
    title: "Parent-teacher meeting — April 28",
    meta: "Posted Apr 12 · Admin · All",
    desc: "PTM scheduled from 9 AM to 1 PM. All subject teachers are required to be present.",
    tags: [{ text: "All students", color: "blue" }, { text: "All teachers", color: "green" }, { text: "Read by 82%", color: "gray" }],
    badge: { text: "General", type: "general" }
  },
  {
    title: "Sports day registration open",
    meta: "Posted Apr 15 · Admin · All students",
    desc: "Register for sports day events by April 22. Available events: cricket, football, athletics.",
    tags: [{ text: "All students", color: "blue" }, { text: "Read by 74%", color: "gray" }],
    badge: { text: "Event", type: "event" }
  },
  {
    title: "Fee payment deadline — April 30",
    meta: "Posted Apr 15 · Admin · Grades 6–10",
    desc: "Monthly fee must be paid by April 30. Late payments will incur a surcharge of PKR 500.",
    tags: [{ text: "Grades 6–10", color: "yellow" }, { text: "Read by 50%", color: "gray" }],
    badge: { text: "Fee", type: "fee" }
  }
];

const SvgSearch = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const SvgPlus = () => <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;

/* 👇 Modal ke naye Icons 👇 */
const IconMegaphone = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>;
const IconClip = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-1.38-1.12-2.5-2.5-2.5S8 3.62 8 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>;

export default function Announcements() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); 

  /* 👇 Modal aur Toggle ki states 👇 */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [pinOn, setPinOn] = useState(false);

  // ⚡ INSTANT Data Filter Logic (No Delays, No Limits)
  const filteredAnnouncements = announcementList.filter((item) => {
    // 1. Search Logic
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category Buttons Logic
    let matchesCategory = true;
    if (activeFilter === 'Students') {
      matchesCategory = item.tags.some(tag => tag.text.toLowerCase().includes('student'));
    } else if (activeFilter === 'Teachers') {
      matchesCategory = item.tags.some(tag => tag.text.toLowerCase().includes('teacher'));
    } else if (activeFilter === 'Urgent') {
      matchesCategory = item.badge.type === 'urgent';
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout 
      userRole="admin" 
      currentPath="/admin/announcement" 
      userName="System Admin" 
      userInitials="SA"
    >
      <header className="ann-header">
        <div className="ann-header-left">
          <h2>Announcements</h2>
          <p>Broadcast messages to students, teachers, or everyone</p>
        </div>
        <div className="ann-header-right">
          {/* 👇 onClick event add kiya gaya hai 👇 */}
          <button className="ann-btn-primary" onClick={() => setIsModalOpen(true)}>
            <SvgPlus /> New announcement
          </button>
          <div className="ann-avatar">SA</div>
        </div>
      </header>

      <Header />

      <div className="ann-stats-row">
        <div className="ann-stat-card">
          <span className="ann-stat-title">Total sent</span>
          <span className="ann-stat-value">142</span>
          <span className="ann-stat-sub neutral">This academic year</span>
        </div>
        <div className="ann-stat-card">
          <span className="ann-stat-title">This month</span>
          <span className="ann-stat-value">8</span>
          <span className="ann-stat-sub neutral">4 urgent</span>
        </div>
        <div className="ann-stat-card">
          <span className="ann-stat-title">Audience reach</span>
          <span className="ann-stat-value">1,334</span>
          <span className="ann-stat-sub neutral">Students + Teachers</span>
        </div>
        <div className="ann-stat-card">
          <span className="ann-stat-title">Avg read rate</span>
          <span className="ann-stat-value">78%</span>
          <span className="ann-stat-sub">↑ 4% vs. last month</span>
        </div>
      </div>

      <div className="ann-controls">
        <div className="ann-search">
          <SvgSearch />
          <input 
            type="text" 
            placeholder="Search announcements..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="ann-filters">
          {['All', 'Students', 'Teachers', 'Urgent'].map((filter) => (
            <button 
              key={filter} 
              className={`ann-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="ann-list-container">
        <div className="ann-list-header">Recent announcements</div>
        <div className="ann-list-scroll">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item, i) => (
              <div key={i} className="ann-item">
                <div className="ann-item-content">
                  <span className="ann-item-title">{item.title}</span>
                  <span className="ann-item-meta">{item.meta}</span>
                  <p className="ann-item-desc">{item.desc}</p>
                  <div className="ann-tags">
                    {item.tags.map((tag, tIndex) => (
                      <span key={tIndex} className={`ann-tag ${tag.color}`}>{tag.text}</span>
                    ))}
                  </div>
                </div>
                <span className={`ann-badge ${item.badge.type}`}>{item.badge.text}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              No announcements match your search or filter.
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          ✨ THE NEW ANNOUNCEMENT MODAL ✨
          ========================================= */}
      {isModalOpen && (
        <div className="ann-modal-overlay">
          <div className="ann-modal">
            
            {/* Modal Header */}
            <div className="ann-modal-header">
              <div className="ann-modal-title-group">
                <div className="ann-modal-icon"><IconMegaphone /></div>
                <div className="ann-modal-title">
                  <h2>New Announcement</h2>
                  <p>Broadcast a message to students, teachers, or everyone</p>
                </div>
              </div>
              <div className="ann-draft-pill">Draft</div>
            </div>

            {/* Modal Body */}
            <div className="ann-modal-body">
              
              {/* SECTION 1: DETAILS */}
              <div>
                <div className="ann-section-title">Announcement Details</div>
                
                <div className="ann-form-group">
                  <label>Title <span>*</span></label>
                  <input type="text" className="ann-input" placeholder="📌 e.g. Mid-term exams begin April 25" />
                </div>

                <div className="ann-form-row">
                  <div className="ann-form-group">
                    <label>Category <span>*</span></label>
                    <select className="ann-input">
                      <option>Select category</option>
                      <option>Exam</option>
                      <option>Event</option>
                      <option>Holiday</option>
                    </select>
                  </div>
                  <div className="ann-form-group">
                    <label>Priority</label>
                    <select className="ann-input">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="ann-form-group">
                  <label>Message body <span>*</span></label>
                  <textarea className="ann-input ann-textarea" placeholder="Write the full announcement message here..."></textarea>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Supports plain text. Max 1,000 characters.</span>
                </div>
              </div>

              {/* SECTION 2: TARGET AUDIENCE */}
              <div>
                <div className="ann-section-title">Target Audience</div>
                
                <div className="ann-form-group">
                  <label>Send to <span>*</span></label>
                  <div className="ann-target-group">
                    <div className="ann-target-pill active">◉ Everyone</div>
                    <div className="ann-target-pill">○ All students</div>
                    <div className="ann-target-pill">○ All teachers</div>
                    <div className="ann-target-pill">○ Specific grades</div>
                    <div className="ann-target-pill">○ Specific class</div>
                  </div>
                </div>

                <div className="ann-form-row">
                  <div className="ann-form-group">
                    <label>Select grades (if applicable)</label>
                    <div className="ann-target-group">
                      <div className="ann-target-pill active">☑ Grade 1-3</div>
                      <div className="ann-target-pill active">☑ Grade 4-6</div>
                      <div className="ann-target-pill">☐ Grade 7-9</div>
                      <div className="ann-target-pill">☐ Grade 10</div>
                    </div>
                  </div>
                  <div className="ann-form-group">
                    <label>Select class (if applicable)</label>
                    <select className="ann-input">
                      <option>All classes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SCHEDULING */}
              <div>
                <div className="ann-section-title">Scheduling & Delivery</div>
                
                <div className="ann-form-row-3">
                  <div className="ann-form-group">
                    <label>Publish date <span>*</span></label>
                    <input type="date" className="ann-input" defaultValue="2026-04-20" />
                  </div>
                  <div className="ann-form-group">
                    <label>Expiry date</label>
                    <input type="date" className="ann-input" />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Leave blank for no expiry</span>
                  </div>
                  <div className="ann-form-group">
                    <label>Publish time</label>
                    <input type="time" className="ann-input" defaultValue="08:00" />
                  </div>
                </div>

                <div className="ann-switch-row">
                  <div className="ann-switch-label">
                    <h4>Send push notification</h4>
                    <p>Notify users via the EduSync mobile app</p>
                  </div>
                  <div className={`ann-toggle ${pushOn ? 'on' : ''}`} onClick={() => setPushOn(!pushOn)}></div>
                </div>
                <div className="ann-switch-row">
                  <div className="ann-switch-label">
                    <h4>Send email notification</h4>
                    <p>Email all recipients when published</p>
                  </div>
                  <div className={`ann-toggle ${emailOn ? 'on' : ''}`} onClick={() => setEmailOn(!emailOn)}></div>
                </div>
                <div className="ann-switch-row">
                  <div className="ann-switch-label">
                    <h4>Pin to notice board</h4>
                    <p>Show at the top of the school notice board</p>
                  </div>
                  <div className={`ann-toggle ${pinOn ? 'on' : ''}`} onClick={() => setPinOn(!pinOn)}></div>
                </div>
              </div>

              {/* SECTION 4: ATTACHMENT */}
              <div>
                <div className="ann-section-title">Attachment (Optional)</div>
                <div className="ann-upload-area">
                  <IconClip />
                  <p><span>Click to upload</span> or drag and drop</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>PDF, DOCX, JPG, PNG up to 5 MB</p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="ann-modal-footer">
              <div className="ann-req-text">* Required fields</div>
              <div className="ann-footer-actions">
                <button className="ann-btn-discard" onClick={() => setIsModalOpen(false)}>Discard</button>
                <button className="ann-btn-draft">Save as draft</button>
                <button className="ann-btn-publish" onClick={() => setIsModalOpen(false)}>Publish announcement</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}