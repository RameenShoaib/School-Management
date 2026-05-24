# EduSync Project Context

## Project Overview

EduSync is a school management system built as a React single-page app with a separate Express/PostgreSQL backend. The app is currently focused on admin workflows: managing students, teachers, classes, subjects, attendance, exams, fees, announcements, and reports.

The frontend is a Vite React app in `src/`. The backend lives in `backend/` and exposes REST endpoints on `http://localhost:5000/api/...`. Data is stored in PostgreSQL, apparently Neon, using `pg` and a `DATABASE_URL` environment variable.

## Tech Stack

- Frontend: React 19, Vite, React Router DOM 7
- Styling: plain CSS files colocated with pages/components
- Alerts/modals: SweetAlert2
- PDF/export support: `jspdf`, `jspdf-autotable`
- Backend: Express 5, CORS, dotenv, pg
- Database: PostgreSQL/Neon via `backend/db.js`

## Run Commands

Frontend commands from the project root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Backend commands from `backend/`:

```bash
npm install
node server.js
```

The backend expects `.env` inside `backend/` or an environment variable with:

```env
DATABASE_URL=postgresql://...
PORT=5000
```

## Important Paths

- `src/main.jsx`: React root mount.
- `src/App.jsx`: route definitions.
- `src/components/DashboardLayout.jsx`: shared dashboard shell.
- `src/components/Sidebar/Sidebar.jsx`: role-aware navigation/sidebar.
- `src/components/Header/header.jsx`: reusable command bar with Edit, Refresh, Delete, Export buttons.
- `src/pages/Auth/Login.jsx`: login page and role selector.
- `src/pages/Admin/`: main admin modules.
- `src/pages/Teacher/TeacherDashboard.jsx`: teacher dashboard mock/static view.
- `src/pages/Student/StudentDashboard.jsx`: student dashboard mock/static view.
- `src/pages/parent/ParentDashboard.jsx`: currently empty.
- `backend/server.js`: Express routes and table initialization.
- `backend/db.js`: PostgreSQL pool setup.

## Frontend Routing

Defined in `src/App.jsx`:

- `/`: login page.
- `/admin/dashboard`: admin dashboard.
- `/teacher/dashboard`: teacher dashboard.
- `/student/dashboard`: student dashboard.
- `/admin/announcement`: announcements.
- `/students`: student management.
- `/teachers`: teacher management.
- `/classes`: class management.
- `/subjects`: subject management.
- `/attendance`: attendance management.
- `/fees`: fee management.
- `/exams`: exams management.
- `/reports`: reports.
- `*`: redirects to `/`.

There is a dropdown link in the admin dashboard for `/parent/dashboard`, but `App.jsx` does not currently define that route.

## Shared Layout And Navigation

Most dashboard pages render inside `DashboardLayout`, which creates a fixed sidebar and scrollable main content area. The sidebar uses `userRole`, `currentPath`, `userName`, and `userInitials` props to show the correct nav items and profile.

`Sidebar.jsx` has role-based nav configuration:

- Overview: Dashboard, Announcements.
- Management: Students, Teachers, Classes, Subjects.
- Operations: Attendance, Exams, Fee management, Reports.
- System: Settings.

Logout uses SweetAlert2 confirmation, clears `localStorage.user` and `localStorage.token`, then navigates to `/`.

The shared `Header` component is a command/action bar. Pages pass handlers like `onRefresh`, `onDelete`, and `onExport`. If handlers are not passed, the buttons still render but do nothing.

## Authentication

`Login.jsx` lets the user choose `admin`, `teacher`, or `student`, then posts:

```http
POST http://localhost:5000/api/login
```

Payload:

```json
{ "email": "...", "password": "...", "role": "admin" }
```

The backend checks the `users` table by email, compares `password_hash` directly to the provided password, checks role, then returns a redirect URL.

Current auth notes:

- Passwords are plain string comparisons, not hashed verification.
- Login stores only `user` in localStorage; no real token flow is implemented.
- Routes are not protected. Any route can be opened directly.

## Admin Pages

### Admin Dashboard

File: `src/pages/Admin/Dashboard.jsx`

Mostly static dashboard data:

- Summary cards for total students, teachers, attendance, fee collection.
- Attendance by grade chart.
- Upcoming events.
- Recent enrollments.
- Dropdown to switch to teacher, student, or parent dashboard.

It uses `DashboardLayout` and `Header`.

### Announcements

File: `src/pages/Admin/Announcement.jsx`

Currently uses mock announcement data only. Features:

- Search and category filters.
- Stats cards.
- Announcement list.
- New announcement modal with fields for title, category, priority, body, audience, schedule, toggles, and attachment UI.

No backend endpoints are connected yet for announcements.

### Students

File: `src/pages/Admin/students.jsx`

Connected to backend. Features:

- Fetches students from `/api/students`.
- Fetches classes from `/api/classes` to populate grade/section options.
- Search by name or roll number.
- Pagination, 7 records per page.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/students/bulk-delete`.
- Add/Edit student modal with 4 steps:
  - Personal info.
  - Academic details.
  - Guardian info.
  - Fee and documents.
- Add uses `POST /api/students`.
- Edit uses `PUT /api/students/:id`.

Student creation also creates a linked `users` row with default password `Student@123`.

### Teachers

File: `src/pages/Admin/Teacher.jsx`

Connected to backend. Features:

- Fetches teachers from `/api/teachers`.
- Search by name, employee ID, or subject/designation.
- Filters: All, Active, On leave.
- Pagination, 7 records per page.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/teachers/bulk-delete`.
- Add/Edit teacher modal.
- Add uses `POST /api/teachers`.
- Edit uses `PUT /api/teachers/:id`.

Teacher creation also creates a linked `users` row with default password `Teacher@123`.

### Classes

File: `src/pages/Admin/Classes.jsx`

Connected to backend. Features:

- Fetches classes from `/api/classes`.
- Fetches available subjects from `/api/subjects`.
- Fetches available teachers from `/api/teachers`.
- Search by grade/class or teacher.
- Pagination, 7 records per page.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/classes/bulk-delete`.
- Add/Edit class modal with:
  - grade, section, max capacity, room, academic year, notes.
  - homeroom teacher and co-teacher.
  - subject assignment.
  - start/end time.
  - settings toggles: attendance tracking, gradebook, portal access.
- Add uses `POST /api/classes`.
- Edit uses `PUT /api/classes/:id`.

Some table values are still generated placeholders, such as random attendance percentage and average grade.

### Subjects

File: `src/pages/Admin/subjects.jsx`

Connected to backend. Features:

- Fetches subjects from `/api/subjects`.
- Fetches classes from `/api/classes` to populate grade levels.
- Stats for total/core/elective/unassigned.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/subjects/bulk-delete`.
- Add subject modal.
- Add uses `POST /api/subjects`.

There is no subject edit flow yet.

### Attendance

File: `src/pages/Admin/Attendance.jsx`

Connected to backend. Features:

- Fetches students, teachers, and attendance records.
- Stats for present, absent, late, holiday/leave.
- Dynamic attendance by grade for today.
- Dynamic weekly trend for last 5 days.
- Filter table by grade, section, and start date.
- Shows a 5-day attendance window.
- Pagination, 7 students per page.
- Checkbox selection.
- CSV export for selected rows.
- Bulk clear attendance via `/api/attendance/bulk-delete`.
- Mark attendance modal:
  - date, grade, section, period, marked by teacher.
  - status toggles: P, A, L, H.
  - mark all present/absent.
  - optional remarks.
- Saves via `POST /api/attendance/bulk`.

Attendance status mapping:

- `P` -> `Present`
- `A` -> `Absent`
- `L` -> `Late`
- `H` -> `Holiday`

### Exams

File: `src/pages/Admin/exam.jsx`

Connected to backend. Features:

- Fetches exams, teachers, subjects, and classes.
- Search by exam title or subject.
- Pagination, 7 records per page.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/exams/bulk-delete`.
- Schedule exam modal.
- Add uses `POST /api/exams`.

The exam UI expects normalized relationships through `subjectId`, `classId`, and `invigilatorId`.

### Fee Management

File: `src/pages/Admin/FeeManagement.jsx`

Connected to backend. Features:

- Fetches fee records from `/api/fees`.
- Fetches students from `/api/students`.
- Search fee records.
- Checkbox selection.
- CSV export for selected rows.
- Bulk delete via `/api/fees/bulk-delete`.
- Record payment modal:
  - search/select student by name or roll number.
  - fee month, amount, method, transaction ID.
- Saves via `POST /api/fees`.

### Reports

File: `src/pages/Admin/Reports.jsx`

Partially connected to backend. Features:

- Fetches school snapshot from `/api/reports/snapshot`.
- Fetches report history from `/api/reports/recent`.
- Generate report modal posts to `/api/reports/generate`.
- Local PDF generation with `jspdf` and `jspdf-autotable`.
- CSV-style download for non-PDF reports.

The backend also has `/api/reports/download-pdf/:id`, but the frontend currently generates PDFs locally instead of using that route.

## Teacher, Student, And Parent Pages

`TeacherDashboard.jsx` and `StudentDashboard.jsx` are currently mock/static dashboard-style tables. They use `DashboardLayout` with `userRole="admin"` even though they represent teacher/student dashboards.

`ParentDashboard.jsx` exists but is empty, and no parent route is defined in `App.jsx`.

## Backend API Summary

Backend base URL:

```txt
http://localhost:5000
```

Auth:

- `POST /api/login`

Students:

- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `POST /api/students/bulk-delete`

Teachers:

- `GET /api/teachers`
- `POST /api/teachers`
- `PUT /api/teachers/:id`
- `POST /api/teachers/bulk-delete`

Classes:

- `GET /api/classes`
- `POST /api/classes`
- `PUT /api/classes/:id`
- `POST /api/classes/bulk-delete`

Subjects:

- `GET /api/subjects`
- `POST /api/subjects`
- `POST /api/subjects/bulk-delete`

Attendance:

- `GET /api/attendance`
- `POST /api/attendance/bulk`
- `POST /api/attendance/bulk-delete`

Exams:

- `GET /api/exams`
- `POST /api/exams`
- `POST /api/exams/bulk-delete`

Fees:

- `GET /api/fees`
- `POST /api/fees`
- `POST /api/fees/bulk-delete`

Reports:

- `GET /api/reports/snapshot`
- `GET /api/reports/recent`
- `GET /api/reports/download-pdf/:id`
- `POST /api/reports/generate`

## Database Tables Used Or Expected

The backend initializes some tables in `initDatabase()`:

- `classes`
- `subjects_table`
- `attendance`
- `exams`

Other tables are used but not created in `initDatabase()`:

- `users`
- `students`
- `teachers`
- `fee_payments`
- `generated_reports`

Expected/highly used columns include:

Users:

- `user_id`, `email`, `password_hash`, `role`

Students:

- `student_id`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `gender`, `blood_group`, `cnic`, `religion`, `email`, `phone`, `residential_address`, `city`, `province`, `postal_code`, `grade`, `section`, `enrollment_date`, `previous_school`, `guardian_name`, `guardian_relation`, `guardian_occupation`, `guardian_contact`, `guardian_email`, `monthly_fee`, `fee_discount`, `notes`, `status`, `fee_status`, `roll_no`, `user_id`

Teachers:

- `teacher_id`, `first_name`, `last_name`, `gender`, `date_of_birth`, `cnic`, `phone_number`, `designation`, `employment_type`, `email`, `joining_date`, `emp_id`, `status`, `user_id`

Classes:

- `class_id`, `grade`, `section`, `max_capacity`, `room_number`, `academic_year`, `notes`, `teacher_name`, `co_teacher`, `subjects`, `start_time`, `end_time`, `status`, `created_at`
- The frontend/backend route code also expects a `settings` column, but the table initialization does not currently create it.

Subjects:

- `subject_id`, `subject_name`, `subject_code`, `grade_level`, `subject_category`, `teacher_name`, `weekly_periods`, `credit_hours`, `is_elective`, `has_lab`, `status`, `created_at`

Attendance:

- `attendance_id`, `student_id`, `class_id`, `attendance_date`, `status`, `remarks`, `marked_by`, `created_at`
- Unique constraint is attempted for `(student_id, attendance_date)`.

Fees:

- `payment_id`, `student_id`, `payment_type`, `fee_month`, `payment_date`, `amount_due`, `discount_amount`, `amount_received`, `payment_method`, `transaction_id`, `remarks`, `print_receipt`, `email_guardian`, `sms_confirm`

Reports:

- `report_id`, `report_name`, `report_type`, `generated_by`, `format`, `created_at`

## Known Issues And Risks

- The project folder is not currently a Git repository.
- There are mojibake/encoding artifacts in many files, for example `ðŸ‘‰`, `âœ“`, `â€”`. This likely came from emoji/special characters being saved or displayed with the wrong encoding.
- `backend/server.js` uses CommonJS `require`, while the root frontend package uses `"type": "module"`. Backend has its own `package.json`, so this should work if run from `backend/`.
- Backend table initialization is incomplete. It creates only some tables. Existing database must already contain `users`, `students`, `teachers`, `fee_payments`, and `generated_reports`.
- Class routes use a `settings` column, but `CREATE TABLE classes` does not create `settings`.
- Exam routes use `subject_id`, `class_id`, `room_number`, and `weightage_percent`, but the `CREATE TABLE exams` statement currently creates different columns like `subject`, `grade`, `sections`, `exam_rooms`, and `weightage`. This mismatch can break scheduling/fetching exams unless the actual DB schema has already been changed manually.
- Login compares plain text passwords against `password_hash`. Real password hashing is not implemented.
- There is no route protection or auth guard on the frontend.
- Many frontend API URLs are hardcoded to `http://localhost:5000`.
- Announcements are mock-only and have no backend persistence.
- Teacher and student dashboards are mock/static and still pass admin role to the layout.
- Parent dashboard is empty and not registered in routing.
- Some UI values are placeholder/random, especially classes attendance and average grade.
- File upload controls in student/teacher/announcement/class forms are visual only and do not upload files.
- The shared `Header` renders buttons even when pages do not pass handlers.

## Development Style In This Project

- Components are functional React components with local `useState` and `useEffect`.
- Each page has a matching CSS file with page-specific class prefixes:
  - `ad-` admin dashboard
  - `ann-` announcements
  - `st-` students management
  - `tc-` teacher management
  - `cl-` classes
  - `sbj-` subjects
  - `att-` attendance
  - `ex-` exams
  - `fm-` fees/reports shared styles
- Most admin pages follow the same pattern:
  - page header
  - shared action header
  - search/filter controls
  - table
  - checkbox selection
  - CSV export for selected records
  - delete confirmation with SweetAlert2
  - modal for create/edit

## Suggested Next Steps

1. Fix backend schema mismatches for `classes.settings` and exams columns.
2. Add missing table initialization or migrations for `users`, `students`, `teachers`, `fee_payments`, and `generated_reports`.
3. Move hardcoded API base URL into an environment variable, for example `VITE_API_URL`.
4. Add frontend route guards based on the logged-in user role.
5. Replace plain password checks with hashed passwords.
6. Connect announcements to backend CRUD endpoints.
7. Convert teacher/student dashboards from mock data to role-specific backend data.
8. Add parent dashboard route and implementation, or remove the link until ready.
9. Clean encoding artifacts and replace broken emoji/symbol text with ASCII or valid UTF-8.
10. Add a small migration/seed script for local development.

