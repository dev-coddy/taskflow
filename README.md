# ⚡ TaskFlow - Task & Daily Status Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://taskflow-cyan-eight.vercel.app/)

**🌐 Live Application:** [https://taskflow-cyan-eight.vercel.app/](https://taskflow-cyan-eight.vercel.app/)

TaskFlow is a modern, full-stack web application designed to streamline team task management, enforce strict deadline tracking, monitor daily progress updates, and generate copy-paste ready End-of-Day (EOD) status emails automatically.

---

## 🎯 Main Purpose & Core Problem Solved

Managing project tasks and keeping team members accountable can be challenging without clear visibility into daily progress and remaining time. 

**TaskFlow solves this by:**
1. **Time-Bound Task Management**: Managers assign tasks with explicit due dates and estimated duration/time allocations (hours spent/remaining), keeping team members strictly time-bound.
2. **Daily Status Logging**: Employees log daily updates with hours worked, progress remarks, and real-time status updates (`Not Started`, `In Progress`, `Completed`, `Blocked`).
3. **One-Click EOD Email Generator**: Eliminates manual status email writing. Managers and team members can generate formatted End-of-Day status emails filtered by date and department, and **copy them directly from the app** with a single click to send out.
4. **Real-Time Manager Feed & Reports**: Managers get a live dashboard feed of daily updates, KPI metrics, status distributions, and date-filtered CSV report exports.

---

## 🛠️ Basic Tech Stack

### **Frontend**
- **Core Library**: React (Vite)
- **Styling**: Vanilla CSS & Tailwind CSS (Dark/Light themes with glassmorphism aesthetics)
- **Routing**: React Router v6 (Role-adaptive route guards)
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios with JWT interceptors
- **Icons & UI Utilities**: React Icons, DayJS, React Hot Toast

### **Backend**
- **Runtime & Framework**: Node.js & Express.js
- **Database & ODM**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt.js password hashing
- **Development Database**: MongoDB Memory Server & MongoDB Atlas Cloud for production

### **Free Cloud Hosting Stack**
- **Database**: MongoDB Atlas (Free M0 Cluster)
- **Backend API**: Render.com (Free Web Service)
- **Frontend SPA**: Vercel (Free Single Page App Hosting with SPA rewrite rules)

---

## 🧠 Key Learnings & Engineering Takeaways

Building TaskFlow provided hands-on experience in full-stack architecture, state management, and production deployment:

- **Role-Based Access Control (RBAC)**: Designing secure, role-guarded routes and middleware distinguishing between Manager (administrative oversight, assignment, reports) and Employee (task execution, status logging, personal history) roles.
- **Form State Stability & Performance**: Managing complex form lifecycles using `react-hook-form` without accidental input resets or input focus loss during fast user typing.
- **Resilient API Architecture**: Building fallback mechanisms (e.g. in-memory MongoDB fallback for quick local development) and automatic URL normalization for environment variables.
- **User-Centric Productivity Tools**: Crafting one-click utility tools like the automated EOD Email Generator that directly solve real-world daily workflow friction.
- **Modern UI & UX Practices**: Implementing responsive layouts, theme toggling, clean micro-animations, and dynamic status badges with reduced border radius for a sleek software look.

---

## 🚀 Live Demo & Getting Started

### 🌐 Live Application
- **Live Application**: **[https://taskflow-cyan-eight.vercel.app/](https://taskflow-cyan-eight.vercel.app/)**
- **Direct Login**: **[https://taskflow-cyan-eight.vercel.app/login](https://taskflow-cyan-eight.vercel.app/login)**

#### 🔑 Test Demo Credentials:
| Role | Email Address | Password |
| :--- | :--- | :--- |
| **👔 Manager** | `manager@taskflow.com` | `Password123!` |
| **👤 Employee 1** | `alex@taskflow.com` | `Password123!` |
| **👤 Employee 2** | `sarah@taskflow.com` | `Password123!` |

---

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start (Local Setup)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dev-coddy/taskflow.git
   cd taskflow
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Default Credentials**:
   - **Manager**: `manager@taskflow.com` | Password: `Password123!`
   - **Employee 1**: `alex@taskflow.com` | Password: `Password123!`
   - **Employee 2**: `sarah@taskflow.com` | Password: `Password123!`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
