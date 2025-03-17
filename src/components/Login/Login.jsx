import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      alert('Please enter both username and password');
      return;
    }

    const user = users.find((user) => user.username === formData.username && user.password === formData.password);
    
    if (user) {
      // Store user information in local storage
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Login to Your Account</h2>
        <p className="text-gray-400 text-center mt-0 mb-2">Join us and start your job search journey</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="block text-gray-300">
            Username:
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </label>
          <br />
          <label htmlFor="password" className="block text-gray-300">
            Password:
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </label>
          <br />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500 transition duration-200">
            Login
          </button>
        </form>
        <p className="text-center text-gray-400">
          Don't have an account? <Link to="/" className="text-green-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

