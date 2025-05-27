import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-4 bg-base-200 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <span className="text-lg font-bold">My App</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 min-h-screen w-64 bg-base-200 p-4 z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            EPMS
          </Link>
        </div>
        <ul className="menu mt-16 lg:mt-0">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <HomeIcon className="h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employees"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <UserGroupIcon className="h-5 w-5" />
              Employees
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/departments"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <BuildingOfficeIcon className="h-5 w-5" />
              Departments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/salaries"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <CurrencyDollarIcon className="h-5 w-5" />
              Salaries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <DocumentChartBarIcon className="h-5 w-5" />
              Reports
            </NavLink>
          </li>
          <li>
            <Link to="/login" className="btn btn-ghost w-full text-error">
              Login
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
