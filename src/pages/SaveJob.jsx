import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSavedJob, selectSaveJobData, selectSaveJobError, selectSaveJobStatus } from '../feature/saveJob/saveJobSlice'
import { Link } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';
import SaveJobCard from '../components/SaveJob/SaveJobCard';
import { FaBriefcase } from 'react-icons/fa';

const SaveJob = () => {

  const saveJobs = useSelector(selectSaveJobData);
  const saveJobStatus = useSelector(selectSaveJobStatus);
  const saveJobError = useSelector(selectSaveJobError);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if(saveJobStatus === 'idle') dispatch(fetchSavedJob());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, saveJobStatus])

  // console.log('Favorite job - ', saveJobs);
  
  return (
    <div className='w-full'>
      <div className='max-w-7xl mx-auto px-4 md:px-25 mt-10'>
        <div className='w-full border border-gray-300 shadow-lg rounded-md p-4'>
          <div className='flex md:flex-row flex-col justify-between items-start space-y-3'>
            <div className='space-y-2'>
              <h2 className="font-bold md:text-3xl text-2xl text-gray-900">Your Favorite Jobs</h2>
              <p className="text-gray-500 mt-2">Manage and review your favorite jobs list.</p>
            </div>
            <Link
              className='flex items-center px-3 rounded-sm hover:rounded-full hover:bg-cyan-600 py-1.5 shadow-sm bg-cyan-500 text-white transition-all ease-in-out duration-300'
              to={'/'}>
              <IoAdd size={24}/>
              Add More
            </Link>
          </div>
          <div className='space-y-4 my-6'>
            {
              saveJobStatus === 'loading' && (
                <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
            }
            {
              saveJobStatus === 'failed' && (
                <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                  <p className="text-white">Failed to load favorite jobs, {saveJobError}</p>
                </div>
              )
            }
            {
              saveJobs.length > 0 && saveJobStatus === 'succeeded' ? (
                saveJobs.map((save) => (
                  <SaveJobCard key={save?.id} save={save}/>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center my-12 text-center bg-gray-50 border border-gray-200 rounded-xl p-10 shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 text-blue-600 rounded-full">
                    <FaBriefcase size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Favorite Jobs Found
                  </h2>
  
                  <p className="text-gray-500 mb-6 max-w-sm">
                    There are currently no favorite job available.  
                    Start by add new favorite job.
                  </p>
                  <Link
                    to="/"
                    title='Add favorite job'
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    Add More Favorite Job
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

export default SaveJob