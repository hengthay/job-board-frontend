import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { fetchPostingJobs, selectJobError, selectJobPostingData, selectJobPostingStatus } from '../feature/jobs/jobSlice';
import { useEffect } from 'react';
import JobCard from '../components/Job/JobCard';
import { IoAdd } from "react-icons/io5";
import { FaBriefcase } from 'react-icons/fa';
import { resetCompanyStatus } from '../feature/company/companySlice';

const Job = () => {

  const dispatch = useDispatch();
  const jobs = useSelector(selectJobPostingData);
  const jobPostingStatus = useSelector(selectJobPostingStatus);
  const jobPostingError = useSelector(selectJobError);
  
  useEffect(() => {
    try {
      
      if (jobPostingStatus === 'idle') dispatch(fetchPostingJobs());

      dispatch(resetCompanyStatus());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, jobPostingStatus])

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="max-w-8xl mx-auto px-6 md:px-25 mt-10">
        <div className='w-full border border-gray-300 shadow-lg rounded-md p-4'>
          <div className='flex justify-between items-start'>
            <div className='space-y-2'>
              <h3 className="font-bold md:text-3xl text-2xl text-gray-900">
                My Posting Jobs List
              </h3>
              <p className="text-gray-500 mt-2">Manage and review the performance of your job listings.</p>
            </div>
            <Link
              className='px-1.5 py-1 border hover:border-gray-300 transition-colors ease-out duration-300'
              to={'/jobs/create'}>
              <IoAdd size={24}/>
            </Link>
          </div>
          {
            jobPostingStatus === 'loading' && (
              <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
              </div>
            )
          }
          {
            jobPostingStatus === 'failed' && (
              <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                <p className="text-white">Failed to load jobs data, {jobPostingError}</p>
              </div>
            )
          }
          {
            jobs.length > 0 && jobPostingStatus === 'succeeded' ? (
              <div className="w-full mt-10 space-y-4 pb-20">
                {
                  jobs.map((job) => (
                    <JobCard job={job} key={job.id}/>
                  ))
                }
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-12 text-center bg-gray-50 border border-gray-200 rounded-xl p-10 shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 text-blue-600 rounded-full">
                  <FaBriefcase size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No Jobs Found
                </h2>

                <p className="text-gray-500 mb-6 max-w-sm">
                  There are currently no job postings available.  
                  Start by posting a new job for candidates to apply.
                </p>
                <Link
                  to="/jobs/create"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                  Post a Job
                </Link>

              </div>
            )
          }
          
        </div>
      </div>
    </div>
  );
};

export default Job