import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-base-200 fixed">
      <ul className="menu p-4">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
            <UserGroupIcon className="h-5 w-5" />
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
            <BuildingOfficeIcon className="h-5 w-5" />
            Departments
          </NavLink>
        </li>
        <li>
          <NavLink to="/salaries" className={({ isActive }) => isActive ? 'active' : ''}>
            <CurrencyDollarIcon className="h-5 w-5" />
            Salaries
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <DocumentChartBarIcon className="h-5 w-5" />
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;