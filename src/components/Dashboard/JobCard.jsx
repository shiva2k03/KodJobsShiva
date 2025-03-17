import React from 'react';

// Function to generate a random Tailwind CSS color class
const getRandomColorClass = () => {
  const colors = [
    'bg-red-300', 'bg-green-300', 'bg-blue-300', 'bg-yellow-300', 
    'bg-purple-300', 'bg-pink-300', 'bg-indigo-300', 'bg-teal-300',
    'bg-orange-300', 'bg-gray-300'
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const JobCard = ({ job }) => {
  // Jooble API response properties
  const {
    title,
    company,
    location,
    salary, // Assuming salary is in the format "₹585,187 per annum"
    type,
    updated,
    link,
    snippet,
    skills // Assuming skills are now part of the job object
  } = job;

  // Format salary to "X LPA"
  const formatSalary = (salary) => {
    // Extract the numeric part from the salary string
    const numericSalary = parseFloat(salary.replace(/[₹, per annum]/g, '').trim());
    const lpa = (numericSalary / 100000).toFixed(1); // Convert to LPA and format to one decimal place
    return `${lpa} LPA`;
  };

  // Calculate days since posting (if updated is available)
  const getPostedDays = () => {
    if (!updated) return 'Recently';
    
    const updatedDate = new Date(updated);
    const today = new Date();
    const diffTime = Math.abs(today - updatedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const postedDays = getPostedDays();
  const companyName = company || 'Unknown Company';

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border-yellow-400 border-t-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center`}>
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-200 text-sm">{companyName}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>📍</span> {location || 'Location not specified'}
            </p>
          </div>
        </div>
        <div className="font-bold text-green-500 text-base">
          {formatSalary(salary)}
        </div>
      </div>

      <div className="job-title">
        <h2 className="text-lg font-semibold text-white">{title || 'Position not specified'}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <span 
              key={index} 
              className={`${getRandomColorClass()} text-black px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">No skills specified</span>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex flex-col gap-1">
          <span>Posted: {postedDays}</span>
          <span>{type || 'Full-time'}</span>
        </div>
        <div className="flex items-center text-yellow-400">
          <span>Not Applied</span>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default JobCard; 