import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    dob: ''
  });
  
  const [users, setUsers] = useState([]);
  
  const [quickLogin, setQuickLogin] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };
  
  const handleQuickLoginChange = (e) => {
    setQuickLogin({
      ...quickLogin,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await axios.post(`${API_URL}/login`, {
          username: formData.username,
          password: formData.password
        });
        
        if (response.data.success) {
          console.log('Login successful:', response.data.user);
          
          // Store user information in local storage
          localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
          
          navigate('/dashboard'); // Redirect to dashboard after successful login
        }
      } else {
        // Register logic
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        if (formData.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
          }
        }

        // Send registration request to backend
        const response = await axios.post(`${API_URL}/users`, formData);
        
        // Update users state with the new user
        setUsers([...users, response.data]);
        
        console.log('User registered:', response.data);
        alert('Registration successful!');
        
        // Reset form and switch to login
        setFormData({
          username: '',
          password: '',
          email: '',
          dob: ''
        });
        setIsLogin(true);

        // After successful registration, redirect to login page
        navigate('/login');

        // Store user information in local storage
        localStorage.setItem('loggedInUser', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: quickLogin.username,
        password: quickLogin.password
      });
      
      if (response.data.success) {
        console.log('Quick login successful:', response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  // Display users in console in the format shown in the image
  useEffect(() => {
    const displayUsersJson = () => {
      console.log(JSON.stringify(users, null, 2));
    };
    displayUsersJson();
  }, [users]);

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side - Image (60% of space) */}
      <div className="w-3/5 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-4xl font-bold p-8">
          {/* Replace with your actual image */}
          <div className="w-full h-96 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center rounded-lg">
            <span className="text-5xl">KodJobs</span>
          </div>
          <p className="mt-8 text-xl text-center">Find your dream job with KodJobs</p>
        </div>
      </div>

      {/* Right side - Login/Register Form (40% of space) */}
      <div className="w-2/5 p-8 flex flex-col justify-center">
        <div className="border border-gray-700 rounded-lg p-6 bg-gray-800/50">
          {/* Profile Icon */}
          <div className="flex justify-end mb-4">
            <button className="text-white">
              <i className="fas fa-user-circle text-3xl"></i> {/* Profile Icon */}
            </button>
          </div>
          {/* Quick login at the top of the form container */}
          <div className="flex justify-end mb-6 space-x-2">
            <input
              type="text"
              name="username"
              placeholder="username"
              className="px-2 py-1 bg-transparent border border-green-500 text-green-500 text-sm rounded"
              value={quickLogin.username}
              onChange={handleQuickLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              className="px-2 py-1 bg-transparent border border-green-500 text-green-500 text-sm rounded"
              value={quickLogin.password}
              onChange={handleQuickLoginChange}
            />
            <button 
              className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              onClick={handleQuickLogin}
              disabled={loading}
            >
              Login
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Login' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Join us and start your job search journey'}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-100/10 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded bg-white/10 border border-gray-300 text-white placeholder-gray-300"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded bg-white/10 border border-gray-300 text-white placeholder-gray-300"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded bg-white/10 border border-gray-300 text-white placeholder-gray-300"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <input
                    name="dob"
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded bg-white/10 border border-gray-300 text-white placeholder-gray-300"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'SIGN IN' : 'SIGN UP')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login"
              className="text-green-400 hover:text-green-300 transition-colors"
              disabled={loading}
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;