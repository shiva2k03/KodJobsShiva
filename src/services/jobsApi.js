import axios from 'axios';

const API_KEY = 'd29abf8a-97e2-48aa-bde3-a252c91cc173';
const API_URL = 'https://jooble.org/api/';

// Function to generate random skills
const getRandomSkills = () => {
  const allSkills = [
    'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 
    'C#', '.NET', 'PHP', 'Ruby', 'SQL', 'NoSQL', 'MongoDB', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Git', 'HTML', 'CSS', 'SASS',
    'TypeScript', 'Redux', 'REST API', 'GraphQL', 'Agile', 'Scrum'
  ];
  
  // Randomly select 3 skills
  const randomSkills = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * allSkills.length);
    randomSkills.push(allSkills[randomIndex]);
  }
  return randomSkills;
};

// Function to generate a random salary
const getRandomSalary = () => {
  const minSalary = 300000; // Minimum salary
  const maxSalary = 1200000; // Maximum salary
  const randomSalary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
  return `₹${randomSalary.toLocaleString()} per annum`;
};

export const fetchJobs = async (keywords = 'developer', location = '') => {
  try {
    const response = await axios.post(
      `${API_URL}${API_KEY}`, 
      { 
        keywords: keywords,
        location: location 
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Assuming the API returns an object with a 'jobs' array
    const jobs = response.data.jobs || [];

    // Map through jobs to ensure skills and salary are included
    const formattedJobs = jobs.map(job => ({
      ...job,
      skills: getRandomSkills(), // Assign random skills
      salary: getRandomSalary() // Assign random salary
    }));

    return formattedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export default axios.create({
  baseURL: 'https://api.jobs.com', // Replace with the actual API base URL
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
}); 