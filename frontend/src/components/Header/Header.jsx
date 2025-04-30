import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-gray-800 px-6 py-3 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-medium text-white">
          Expense Tracker
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm">
            Welcome, {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-sm hover:bg-gray-600 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
