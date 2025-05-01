// src/components/Login.jsx
import React, { useState ,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, toggleMode } from '../../features/authSlice'
import { useNavigate } from 'react-router';

function Login() {
  const dispatch = useDispatch();
  const { isRegister, isLoading, error,user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // navigate to particular route as soon as user gets logged in:

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/dashboard'); // change this to wherever you want to redirect
    }
  }, [user, navigate]);


  const handleToggleMode = () => {
    dispatch(toggleMode());
    setErrors({});       // 🔥 clear previous errors
    setFormData({        // (optional) clear form fields
      name: '',
      email: '',
      password: ''
    });
  };
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors  = validaateForm(formData);
    setErrors(formErrors) ;

    if(Object.keys(formErrors).length>0){
      return 
    }

    if (isRegister) {
      dispatch(registerUser(formData));

      // console.log("inside register user");
      
    } else {
      dispatch(loginUser(formData));
    }
  };

  const validaateForm = (data)=>{
    const newErrors = {};

    if(isRegister && !data.name.trim()){
      newErrors.name = 'Name is required.';
    }

    if(!data.email.trim()){
      newErrors.email = 'Email is required.';
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
      newErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      newErrors.password = 'Password is required.';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? 'Register' : 'Login'}
        </h2>

        {error && (
        <div className="text-red-500 text-sm text-center mb-4">
            {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                // required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          )}
          {isRegister && errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}


          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
           
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {errors.email && ( <p className="text-red-500 text-xs mt-1">{errors.email}</p>)}

          <div>
            <label htmlFor="password" className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              // required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {errors.password && ( <p className="text-red-500 text-xs mt-1">{errors.password}</p>)}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-blue-600 ml-2 hover:underline"
            >
              {isRegister ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
