import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplications, selectApplicationData, selectApplicationError, selectApplicationStatus } from '../feature/application/applicationSlice'
import { Link } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import ApplicationCard from '../components/Application/ApplicationCard';
import { FaBriefcase } from 'react-icons/fa';
import { selectUser } from '../feature/auth/authSlice';

const Application = () => {

  const applications = useSelector(selectApplicationData);
  const applicationStatus = useSelector(selectApplicationStatus);
  const applicationError = useSelector(selectApplicationError);
  // Get current user
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      
      if(applicationStatus === 'idle') dispatch(fetchApplications());

    } catch (error) {
      console.log(error);
    }
  }, [dispatch, applicationStatus]);

  // console.log('Application - ', applications[0]);
  const isEmployer = user?.user?.role === 'employer';

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="max-w-8xl mx-auto px-6 md:px-25 mt-10">
        <div className='w-full border border-gray-300 shadow-lg rounded-md p-4'>
          <div className='flex md:flex-row flex-col space-y-3 justify-between items-start'>
            {
              isEmployer ? (
                <>
                  <div className='space-y-2'>
                    <h1 className="text-2xl font-bold text-gray-900">Candidate Applied Jobs</h1>
                    <p className="text-gray-600">Track the status and make any update on candidate applied job.</p>
                  </div>
                  <div className='flex justify-end items-center'>
                    <Link
                      className='flex px-3 rounded-sm hover:rounded-full hover:bg-cyan-600 py-1.5 shadow-sm bg-cyan-500 text-white transition-all ease-in-out duration-300'
                      to={'/'}>
                      Browse Job
                      <IoAdd size={24}/>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className='space-y-2'>
                    <h1 className="text-2xl font-bold text-gray-900">My Applied Jobs</h1>
                    <p className="text-gray-600">Track the status of your job applications</p>
                  </div>
                  <div className='flex justify-end items-center'>
                    <Link
                      className='flex px-3 rounded-sm hover:rounded-full hover:bg-cyan-600 py-1.5 shadow-sm bg-cyan-500 text-white transition-all ease-in-out duration-300'
                      to={'/'}>
                      Apply Job
                      <IoAdd size={24}/>
                    </Link>
                  </div>
                </>
              )
            }
            
          </div>

          <div className="space-y-4 my-6">
            {
              applicationStatus === 'loading' && (
                <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
            }
            {
              applicationStatus === 'failed' && (
                <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                  <p className="text-white">Failed to load applications, {applicationError}</p>
                </div>
              )
            }
            {
              applications?.length > 0 && applicationStatus === 'succeeded' ? (
                applications?.map((app) => (
                  <ApplicationCard key={app.id} application={app}/>
                ))
              ) : isEmployer ? (
                  <div className="flex flex-col items-center justify-center my-12 text-center bg-gray-50 border border-gray-200 rounded-xl p-10 shadow-sm">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 text-blue-600 rounded-full">
                      <FaBriefcase size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      No Application found
                    </h2>
    
                    <p className="text-gray-500 mb-6 max-w-sm">
                      There are currently no candidate apply on job available.  
                    </p>
                    <Link
                      to="/"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                    >
                      Browse More
                    </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-12 text-center bg-gray-50 border border-gray-200 rounded-xl p-10 shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 text-blue-600 rounded-full">
                    <FaBriefcase size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Application found
                  </h2>
  
                  <p className="text-gray-500 mb-6 max-w-sm">
                    There are currently no apply job available.  
                    Start by apply your application to a job now.
                  </p>
                  <Link
                    to="/"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    Browse More
                  </Link>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Application