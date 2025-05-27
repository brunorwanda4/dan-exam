import { useState } from 'react';
import api from '../../services/api';

const DepartmentForm = ({ department, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(
    department || {
      departmentCode: '',
      departmentName: '',
      grossSalary: ''
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (department) {
        // Update existing department
        await api.put(`/departments/${department.id}`, formData);
      } else {
        // Create new department
        await api.post('/departments', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <h2 className="card-title">
          {department ? 'Edit Department' : 'Add New Department'}
        </h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Department Code</span>
              </label>
              <input
                type="text"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Department Name</span>
              </label>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gross Salary</span>
              </label>
              <input
                type="number"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
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
              {department ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;