import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { fetchJobs } from '../../services/jobsApi';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keywords: 'developer',
    location: 'India'
  });
  const [searchInput, setSearchInput] = useState({
    keywords: 'developer',
    location: 'India'
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchJobs(searchParams.keywords, searchParams.location);
        
        // Set the fetched jobs
        setJobs(data);
        setFilteredJobs(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError(`Failed to load jobs: ${err.message || 'Unknown error'}`);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({...searchInput});
    filterJobs(searchInput);
  };

  const filterJobs = (search) => {
    if (!search.keywords && !search.location) {
      setFilteredJobs(jobs);
      return;
    }

    const keywordsLower = search.keywords.toLowerCase();
    const locationLower = search.location.toLowerCase();

    const filtered = jobs.filter(job => {
      const matchesKeywords = !keywordsLower || 
        (job.title && job.title.toLowerCase().includes(keywordsLower)) ||
        (job.company && job.company.toLowerCase().includes(keywordsLower)) ||
        (job.snippet && job.snippet.toLowerCase().includes(keywordsLower));
      
      const matchesLocation = !locationLower || 
        (job.location && job.location.toLowerCase().includes(locationLower));
      
      return matchesKeywords && matchesLocation;
    });

    setFilteredJobs(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedInput = {
      ...searchInput,
      [name]: value
    };
    
    setSearchInput(updatedInput);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] bg-gray-900">
        <div className="text-xl text-white">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh] flex-col bg-gray-900 p-4">
        <div className="text-xl text-red-500 mb-4">Error</div>
        <div className="text-white">{error}</div>
        <button 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Dashboard</h1>
            <p className="text-gray-300">Find your next opportunity</p>
          </div>
          {/* Profile Button */}
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="text-white text-lg">
              Profile
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-2">
                  <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-green-500 transition duration-200">Profile</Link>
                  <button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-500 transition duration-200" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-300 mb-1">Keywords</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={searchInput.keywords}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Job title, skills, or company"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={searchInput.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, state, or country"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="flex justify-center items-center h-[30vh] flex-col bg-gray-800 rounded-lg p-8 border border-gray-700">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            <div className="text-xl text-white mb-2">No jobs found</div>
            <p className="text-gray-400 text-center">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-400">
              Found {filteredJobs.length} jobs matching your search
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <JobCard key={job.id || index} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 