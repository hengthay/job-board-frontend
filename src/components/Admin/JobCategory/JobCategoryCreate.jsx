import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createJobCategory, resetJobCategoryStatus } from '../../../feature/jobcategories/jobCategoriesSlice';
import { FiSave } from 'react-icons/fi';

const JobCategoryCreate = () => {

  const [form, setForm] = useState({
    name: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sideBarOpen } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const {name, value} = e.target;

    setForm((form) => ({
      ...form,
      [name]: value
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if(!form.name) {
        setError("Category Name is required!");
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);

      await dispatch(createJobCategory(formData)).unwrap();

      // Reset Job-Type status
      dispatch(resetJobCategoryStatus());

      Swal.fire({
        title: "Success",
        text: "Job-Category is created successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/admin/job-categories');
      }, 2000);

      // Clear form
      setForm({
        name: ""
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Job-Category is failed to create - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  }

  // console.log(form)

  return (
    <div className={`mt-10 max-w-7xl h-auto md:mx-auto mx-4 rounded-xl py-4 my-10 ${sideBarOpen ? 'pl-50' : 'pl-0'}`}>
      <div className='w-full'>
        <div className="w-full flex flex-col items-start shadow md:p-6 p-3 rounded-md border border-gray-300 space-y-2">
          <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
            Create New Job-Category.
          </h2>
          <div className="w-full my-4">
            <form className="w-full" onSubmit={handleOnSubmit}>
              <div className="space-y-4">
                <div className="w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label
                    htmlFor="name"
                    className="flex gap-x-1 text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Category Name <p className='text-red-500 text-sm'>*</p>
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.name}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 my-4">
                <Link
                  to="/admin/job-categories"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
                >
                  <FiSave />
                  Create
                </button>
              </div>
            </form>
            {
              error && <p className='text-base text-red-500 font-medium'>{error}</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCategoryCreate