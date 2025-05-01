import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/authSlice';
import { useNavigate } from 'react-router';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap()
    navigate('/');
  };

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              💰 ExpenseTracker
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm font-medium">
              👋 {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-gray-200 text-sm px-4 py-1.5 rounded hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
