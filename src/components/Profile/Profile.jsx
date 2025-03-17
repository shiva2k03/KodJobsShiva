import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { calculateAge } from '../../services/userService'; // Import the calculateAge function

const API_URL = 'http://localhost:5000/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Get user from local storage
        if (!loggedInUser) {
          navigate('/login'); // Redirect to login if no user is found
          return;
        }

        // Fetch user details from the server
        const response = await axios.get(`${API_URL}/users`); // Adjust this endpoint as needed
        const userDetails = response.data.users.find(u => u.username === loggedInUser.username); // Use the username from local storage
        if (userDetails) {
          setUser(userDetails);
        } else {
          navigate('/login'); // Redirect if user not found
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const age = calculateAge(user.DOB); // Calculate age directly from DOB

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Profile</h2>
        
        <div className="text-gray-400 mb-2">
          <strong>Username:</strong> <span className="text-white">{user.username}</span>
        </div>
        <div className="text-gray-400 mb-2">
          <strong>Email:</strong> <span className="text-white">{user.email}</span>
        </div>
        <div className="text-gray-400 mb-2">
          <strong>Date of Birth:</strong> <span className="text-white">{user.DOB}</span>
        </div>
        <div className="text-gray-400 mb-4">
          <strong>Age:</strong> <span className="text-white">{age} years</span>
        </div>

        {/* Add more user details as needed */}
        <div className="text-center">
          <button 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 