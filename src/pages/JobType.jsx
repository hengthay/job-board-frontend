import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useOutletContext } from 'react-router-dom'
import { fetchJobTypes, selectJobTypeError, selectJobTypes, selectJobTypeStatus } from '../feature/jobtype/jobTypeSlice';
import JobTypeCard from '../components/Admin/JobType/JobTypeCard';

const JobType = () => {

  const { sideBarOpen } = useOutletContext();
  const jobTypes = useSelector(selectJobTypes);
  const jobTypeStatus = useSelector(selectJobTypeStatus);
  const jobTypeError = useSelector(selectJobTypeError);

  // Action
  const dispatch = useDispatch();

  // console.log(jobTypes);

  useEffect(() => {
    try {
     
      if(jobTypeStatus === 'idle') dispatch(fetchJobTypes());

    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className={`w-full transition-all ease-in-out duration-300 ${sideBarOpen ? "pl-70" : 'pl-0'}`}>
      <div className={`${sideBarOpen ? 'md:pr-4' : 'md:px-8 px-3'}`}>
        <div className='w-full mx-auto border border-gray-300 shadow-sm rounded-sm'>
          <div className='md:p-6 p-4 space-y-3'>
            <div className='flex md:flex-row flex-col justify-between items-start'>
              <div className='space-y-2'>
                <h1 className='md:text-3xl text-2xl font-medium tracking-wide'>Job-Type</h1>
                <p className='md:text-base text-sm text-gray-500 tracking-wide leading-relaxed'>Tracking overview of all job-types.</p>
              </div>
              <Link 
                to={'/admin/job-types/create'}
                className='text-white bg-cyan-500 px-2 py-1.5 rounded-md hover:bg-cyan-600 transition-colors ease-in-out duration-300'
                >
                Add New
              </Link>
            </div>

            {/* Job-type card */}
            <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-8 gap-4'>
              {
                jobTypes.length > 0 && (
                  jobTypes.map((jobType) => (
                    <JobTypeCard key={jobType.id} jobType={jobType}/>
                  ))
                )
              }
            </div>
            {
              jobTypeStatus === 'loading' && (
                <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
            }
            {
              jobTypeStatus === 'failed' && (
                <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                  <p className="text-white">Failed to load jobs data, {jobTypeError}</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobType