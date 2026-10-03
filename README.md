# Department Selection System — Full Professional Version

A complete university department selection platform with student registration, preference selection, automatic merit-based assignment, and admin management.

## Features

### Public
- Professional landing / home page
- Clear selection status (Open / Closed)

### Student
- Multi-step registration (Account → Personal → Academic)
- Login with Student ID
- Dashboard with academic summary
- **Select Departments** (up to 3 ordered preferences)
- Eligibility checking (score, GPA, subjects, stream)
- **My Result** page (printable)

### Admin
- Admin Dashboard with live stats
- Open / Close selection period
- Manage Colleges & Departments (capacity, min requirements, stream)
- **Run Automatic Assignment** (merit + preference + capacity)
- View all assignment results

### Assignment Algorithm
1. Students sorted by Total Score (DESC), then GPA
2. For each student: try 1st choice → if capacity available, assign
3. Else try 2nd choice → else 3rd choice
4. If none available → Not Assigned

---

## Tech Stack
- Frontend: React + Vite + Bootstrap 5 + React Router + Axios
- Backend: Node.js + Express + MySQL2 + JWT + bcrypt
- Database: MySQL

---

## Setup

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env if needed
node scripts/createAdmin.js
npm start
# → http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Default Admin
- Student ID: `ADMIN001`
- Password: `Admin@123`

---

## Main Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/register` | Public | Student registration |
| `/login` | Public | Login |
| `/dashboard` | Student | Student home |
| `/select` | Student | Choose department preferences |
| `/result` | Student | View assignment result |
| `/admin` | Admin | Admin dashboard |
| `/admin/departments` | Admin | Manage departments |
| `/admin/results` | Admin | View all results |

---

## Project Structure
```
department-selection-system/
├── database/schema.sql
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   └── selectionController.js
│   ├── routes/
│   └── scripts/createAdmin.js
└── frontend/src/
    ├── App.jsx
    ├── services/api.js
    └── components/
        ├── Home.jsx
        ├── Register.jsx / Login.jsx
        ├── Dashboard.jsx
        ├── SelectDepartment.jsx
        ├── MyResult.jsx
        ├── AdminDashboard.jsx
        ├── AdminDepartments.jsx
        └── AdminResults.jsx
```
