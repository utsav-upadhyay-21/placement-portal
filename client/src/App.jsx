import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Calendar from "./pages/Calendar";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import ManageJobs from "./pages/ManageJobs";
import ManageCalendar from "./pages/ManageCalendar";
import ManageStudents from "./pages/ManageStudents";
import ManageMaterials from "./pages/ManageMaterials";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/jobs.css";
import "./styles/calendar.css";
import "./styles/student.css";
import "./styles/dashboard.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/student" element={<StudentLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/jobs" element={<ManageJobs />} />
            <Route path="/dashboard/calendar" element={<ManageCalendar />} />
            <Route path="/dashboard/students" element={<ManageStudents />} />
            <Route
              path="/dashboard/materials"
              element={<ManageMaterials />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
