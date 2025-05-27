import { useState, useEffect } from 'react';
import api from '../../services/api';

const SalaryForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    totalDeduction: '',
    netSalary: '',
    month: new Date().getMonth() + 1 // Current month
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to load employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/salaries', formData);
      onSuccess();
      setFormData(prev => ({
        ...prev,
        totalDeduction: '',
        netSalary: '',
        month: new Date().getMonth() + 1
      }));
    } catch (err) {
      setError(err.message || 'Failed to create salary record');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add Salary Record</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
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
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
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
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Deduction</span>
              </label>
              <input
                type="number"
                name="totalDeduction"
                value={formData.totalDeduction}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Net Salary</span>
              </label>
              <input
                type="number"
                name="netSalary"
                value={formData.netSalary}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;