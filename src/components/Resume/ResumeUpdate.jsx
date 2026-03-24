import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiSave, FiUpload } from 'react-icons/fi';
import { resetCompanyStatus } from '../../feature/company/companySlice';
import { clearResumeDetail, fetchResumesById, selectResumeDataDetail, updateResume } from '../../feature/resume/resumeSlice';
import { resetCandidateProfileStatus } from '../../feature/candidateProfile/candidateProfileSlice';
const ResumeUpdate = () => {

  const [form, setForm] = useState({
    file_path: "",
    is_default: 0,
  });

  const { id } = useParams();
  // console.log('resume id', id);
  const resumeDetail = useSelector(selectResumeDataDetail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const [currentPreviewFile, setCurrentPreviewFile] = useState("");

  // Fetch resume detail
  useEffect(() => {
    try {
      dispatch(clearResumeDetail()); // clear old data
      if(id) dispatch(fetchResumesById(id))

      return () => dispatch(clearResumeDetail());
    } catch (error) {
      console.log(error);      
    }
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    try {
      if(!resumeDetail) return;

      setForm({
        file_path: resumeDetail?.file_path ?? "",
        is_default: resumeDetail?.is_default ?? 0
      });

      setCurrentPreviewFile(resumeDetail?.file_name || "");
      setFilePreview(null);
    } catch (error) {
      console.log(error);
    }
  }, [resumeDetail])
  console.log(resumeDetail);

  const handleOnChange = (e) => { 
    const { name, value, files } = e.target;

    if(name === 'file_path') {
      const file = files?.[0];
      // Set maximium size of file upload
      const MAX_FILE_SIZE = 2 * 1024 * 1024;

      if(file.size > MAX_FILE_SIZE) {
          Swal.fire("Error", "File must be less than 2MB", "error");
        return;
      }
      setForm((prev) => ({
        ...prev,
        file_path: file
      }))

      setFilePreview(file.name);
      setCurrentPreviewFile("");
    }else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file_path', form.file_path);
      formData.append('is_default', form.is_default);

      await dispatch(updateResume({ id, formData })).unwrap();

      // Reload Status Data
      dispatch(resetCompanyStatus());
      dispatch(resetCandidateProfileStatus());

      Swal.fire({
        title: "Success",
        text: "Resume is updated successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/profiles');
      }, 2000);

      // Clear form
      setForm({
        file_path: "",
        is_default: 0,
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Resume is failed to update - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's Update Resume.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-x-6">
                <div className='md:col-span-2 col-span-1 space-y-3'>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="is_default"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Set Default
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <select

                      id="is_default"
                      name="is_default"
                      className="
                        w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                      "
                      value={form.is_default}
                      onChange={handleOnChange}
                    >
                      <option value="" defaultChecked disabled>Choose a default</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>
                <div className='col-span-1 mt-7'>
                  <div className="w-full h-30 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                    {filePreview ? (
                      <p className="text-gray-500 text-sm">
                        New File: <span className="text-blue-500 font-medium">{filePreview}</span>
                      </p>
                    ) : currentPreviewFile ? (
                      <p className="text-gray-500 text-sm">
                        Current File: <span className="text-green-600 font-medium">{currentPreviewFile}</span>
                      </p>
                    ) : (
                      <div className="space-y-2 flex flex-col">
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          No File selected
                        </span>
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          Accept type: Docs, Docx, PDF
                        </span>
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          File Size should be less than 2 MB.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload */}
                  <p className="flex justify-end items-end w-full mt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition">
                      <FiUpload />
                      Upload File
                      <input
                        type="file"
                        name="file_path"
                        accept=".doc,.docx,.pdf"
                        onChange={handleOnChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/profiles"
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

export default ResumeUpdate