import React, { useEffect } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { fetchJobCategories, selectJobCategories, selectJobCategoriesError, selectJobCategoriesStatus } from "../feature/jobcategories/jobCategoriesSlice";
import JobCategoryCard from "../components/Admin/JobCategory/JobCategoryCard";

const JobCategory = () => {

  const { sideBarOpen } = useOutletContext();
  // Action
  const dispatch = useDispatch();
  // Data from redux
  const jobCategories = useSelector(selectJobCategories);
  const jobCategoryStatus = useSelector(selectJobCategoriesStatus);
  const jobCategoryError = useSelector(selectJobCategoriesError);
  
  useEffect(() => {
    try {
      
      if(jobCategoryStatus === 'idle') dispatch(fetchJobCategories());

    } catch (error) {
      console.log(error);
    }
  }, [jobCategoryStatus, dispatch]);

  console.log('job-categories - ', jobCategories);
  return (
    <div
      className={`w-full transition-all ease-in-out duration-300 ${sideBarOpen ? "pl-70" : "pl-0"}`}
    >
      <div className={`${sideBarOpen ? "md:pr-4" : "md:px-8 px-3"}`}>
        <div className="w-full mx-auto border border-gray-300 shadow-sm rounded-sm">
          <div className="md:p-6 p-4 space-y-3">
            <div className="flex md:flex-row flex-col justify-between items-start">
              <div className="space-y-2">
                <h1 className="md:text-3xl text-2xl font-medium tracking-wide">
                  Job-Categories
                </h1>
                <p className="md:text-base text-sm text-gray-500 tracking-wide leading-relaxed">
                  Tracking overview of all job-categories.
                </p>
              </div>
              <Link
                to={"/admin/job-categories/create"}
                className="text-white bg-cyan-500 px-2 py-1.5 rounded-md hover:bg-cyan-600 transition-colors ease-in-out duration-300"
              >
                Add New
              </Link>
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-8 gap-4">
              {
                jobCategories.length > 0 && (
                  jobCategories.map((jobCategory) => (
                    <JobCategoryCard jobCategory={jobCategory} key={jobCategory.id}/>
                  ))
                )
              }
            </div>
            {
              jobCategoryStatus === 'loading' && (
                <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
            }
            {
              jobCategoryStatus === 'failed' && (
                <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                  <p className="text-white">Failed to load jobs data, {jobCategoryError}</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategory;
