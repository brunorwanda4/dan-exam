import { useState, useEffect } from 'react';
import api from '../../services/api';

const SalaryForm = ({ salary, employees, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(
    salary || {
      employeeId: '',
      totalDeduction: '',
      netSalary: '',
      month: new Date().getMonth() + 1
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (salary) {
      setFormData(salary);
    }
  }, [salary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (salary) {
        // Update existing salary
        await api.put(`/salaries/${salary.id}`, formData);
      } else {
        // Create new salary
        await api.post('/salaries', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save salary record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <h2 className="card-title">
          {salary ? 'Edit Salary Record' : 'Add New Salary Record'}
        </h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <label className="label">
                <span className="label-text">Employee</span>
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="label">
                <span className="label-text">Month</span>
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="label">
                <span className="label-text">Total Deduction</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  name="totalDeduction"
                  value={formData.totalDeduction}
                  onChange={handleChange}
                  className="input input-bordered pl-8"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="label">
                <span className="label-text">Net Salary</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  name="netSalary"
                  value={formData.netSalary}
                  onChange={handleChange}
                  className="input input-bordered pl-8"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {salary ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;