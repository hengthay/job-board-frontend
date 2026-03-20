import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchApplicationById, resetApplications, selectApplicationDataDetail, updateApplication } from "../../feature/application/applicationSlice";
import { resetJobStatus } from "../../feature/jobs/jobSlice";
import { selectUser } from "../../feature/auth/authSlice";
const ApplicationUpdate = () => {

  const [form, setForm] = useState({
    status: "",
    employer_note: "",
    reviewed_at: "",
    cover_letter: "",
  });

  const { id } = useParams();
  // console.log('application id ', id);
  const applicationDetail = useSelector(selectApplicationDataDetail);
  const user = useSelector(selectUser);
  // console.log('user', user?.user?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // Fetch application
  useEffect(() => {
    try {
      
      if(id) dispatch(fetchApplicationById(id));

    } catch (error) {
      console.log(error);
    }
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    try {
      
      if(!applicationDetail) return;

      setForm({
        status: applicationDetail?.status ?? "",
        employer_note: applicationDetail?.employer_note ?? "",
        reviewed_at: applicationDetail?.reviewed_at ?? "",
        cover_letter: applicationDetail?.cover_letter ?? ""
      });

    } catch (error) {
      console.log(error);
    }
  }, [applicationDetail])

  console.log('Application detail - ', applicationDetail);
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('status', form.status);
      formData.append('employer_note', form.employer_note);
      formData.append('cover_letter', form.cover_letter);
      formData.append('reviewed_at', form.reviewed_at);

      await dispatch(updateApplication({ id, formData })).unwrap();
      
      // Reset Job status
      dispatch(resetJobStatus());
      // Reset Application status
      dispatch(resetApplications());

      Swal.fire({
        title: "Success",
        text: "Application is updated successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/applications/apply-jobs');
      }, 2000);

      // Clear form
      setForm({
        status: "",
        employer_note: "",
        reviewed_at: "",
        cover_letter: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Failed to updated application - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log('formData - ', form);
  
  // Check user role
  const isUser = user?.user?.role === 'user';
  const isEmployer = user?.user?.role === 'employer';

  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's Apply Job.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className={`w-full grid gap-x-6 ${isUser ? 'grid-cols-1' : 'md:grid-cols-2 grid-cols-1'}`}>
                {
                  isEmployer && (
                    <>
                      <div className="space-y-3">
                        <div className="w-full flex flex-col space-y-2 group">
                        {/* Label with a subtle weight and color */}
                          <label
                            htmlFor="status"
                            className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                          >
                            Status
                          </label>
                          {/* Input with smooth transitions and improved focus states */}
                          <select
                            id="status"
                            name="status"
                            className="
                              w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                            "
                            value={form.status}
                            onChange={handleOnChange}
                            disabled={user?.role === 'user'}
                          >
                            <option value="" defaultChecked disabled>Choose a status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlist">Shortlist</option>
                            <option value="interview">Interview</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="w-full flex flex-col space-y-2 group">
                          {/* Label with a subtle weight and color */}
                          <label
                            htmlFor="reviewed_at"
                            className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                          >
                            Date of Review
                          </label>
                          {/* Input with smooth transitions and improved focus states */}
                          <input
                            type="date"
                            id="reviewed_at"
                            name="reviewed_at"
                            className="
                              w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                            "
                            value={form.reviewed_at}
                            onChange={handleOnChange}
                            disabled={user?.role === 'user'}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col space-y-2 group">
                        {/* Label with a subtle weight and color */}
                        <label
                          htmlFor="employer_note"
                          className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                        >
                          Employer Remark
                        </label>
                        {/* Input with smooth transitions and improved focus states */}
                        <textarea
                          id="employer_note"
                          rows={4}
                          name="employer_note"
                          className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                          placeholder="e.g. Describe your message..."
                          value={form.employer_note}
                          onChange={handleOnChange}
                        />
                      </div>
                    </>
                  )
                }
                {
                  isUser && (
                    <div className="w-full flex flex-col space-y-2 group">
                      {/* Label with a subtle weight and color */}
                      <label
                        htmlFor="cover_letter"
                        className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                      >
                        Cover Letter
                      </label>
                      {/* Input with smooth transitions and improved focus states */}
                      <textarea
                        id="cover_letter"
                        rows={8}
                        name="cover_letter"
                        className="
                          w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                        "
                        placeholder="e.g. Describe your message..."
                        value={form.cover_letter}
                        onChange={handleOnChange}
                      />
                    </div>
                  )
                }
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                <FiSave />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationUpdate