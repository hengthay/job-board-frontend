import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { applyApplication, resetApplications } from "../../feature/application/applicationSlice";
import { fetchResumes, selectResumeData } from "../../feature/resume/resumeSlice";
import { selectUser } from "../../feature/auth/authSlice";
import { resetJobStatus } from "../../feature/jobs/jobSlice";

const ApplicationCreate = () => {

  const [form, setForm] = useState({
    job_id: "",
    resume_id: "",
    cover_letter: "",
  });

  const { jobId } = useParams();
  const resumesData = useSelector(selectResumeData);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // Fetch user resume
  useEffect(() => {
    try {
      if(user) dispatch(fetchResumes());
    } catch (error) {
      console.log(error);
    }
  }, [user, dispatch])

  // Set jobId to form
  useEffect(() => {
    if(jobId) {
      setForm((prev) => ({
        ...prev,
        job_id: jobId
      }))
    }
  }, [jobId])

  // console.log('Resume data - ', resumesData);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if(!jobId) {
      Swal.fire({
        title: "Not found",
        text: "No Job ID was found!",
        icon: "error",
      });
      return;
    }
    try {
      setLoading(true);

      if(!form.resume_id) {
        setIsError("Resume is required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('job_id', jobId); // set jobId
      formData.append('resume_id', form.resume_id);
      formData.append('cover_letter', form.cover_letter);

      await dispatch(applyApplication(formData)).unwrap();
      
      // Reset Job status
      dispatch(resetJobStatus());
      dispatch(resetApplications());

      Swal.fire({
        title: "Success",
        text: "Application is Applied successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/applications/apply-jobs');
      }, 2000);

      // Clear form
      setForm({
        job_id: "",
        resume_id: "",
        cover_letter: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Failed to applied application - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log('formData - ', form);
  
  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's Apply Job.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-x-6">
                <div className="w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label
                    htmlFor="resume_id"
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Resume
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <select
                    id="resume_id"
                    name="resume_id"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.resume_id}
                    onChange={handleOnChange}
                    required
                  >
                    <option value="" defaultChecked disabled>Choose a resume</option>
                    {
                      resumesData.length > 0 && (
                        resumesData?.map((resume) => (
                          <option key={resume.id} value={resume.id}>{resume?.file_name}</option>
                        ))
                      )
                    }
                  </select>
                </div>
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
                Apply Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationCreate