import { useState, useEffect } from 'react';
import api from '../../services/api';

const MonthlyPayroll = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPayrollData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/reports/monthly-payroll?month=${month}`);
      setPayrollData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [month]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Monthly Payroll Report</h2>
        
        <div className="space-y-2 flex flex-col w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Select Month</span>
          </label>
          <select
            value={month}
            onChange={handleMonthChange}
            className="select select-bordered"
            disabled={loading}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.position}</td>
                    <td>{item.departmentName}</td>
                    <td>{item.netSalary}</td>
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

export default MonthlyPayroll;