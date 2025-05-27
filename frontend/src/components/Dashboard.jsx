import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    salaries: 0,
    payroll: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [empRes, deptRes, salRes] = await Promise.all([
          api.get('/employees'),
          api.get('/departments'),
          api.get('/salaries')
        ]);
        
        // Calculate total payroll
        const totalPayroll = salRes.data.reduce((sum, salary) => {
          return sum + parseFloat(salary.netSalary);
        }, 0);
        
        setStats({
          employees: empRes.data.length,
          departments: deptRes.data.length,
          salaries: salRes.data.length,
          payroll: totalPayroll.toFixed(2)
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<UserGroupIcon className="h-8 w-8" />}
              title="Total Employees"
              value={stats.employees}
              color="primary"
            />
            <StatCard 
              icon={<BuildingOfficeIcon className="h-8 w-8" />}
              title="Departments"
              value={stats.departments}
              color="secondary"
            />
            <StatCard 
              icon={<CurrencyDollarIcon className="h-8 w-8" />}
              title="Salary Records"
              value={stats.salaries}
              color="accent"
            />
            <StatCard 
              icon={<ChartBarIcon className="h-8 w-8" />}
              title="Total Payroll"
              value={`$${stats.payroll}`}
              color="info"
            />
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecentEmployees />
            <RecentSalaries />
          </div>
        </>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className={`card bg-${color} text-${color}-content shadow-lg`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-dark`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Employees Component
const RecentEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEmployees = async () => {
      try {
        const response = await api.get('/employees?_limit=5&_sort=hiredDate&_order=desc');
        setEmployees(response.data);
      } catch (err) {
        console.error('Failed to fetch recent employees:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentEmployees();
  }, []);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Recent Employees</h2>
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Hired Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.firstName} {employee.lastName}</td>
                    <td>{employee.position}</td>
                    <td>{new Date(employee.hiredDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Recent Salaries Component
const RecentSalaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSalaries = async () => {
      try {
        const response = await api.get('/salaries?_limit=5&_sort=id&_order=desc');
        setSalaries(response.data);
      } catch (err) {
        console.error('Failed to fetch recent salaries:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentSalaries();
  }, []);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Recent Salary Records</h2>
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map(salary => (
                  <tr key={salary.id}>
                    <td>{salary.firstName} {salary.lastName}</td>
                    <td>{new Date(0, salary.month - 1).toLocaleString('default', { month: 'long' })}</td>
                    <td>${salary.netSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;