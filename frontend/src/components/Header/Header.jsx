import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice'; 
import { useNavigate } from 'react-router';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white px-6 py-4 shadow-md border-b border-gray-200 flex justify-between items-center">
      <h1 className="text-2xl text-center font-bold text-blue-600 ">Expense Tracker</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
