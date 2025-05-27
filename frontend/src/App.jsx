import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import EmployeeList from "./components/Employee/EmployeeList";
import SalaryList from "./components/Salary/SalaryList";
import MonthlyPayroll from "./components/Reports/MonthlyPayroll";
import Login from "./components/auth/login";
import Dashboard from "./components/Dashboard";
import Register from "./components/auth/register";
import DepartmentList from "./components/Department/DepartmentList";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div className="flex flex-col min-h-screen">
      <div className="flex ">
        <Sidebar />
        <main className="flex-1 p-6">
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
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
};

export default App;
