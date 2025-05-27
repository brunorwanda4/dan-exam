import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import EmployeeList from './components/Employee/EmployeeList';
import SalaryList from './components/Salary/SalaryList';
import MonthlyPayroll from './components/Reports/MonthlyPayroll';
import Login from './components/auth/login';
import Dashboard from './components/Dashboard';
import Register from './components/auth/register';
import DepartmentList from './components/Department/DepartmentList';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/salaries" element={<SalaryList />} />
            <Route path="/reports" element={<MonthlyPayroll />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;