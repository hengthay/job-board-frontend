import React, { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchJobCategories, selectJobCategories, selectJobCategoriesStatus } from '../../feature/jobcategories/jobCategoriesSlice';
import { fetchJobTypes, selectJobTypes, selectJobTypeStatus } from '../../feature/jobtype/jobTypeSlice';
import Swal from 'sweetalert2';
import { fetchIndividualJob, selectJobDetail, updateJob } from '../../feature/jobs/jobSlice';
import { resetCompanyStatus } from '../../feature/company/companySlice';

const JobUpdate = () => {

  const [form, setForm] = useState({
    title: '',
    salary_min: 0,
    salary_max: 0,
    location: "",
    work_mode: "",
    vacancies: 0,
    description: "",
    job_category_id: "",
    job_type_id: "",
    requirements: [],
    benefits: [],
    status: "",
    published_at: "",
    deadline: "",
    closed_at: "",
  });
  const { id } = useParams();
  console.log(id);

  const job = useSelector(selectJobDetail);
  const jobCategories = useSelector(selectJobCategories);
  const jobCategoryStatus = useSelector(selectJobCategoriesStatus);
  const jobTypes = useSelector(selectJobTypes);
  const jobTypsStatus = useSelector(selectJobTypeStatus);
  const dispatch = useDispatch();
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [loading, setLoading] = useState(null);
  const [isError, setIsError] = useState("");
  const navigate = useNavigate();

  // Fetch data base on id
  useEffect(() => {
    try {
      if (id) dispatch(fetchIndividualJob(id));
    } catch (error) {
      console.log(error);
    }
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    try {
      if(!job) return;

      setForm({
        title: job?.title ?? "",
        salary_min: job?.salary_min ?? 0,
        salary_max: job?.salary_max ?? 0,
        location: job?.location ?? "",
        work_mode: job?.work_mode ?? "",
        vacancies: job?.vacancies ?? 0,
        description: job?.description,
        job_category_id: job?.job_category_id ?? "",
        job_type_id: job?.job_type_id ?? "",
        requirements: job?.requirements ?? [],
        benefits: job?.benefits ?? [],
        status: job?.status ?? "",
        published_at: job?.published_at ?? "",
        deadline: job?.deadline ?? "",
        closed_at: job?.closed_at ?? "",
      });
    } catch (error) {
      console.log(error);
    }
  }, [job]);

  // console.log('jobs detail', job);

  const handleOnChange = (e) => {
    const {name, value} = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(!id) {
        alert('ID is not received!');
        return;
      };

      if(!form.job_category_id || !form.job_type_id || !form.title || !form.work_mode || !form.vacancies || !form.deadline || !form.status) {
        setIsError("Field Job-Category, Job-Type, Title, Work-Mode, Vacancies, Deadline, Status are required!");
        setLoading(false);
        return;
      }
      // Create formData
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("salary_min", form.salary_min);
      formData.append("salary_max", form.salary_max);
      formData.append("location", form.location);
      formData.append("work_mode", form.work_mode);
      formData.append("vacancies", form.vacancies);
      formData.append("description", form.description);
      formData.append("job_category_id", form.job_category_id);
      formData.append("job_type_id", form.job_type_id);
      formData.append("status", form.status);
      formData.append("published_at", form.published_at);
      formData.append("deadline", form.deadline);
      formData.append("closed_at", form.closed_at);
      
      // Append requirement to form
      form.requirements.forEach((r) => {
        formData.append(`requirements[]`, r);
      });
      // Append benefit to form
      form.benefits.forEach((b) => {
        formData.append(`benefits[]`, b);
      });
      // Append data to store and api
      await dispatch(updateJob({ id, formData })).unwrap();
      
      Swal.fire({
        title: "Success",
        text: "Job posting is updated successfully!",
        icon: "success",
        timer: 2000,
      });

      dispatch(resetCompanyStatus())
      const timeOut = setTimeout(() => {
        navigate('/');
      }, 2000);

      // Clear form
      setForm({
        title: "",
        salary_min: 0,
        salary_max: 0,
        location: "",
        work_mode: "",
        vacancies: 0,
        description: "",
        job_category_id: "",
        job_type_id: "",
        requirements: [],
        benefits: [],
        status: "",
        published_at: "",
        deadline: "",
        closed_at: "",
      })

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: `Your are failed to updated posting job! ${error}`,
        icon: "error",
        timer: 2000,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      
      if(jobCategoryStatus === 'idle') dispatch(fetchJobCategories());

      if(jobTypsStatus === 'idle') dispatch(fetchJobTypes());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, jobCategoryStatus, jobTypsStatus]);

  const addRequirement = () => {
    // Trim white space
    const r = requirementInput.trim();
    // Check if requirement not exists
    if(!r) return;
    // If form of requirements include t return, mean cannot duplicate data.
    if(form.requirements.includes(r)) {
      alert('Your sentencens already exists. Cannot input duplicate data!');
      return;
    }
    // Set new requirement to form
    setForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, r]
    }));
    // Clear requirement input
    setRequirementInput("");
  }

  const removeRequirment = (requirment) => {
    // filtered out selected data to remove from form
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== requirment)
    }))
  }

  const addBenefit = () => {
    // Trim white space
    const b = benefitInput.trim();
    // If benefit is not exist
    if(!b) return;
    // If form of requirements include t return, mean cannot duplicate data.
    if(form.benefits.includes(b)) {
      alert('Your sentencens already exists. Cannot input duplicate data!');
      return;
    }
    // Set new requirement to form
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, b]
    }));
    // Clear requirement input
    setBenefitInput("");
  }

  const removeBenefit = (benefit) => {
    // filtered out selected data to remove from form
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit)
    }))
  }

  return (
    <div className='mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10'>
      <div className='w-full flex flex-col items-start'>
        <h2 className='md:text-3xl text-2xl font-medium tracking-wide'>Recruit New Talent.</h2>
        <div className='w-full my-4'>
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className='space-y-4'>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="title" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Job Title
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="text" 
                    id="title"
                    name="title" 
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    placeholder="e.g. Senior Frontend Developer"
                    value={form.title}
                    onChange={handleOnChange}
                  />
                  {/* Optional: Small helper text helps with UX */}
                  <p className="text-xs text-gray-500">
                    Try to be specific (e.g., "Full Stack Engineer" instead of just "Engineer").
                  </p>
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="location" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Location
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="text" 
                    id="location"
                    name="location" 
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    placeholder="e.g. Head Quarter, etc."
                    value={form.location}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="salary_min" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Minimun Salary
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="number" 
                    id="salary_min"
                    name="salary_min" 
                    min={0}
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    placeholder="e.g. 250"
                    value={form.salary_min}
                    onChange={handleOnChange}
                  />
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="salary_max" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Maximium Salary
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="number" 
                    id="salary_max"
                    name="salary_max"
                    min={0}
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    placeholder="e.g. 500"
                    value={form.salary_max}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="work_mode" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Work-Mode
                  </label>
                  <select 
                    name="work_mode" 
                    id="work_mode"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.work_mode}
                    onChange={handleOnChange}
                    >
                    <option value="" defaultChecked disabled>Choose a work mode</option>
                    <option value="on-site">On-Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="vacancies" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Vacancies
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="number" 
                    id="vacancies"
                    name="vacancies" 
                    min={0}
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    placeholder="e.g. 1 or 2"
                    value={form.vacancies}
                    onChange={handleOnChange}
                  />
                  <p className="text-xs text-gray-500">
                    In this field prompt you to input how many posts that available for recruits!
                  </p>
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="job_category_id" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Job-Category
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <select 
                    name="job_category_id" 
                    id="job_category_id"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.job_category_id}
                    onChange={handleOnChange}
                    >
                    <option value="" defaultChecked disabled>Choose a Category</option>
                    {
                      jobCategories?.map((cate) => (
                        <option value={cate.id} key={cate.id}>{cate?.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="job_type_id" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Job-Type
                  </label>
                  <select 
                    name="job_type_id" 
                    id="job_type_id"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.job_type_id}
                    onChange={handleOnChange}
                    >
                    <option value="" defaultChecked disabled>Choose a Job-Type</option>
                    {
                      jobTypes?.map((type) => (
                        <option value={type.id} key={type.id}>{type?.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="status" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Status
                  </label>
                  <select 
                    name="status" 
                    id="status"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.status}
                    onChange={handleOnChange}
                    >
                    <option value="" defaultChecked disabled>Choose a status</option>
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                  </select>
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="published_at" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Publish Date
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="date" 
                    id="published_at"
                    name="published_at" 
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    value={form.published_at}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="closed_at" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Closed Date
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="date" 
                    id="closed_at"
                    name="closed_at" 
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    value={form.closed_at}
                    onChange={handleOnChange}
                  />
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label 
                    htmlFor="deadline" 
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Deadline Date
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input 
                    type="date" 
                    id="deadline"
                    name="deadline" 
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    " 
                    value={form.deadline}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className='w-full flex md:flex-row flex-col gap-x-6'>
                <div className='md:w-1/2 w-full flex-col items-start space-y-3'>
                  <div className='w-full flex flex-col space-y-2'>
                    <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                      <label 
                        htmlFor="requirements" 
                        className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                      >
                        Requirements
                      </label>
                      {/* Input with smooth transitions and improved focus states */}
                      <input 
                        type="text" 
                        id="requirements"
                        name="requirements" 
                        className="
                          w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                        "
                        placeholder='Fill out your requirements...'
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addRequirement();
                          }
                        }}
                      />
                      <div className='flex justify-end items-end'>
                        <button
                          type="button"
                          onClick={addRequirement}
                          className="min-w-20 px-4 py-2 max-sm:w-70 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {/* Display requirements */}
                    <div className="flex flex-col flex-wrap gap-2">
                      {form.requirements.map((requirement, idx) => (
                        <div 
                          key={`${requirement}-${idx}`}
                          className='flex justify-between items-center bg-cyan-500/10 text-cyan-700 px-3 py-1 rounded-full border border-cyan-500/20'>
                          <span
                            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide"
                          >
                            {requirement}
                          </span>
                          <button
                              type="button"
                              onClick={() => removeRequirment(requirement)}
                              className="font-bold hover:text-red-500"
                            >
                              ×
                            </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='w-full flex flex-col space-y-2'>
                    <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                      <label 
                        htmlFor="benefits" 
                        className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                      >
                        Benefits
                      </label>
                      {/* Input with smooth transitions and improved focus states */}
                      <input 
                        type="text" 
                        id="benefits"
                        name="benefits" 
                        className="
                          w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                        "
                        placeholder='Fill out your benefits...'
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addBenefit();
                          }
                        }}
                      />
                      <div className='flex justify-end items-end'>
                        <button
                          type="button"
                          onClick={addBenefit}
                          className="min-w-20 px-4 py-2 max-sm:w-70 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {/* Display requirements */}
                    <div className="flex flex-col flex-wrap gap-2">
                      {form.benefits.map((benefit, idx) => (
                        <div 
                          key={`${benefit}-${idx}`}
                          className='flex justify-between items-center bg-cyan-500/10 text-cyan-700 px-3 py-1 rounded-full border border-cyan-500/20'>
                          <span
                            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide"
                          >
                            {benefit}
                          </span>
                          <button
                              type="button"
                              onClick={() => removeBenefit(benefit)}
                              className="font-bold hover:text-red-500"
                            >
                              ×
                            </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label 
                      htmlFor="description" 
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Description
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <textarea 
                      type="text" 
                      id="description"
                      name="description" 
                      className="
                        w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                      " 
                      placeholder='Fill out your description here...'
                      rows={10}
                      cols={4}
                      value={form.description}
                      onChange={handleOnChange}
                    />
                  </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/my-jobs"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                <FiSave />
                Update
              </button>
            </div>
            {isError && <p className="text-base text-red-500">{isError}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobUpdate