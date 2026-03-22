import React, { useEffect } from 'react';
import { 
  CiLocationOn, 
  CiCalendar, 
  CiBadgeDollar, 
  CiUser, 
  CiBookmark,
  CiClock1
} from "react-icons/ci";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchIndividualJob, selectJobDetail, selectJobStausDetail } from '../../feature/jobs/jobSlice';
import formatDate from '../Helper/formateDate';
import Swal from 'sweetalert2';
import { resetSaveJobStatus, saveFavoriteJob } from '../../feature/saveJob/saveJobSlice';

const JobDetail = () => {
  const jobDetail = useSelector(selectJobDetail);
  const jobStatusDetail = useSelector(selectJobStausDetail);
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log('job id - ', id);

  useEffect(() => {
    if(id) dispatch(fetchIndividualJob(id));
  }, [id]);

  // Add to favorite job
  const addToFavoriteJob = async (id) => {
    try {
      const result = await dispatch(saveFavoriteJob(id)).unwrap();

      // Reset save job
      dispatch(resetSaveJobStatus());

      // If job already exists should display exist info to user.
      if (result.message === "Job is already in your favorites!") {
        Swal.fire({
          title: "Info",
          text: result.message,
          icon: "info",
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Success",
          text: "Job added to favorites successfully!",
          icon: "success",
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Job could not be add to favorite. ${error.message}`,
        icon: "error",
        timer: 1500,
      });
    }
  };
  
  console.log('job detail - ', jobDetail);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="w-full bg-white border-b border-gray-200 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-25">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600">
                <img 
                  src={`${import.meta.env.VITE_API_URL}/storage/${jobDetail?.company?.logo_path}`}
                  alt={jobDetail?.company?.name}
                  className="w-full h-full object-contain"
                  />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{jobDetail?.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                  <span className="text-cyan-600">{jobDetail?.company?.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><CiLocationOn /> {jobDetail?.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type='button'
                onClick={() => addToFavoriteJob(jobDetail?.id)}
                className="flex-1 md:flex-none p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <CiBookmark size={24} className="mx-auto" />
              </button>
              <button className="flex-4 md:flex-none bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-100">
                Apply Now
              </button>
            </div>
          </div>
        </div>
        {
          jobStatusDetail === 'loading' && (<div className="flex items-center gap-x-2 py-1.5 max-w-7xl mx-auto px-6 md:px-25 mt-8">
            <p className="w-8 h-8 rounded-full border border-t-transparent animate-spin"></p>
            <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
          </div>
          )
        }
        {jobStatusDetail === "failed" && (
          <div className="bg-red-400 py-1.5 px-3 rounded-md mt-8">
            <p className="text-white">Failed to load jobs detail!</p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-25 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {jobDetail?.description}
              </p>
            </section>

            {/* Requirements */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {jobDetail?.requirements?.map((req, index) => (
                  <span key={index} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-100 text-sm font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobDetail?.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-10 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600"><CiClock1 size={24}/></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Job Type</p>
                    <p className="text-sm font-semibold text-gray-700">{jobDetail?.job_type?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600"><CiBadgeDollar size={24}/></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Offered Salary</p>
                    <p className="text-sm font-semibold text-gray-700">${jobDetail?.salary_min} - ${jobDetail?.salary_max}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600"><CiUser size={24}/></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Vacancies</p>
                    <p className="text-sm font-semibold text-gray-700">{jobDetail?.vacancies} Candidates</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600"><CiCalendar size={24}/></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Deadline</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(jobDetail?.deadline)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600"><HiOutlineOfficeBuilding size={24}/></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Work Mode</p>
                    <p className="text-sm font-semibold text-gray-700">{jobDetail?.work_mode}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className={`text-center py-2 rounded-lg font-bold uppercase text-xs ${jobDetail?.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Status: {jobDetail?.status}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetail;