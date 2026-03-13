import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchPostingJobs, selectJobPostingData, selectJobPostingStatus } from '../feature/jobs/jobSlice';
import { useEffect } from 'react';
import JobCard from '../components/Job/JobCard';

const Job = () => {

  const dispatch = useDispatch();
  const jobs = useSelector(selectJobPostingData);
  const jobPostingStatus = useSelector(selectJobPostingStatus);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      
      if (jobPostingStatus === 'idle') dispatch(fetchPostingJobs());

    } catch (error) {
      console.log(error);
    }
  }, [dispatch, jobPostingStatus])

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="max-w-8xl mx-auto px-6 md:px-25 mt-10">
        <div className='w-full border border-gray-300 shadow-lg rounded-md p-4'>
          <h3 className="font-bold md:text-3xl text-2xl text-gray-900">
            My Posting Jobs List
          </h3>
          <p className="text-gray-500 mt-2">Manage and review the performance of your job listings.</p>
          <div className="w-full mt-10 space-y-4 pb-20">
            {
              jobs.map((job) => (
                <JobCard job={job} key={job.id}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job