import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DepartmentForm from './DepartmentForm';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentDepartment(null);
    fetchDepartments();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchDepartments()}
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              setCurrentDepartment(null);
              setShowForm(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Department
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
        <DepartmentForm
          department={currentDepartment}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setCurrentDepartment(null);
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
                <th>Code</th>
                <th>Name</th>
                <th>Gross Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No departments found
                  </td>
                </tr>
              ) : (
                departments.map((department) => (
                  <tr key={department.id}>
                    <td>{department.departmentCode}</td>
                    <td>{department.departmentName}</td>
                    <td>${department.grossSalary}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(department)}
                          className="btn btn-ghost btn-xs"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
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

export default DepartmentList;