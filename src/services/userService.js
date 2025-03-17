import axios from 'axios';

const API_KEY = 'd29abf8a-97e2-48aa-bde3-a252c91cc173';
const API_URL = 'https://jooble.org/api/';

// If axios is being used, use it somewhere in the file
// For example:
// const response = await axios.get(API_URL);
// console.log(response.data);

export const calculateAge = (dob) => {
  const [day, month, year] = dob.split('/'); // Split the DOB string
  const birthDate = new Date(year, parseInt(month) - 1, parseInt(day)); // Create a date object
  const today = new Date();
  
  // Check if the birth date is valid
  if (isNaN(birthDate.getTime())) {
    return 'Invalid date'; // Handle invalid date
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age; // Return age as a number
};

export const getUsers = async () => {
  try {
    const response = await fetch('/users.json');
    const data = await response.json();
    
    // Calculate ages and update users
    const usersWithAge = data.users.map(user => {
      const age = user.age === 'calculate' ? calculateAge(user.DOB) : user.age;
      return {
        ...user,
        age: age
      };
    });

    // Update users.json dynamically
    await updateUsersJson(usersWithAge); // Ensure this function is implemented

    return usersWithAge;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Function to update users.json
const updateUsersJson = async (users) => {
  try {
    await fetch('/update-users', { // This endpoint should be implemented on your server
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    });
  } catch (error) {
    console.error('Error updating users.json:', error);
  }
};
