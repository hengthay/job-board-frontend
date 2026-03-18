import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  selectJobs,
  selectJobStatus,
} from "../feature/jobs/jobSlice";
import {
  fetchJobTypes,
  selectJobTypes,
  selectJobTypeStatus,
} from "../feature/jobtype/jobTypeSlice";
import {
  fetchJobCategories,
  selectJobCategories,
  selectJobCategoriesStatus,
} from "../feature/jobcategories/jobCategoriesSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const jobs = useSelector(selectJobs);
  const jobStatus = useSelector(selectJobStatus);
  const jobTypes = useSelector(selectJobTypes);
  const jobTypeStatus = useSelector(selectJobTypeStatus);
  const jobCategories = useSelector(selectJobCategories);
  const jobCategoryStatus = useSelector(selectJobCategoriesStatus);
  const dispatch = useDispatch();
  const [searchByTitle, setSearchByTitle] = useState("");
  const [searchByCompanyName, setSearchByCompanyName] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  useEffect(() => {
    try {
      if (jobStatus === "idle") dispatch(fetchJobs());

      if (jobTypeStatus === "idle") dispatch(fetchJobTypes());

      if (jobCategoryStatus === "idle") dispatch(fetchJobCategories());
    } catch (error) {
      console.log(error);
    }
  }, [jobStatus, jobTypeStatus, jobCategoryStatus, dispatch]);

  // Filtered job
  const filteredJob = useMemo(() => {
    // Get query1 and query2
    const q1 = searchByTitle.trim().toLowerCase();
    const q2 = searchByCompanyName.trim().toLowerCase();
    // storing jobs in lists
    let lists = Array.isArray(jobs) ? jobs : [];
    // check if q1 exist then we performance filter by it title
    if (q1.length > 0) {
      lists = lists.filter((list) => {
        const t = (list.title || "").toLowerCase();
        return t.includes(q1);
      });
    }
    // check if q2 exist then we performance filter by company name
    if (q2.length > 0) {
      lists = lists.filter((list) => {
        const companyName = list?.company?.name;
        // console.log(companyName);
        const t = (companyName || "").toLowerCase();
        return t.includes(q2);
      });
    }
    // filtered by categories
    if (selectedCategory) {
      lists = lists.filter(
        (list) => list.job_category?.name === selectedCategory,
      );
    }
    // filtered by job types
    if (selectedJobType) {
      lists = lists.filter((list) => list.job_type.name === selectedJobType);
    }

    // check if sort equal to newest or lowest
    if (sort === "newest") {
      lists = [...lists].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    } else if (sort === "oldest") {
      lists = [...lists].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    }

    return lists;
  }, [
    searchByCompanyName,
    searchByTitle,
    sort,
    jobs,
    selectedCategory,
    selectedJobType,
  ]);

  const handleClearSearch = () => {
    setSearchByCompanyName("");
    setSearchByTitle("");
    setSort("newest");
    setSelectedCategory("");
    setSelectedJobType("");
  };
  // console.log('jobcategories - ', jobCategories);
  // console.log('jobtype - ', jobTypes);
  // console.log('selectedCategory', selectedCategory);
  // console.log('selectedJobType', selectedJobType);
  // console.log("jobs data -", jobs);
  return (
    <div className="w-full">
      <div className="relative w-full max-sm:w-100 md:py-10 md:px-25 bg-cyan-100">
        {/* Header Text */}
        <div className="max-w-7xl space-y-3 min-h-50 max-sm:p-4">
          <h2 className="lg:text-4xl md:text-3xl text-2xl md:max-w-lg max-w-xs font-semibold">
            Find top jobs in our website more easily.
          </h2>
          <p className="md:text-base text-sm text-gray-600 md:max-w-sm max-w-xs">
            Hiring? Connect with over 11,000 works are available at here for
            full-time, part-time, or freelancer.
          </p>
        </div>
        {/* Floating Search Section */}
        <div className="absolute md:-bottom-20 -bottom-48 w-[calc(100%-2rem)] max-w-4xl bg-white shadow-xl rounded-2xl sm:mx-0 mx-2.5 p-4 md:p-6 z-10">
          <div className="flex flex-col gap-4">
            {/* Input Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-1 items-center gap-2 w-full border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={searchByTitle}
                  onChange={(e) => setSearchByTitle(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Search by title"
                />
                <div className="hidden md:block w-px h-6 bg-gray-300"></div>
                <input
                  type="text"
                  value={searchByCompanyName}
                  onChange={(e) => setSearchByCompanyName(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Search by Company name"
                />
              </div>
              <button className="w-full md:w-auto bg-cyan-400 hover:bg-cyan-500 text-white p-3 rounded-lg transition-colors flex justify-center shadow-md active:scale-95">
                <CiSearch size={24} />
              </button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="flex-1 min-w-30 border border-gray-200 py-2 px-3 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-cyan-100"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Category</option>
                {jobCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="flex-1 min-w-30 border border-gray-200 py-2 px-3 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-cyan-100"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                <option value="">Job type</option>
                {jobTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleClearSearch}
                className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors px-2 ml-auto"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto mt-20 md:py-10 md:px-25 py-40 px-4 space-y-4">
        <div className="max-w-8xl flex justify-between items-center">
          <p className="text-base font-semibold">Showing Result ({jobs.length})</p>
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
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        <div className="my-4 space-y-4">
          {jobStatus === "loading" && (
            <div className="flex items-center mt-6 gap-x-2 py-1.5">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
            </div>
          )}
          {jobStatus === "failed" && (
            <div className="bg-red-400 py-1.5 px-3 rounded-md">
              <p className="text-white">Failed to load jobs data!</p>
            </div>
          )}
          {jobs.length > 0 &&
            filteredJob.length > 0 &&
            filteredJob.map((job) => (
              <div
                className="w-full flex flex-col space-y-4 bg-white/80 border border-gray-300 shadow-lg rounded-xl p-4 sm:p-6 transition-all hover:shadow-xl"
                key={job.id}
              >
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
                    <p className="text-sm mt-1">
                      {job.vacancies > 0 ? (
                        <span className="text-green-600 font-medium">
                          🟢 {job.vacancies} positions available
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          🔴 Position filled
                        </span>
                      )}
                    </p>
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
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${job?.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {job?.status === "open" ? "Open" : "Close"}
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job?.id}/view`}
                      className="flex-1 text-center sm:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-50 active:scale-95 cursor-pointer text-nowrap text-sm">
                      View Details
                    </Link>
                    <button className="bg-cyan-400 text-white px-5 py-2 rounded-lg font-semibold transition-all hover:bg-cyan-500 active:scale-95 cursor-pointer shadow-sm text-nowrap">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {filteredJob.length === 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
