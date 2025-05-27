import { useState, useEffect } from 'react';
import api from '../../services/api';
import SalaryForm from './SalaryForm';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/salaries');
      setSalaries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch salaries');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) {
      return;
    }
    try {
      await api.delete(`/salaries/${id}`);
      fetchSalaries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete salary record');
    }
  };

  const handleEdit = (salary) => {
    setCurrentSalary(salary);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentSalary(null);
    fetchSalaries();
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
  };

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Salary Records</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchSalaries()}
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              setCurrentSalary(null);
              setShowForm(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Salary
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {showForm && (
        <SalaryForm
          salary={currentSalary}
          employees={employees}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setCurrentSalary(null);
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Total Deduction</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No salary records found
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>{getEmployeeName(salary.employeeId)}</td>
                    <td>{getMonthName(salary.month)}</td>
                    <td>${salary.totalDeduction}</td>
                    <td>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {salary.netSalary}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(salary)}
                          className="btn btn-ghost btn-xs"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(salary.id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryList;