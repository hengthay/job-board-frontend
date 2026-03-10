import React, { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Image from "../assets/1.jpg";
import { CiLocationOn } from "react-icons/ci";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  selectJobs,
  selectJobStatus,
} from "../feature/jobs/jobSlice";
import { API_BASE_URL } from "../components/AxiosInstance";
import { fetchJobTypes, selectJobTypes, selectJobTypeStatus } from "../feature/jobtype/jobTypeSlice";
import { fetchJobCategories, selectJobCategories, selectJobCategoriesStatus } from "../feature/jobcategories/jobCategoriesSlice";

const Home = () => {
  const jobs = useSelector(selectJobs);
  const jobStatus = useSelector(selectJobStatus);
  const jobTypes = useSelector(selectJobTypes);
  const jobTypeStatus = useSelector(selectJobTypeStatus);
  const jobCategories = useSelector(selectJobCategories);
  const jobCategoryStatus = useSelector(selectJobCategoriesStatus);
  const dispatch = useDispatch();
  const [searchByTitle, setSearchByTitle] = useState("");
  const [searchByCity, setSearchByCity] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  useEffect(() => {
    try {
      if (jobStatus === "idle") dispatch(fetchJobs());

      if (jobTypeStatus === 'idle') dispatch(fetchJobTypes());

      if (jobCategoryStatus === 'idle') dispatch(fetchJobCategories());
    } catch (error) {
      console.log(error);
    }
  }, [jobStatus, jobTypeStatus, jobCategoryStatus, dispatch]);

  // Filtered job
  const filteredJob = useMemo(() => {
    // Get query1 and query2
    const q1 = searchByTitle.trim().toLowerCase();
    const q2 = searchByCity.trim().toLowerCase();
    // storing jobs in lists
    let lists = Array.isArray(jobs) ? jobs : [];
    // check if q1 exist then we performance filter by it title
    if(q1.length > 0) {
      lists = lists.filter((list) => {
        const t = (list.title || "").toLowerCase();
        return t.includes(q1);
      })
    };
    // check if q2 exist then we performance filter by location
    if(q2.length > 0) {
      lists = lists.filter((list) => {
        const t = (list.location || "").toLowerCase();
        return t.includes(q2);
      })
    };
    // filtered by categories
    if(selectedCategory) {
      lists = lists.filter((list) => list.job_category?.name === selectedCategory)
    }
    // filtered by job types
    if(selectedJobType) {
      lists = lists.filter((list) => list.job_type.name === selectedJobType);
    }

    // check if sort equal to newest or lowest
    if(sort === "newest") {
      lists = [...lists].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === "oldest") {
      lists = [...lists].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    return lists;
  }, [searchByCity, searchByTitle, sort, jobs, selectedCategory, selectedJobType]);

  const handleClearSearch = () => {
    setSearchByCity("");
    setSearchByTitle("");
    setSort("newest");
    setSelectedCategory("");
    setSelectedJobType("")
  }
  // console.log('jobcategories - ', jobCategories);
  // console.log('jobtype - ', jobTypes);
  // console.log('selectedCategory', selectedCategory);
  // console.log('selectedJobType', selectedJobType);
  // console.log("jobs data -", jobs);
  return (
    <div className="">
      <div className="max-w-8xl max-sm:w-100 absolute left-0 right-0 md:top-30 top-25 md:px-25 sm:px-10 px-5">
        {/* Header Text */}
        <div className="w-full space-y-3">
          <h2 className="lg:text-4xl md:text-3xl text-2xl md:max-w-lg max-w-xs font-semibold">
            Find top jobs in our website more easily.
          </h2>
          <p className="md:text-base text-sm text-gray-600 md:max-w-sm max-w-xs">
            Hiring? Connect with over 11,000 works are available at here for
            full-time, part-time, or freelancer.
          </p>
        </div>
        {/* Search Section */}
        <div className="md:mt-15 mt-20 h-auto bg-white shadow-lg md:max-w-125 w-full rounded-2xl">
          <div className="w-full flex flex-col items-center space-y-2 p-4">
            <div className="w-full flex gap-4">
              <div className="w-full flex gap-2">
                <input
                  type="search"
                  name="search"
                  value={searchByTitle}
                  onChange={(e) => setSearchByTitle(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded-md md:w-50 w-full"
                  placeholder="Search by title"
                />
                <span className="w-0.5 bg-gray-300 h-10 flex justify-center items-center"></span>
                <input
                  type="search"
                  name="search"
                  value={searchByCity}
                  onChange={(e) => setSearchByCity(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded-md md:w-50 w-full"
                  placeholder="Search by city"
                />
              </div>

              <div className="bg-cyan-400 hover:bg-cyan-500 flex justify-center items-center px-2 py-1 rounded-md cursor-pointer">
                <CiSearch size={24} className="text-white font-semibold" />
              </div>
            </div>
            <div className="w-full flex items-center flex-wrap gap-3 mt-3">
              <select
                name="category"
                id="category"
                className="border border-gray-300 py-1.5 px-2 rounded-md shadow"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" defaultChecked>
                  Category
                </option>
                {
                  jobCategories.map((jobCategory) => (
                    <option key={jobCategory.id}>{jobCategory?.name}</option>
                  ))
                }
              </select>
              <select
                name="category"
                id="category"
                className="border border-gray-300 py-1.5 px-2 rounded-md shadow"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                <option value="" defaultChecked>
                  Job type
                </option>
                {
                  jobTypes.length > 0 && (
                    jobTypes.map((jobType) => (
                      <option key={jobType.id}>{jobType.name}</option>
                    ))
                  )
                }
              </select>
              <button 
                onClick={handleClearSearch}
                className="bg-black text-white px-3 py-1.5 rounded-md border hover:bg-transparent hover:border-black hover:text-black cursor-pointer transition-colors ease-in-out duration-300"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto mt-20 px-2 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Showing Result (912)</p>
          <div className="flex gap-x-1.5 items-center">
            <label htmlFor="sort">Sort:</label>
            <select 
              name="sort" 
              id="sort"
              className="w-full sm:w-44 py-2 px-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-gray-200"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest" defaultChecked>
                Newest
              </option>
              <option value="oldest">
                Oldest
              </option>
            </select>
          </div>
        </div>
        <div className="my-4 space-y-4">
          {jobStatus === "idle" && (
            <div className="py-1.5">
              <p className="w-10 h-10 rounded-full border border-t-transparent animate-spin"></p>
              <p className="text-white">Loading</p>
            </div>
          )}
          {jobStatus === "failed" && (
            <div className="bg-red-400 py-1.5 px-3 rounded-md">
              <p className="text-white">Failed to load jobs data!</p>
            </div>
          )}
          {
            jobs.length > 0 && filteredJob.length > 0 &&
            filteredJob.map((job) => (
              <div className="w-full flex flex-col space-y-4 bg-white/80 border border-gray-300 shadow-lg rounded-xl p-4 sm:p-6 transition-all hover:shadow-xl" key={job.id}>
                {/* Top Section: Logo and Header Info */}
                <div className="w-full flex items-start gap-4">
                  <div className="shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${job?.company?.logo_path}`}
                      alt={job?.company?.name}
                      className="object-cover w-16 h-16 md:w-24 md:h-24 rounded-xl border border-gray-100"
                    />
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <h2 className="md:text-xl text-lg font-bold tracking-tight text-gray-900 truncate">
                      {job?.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm md:text-base text-gray-600">
                      <p className="font-semibold text-gray-800">
                        {job?.company?.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <CiLocationOn size={18} className="text-gray-400" />
                        <span>Remote</span>
                      </div>
                      <p className="text-cyan-600 font-medium">
                        120 Applications
                      </p>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Description & Tags */}
                <div className="flex flex-col">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">
                    {job?.description}
                  </p>

                  <div className="w-full my-4 flex flex-wrap items-center gap-2">
                    {job?.requirements.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs md:text-sm px-3 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}

                  </div>
                </div>

                {/* Bottom Section: Salary and Action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <RiMoneyDollarCircleLine
                      size={24}
                      className="text-cyan-500"
                    />
                    <div className="flex items-center gap-1 font-semibold">
                      <span>{job?.salary_min}</span>
                      <span className="text-gray-400 font-normal"> - </span>
                      <span>{job?.salary_max}</span>
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        / month
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Status:</span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${job?.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {job?.status === 'open' ? 'Open' : 'Close'}
                      </span>
                    </div>
                    <button className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-50 active:scale-95 cursor-pointer text-nowrap text-sm">
                      View Details
                    </button>
                    <button className="bg-cyan-400 text-white px-5 py-2 rounded-lg font-semibold transition-all hover:bg-cyan-500 active:scale-95 cursor-pointer shadow-sm text-nowrap">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
          {
            filteredJob.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  No jobs found 😕
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Try another keyword or change the filter.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                  Clear search
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
