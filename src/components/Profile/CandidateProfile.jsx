import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope, FaFileDownload, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { removeResume } from "../../feature/resume/resumeSlice";
import { resetCandidateProfileStatus } from "../../feature/candidateProfile/candidateProfileSlice";
import { IoMdArrowBack } from "react-icons/io";

const CandidateProfile = ({ data }) => {
  const profile = Array.isArray(data) ? data[0] : data;
  // console.log('profile - ', profile);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Resume will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeResume(id)).unwrap();

      // Reload Company Data
      dispatch(resetCandidateProfileStatus());

      Swal.fire({
        title: "Deleted",
        text: "Resume has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Resume could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden my-8">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-800 to-slate-900 h-32">
        <Link
          to={'/'}
          className="p-1"
          >
          <IoMdArrowBack size={24} className='text-gray-500 hover:text-cyan-500 transition-colors duration-300 ease-linear mx-2'/>
        </Link>
      </div>

      <div className="px-6 md:px-10 pb-10">
        {/* Profile Header Section */}
        <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 gap-6">
          <div className="bg-white p-1 rounded-full shadow-lg border-4 border-white">
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/${profile?.profile_image}`}
              alt={profile?.user?.name}
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full"
            />
          </div>

          <div className="flex-1 text-center md:text-left pb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {profile?.user?.name}
            </h1>
            <p className="text-xl text-blue-600 font-medium">{profile?.title || "Professional Candidate"}</p>
            <div className="flex md:items-center item-start justify-center md:justify-start md:gap-2 gap-x-px mt-2 text-gray-500">
              <CiLocationOn className="text-gray-400" />
              <span className="text-sm">{profile?.location || "Location not specified"}</span>
            </div>
          </div>

          <div className="flex gap-3 pb-2">
             <Link
                to={`/profiles/${profile?.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <FaEdit size={14} /> Edit Profile
              </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* Main Content */}
          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4">About Me</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {profile?.summary || "Professional summary not provided."}
              </p>
            </section>

            {/* --- NEW UPDATED RESUME SECTION --- */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400">My Resumes</h3>
                <Link 
                  to='/resumes/create'
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors"
                >
                  + Add New
                </Link>
              </div>

              <div className="space-y-3">
                {profile?.resumes?.length > 0 ? (
                  profile.resumes.map((resume) => (
                    <div 
                      key={resume.id} 
                      className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
                        resume.is_default 
                        ? 'border-blue-200 bg-blue-50/30 ring-1 ring-blue-100' 
                        : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${resume.is_default ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <FaFileDownload size={18} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                             <a 
                                href={`${import.meta.env.VITE_API_URL}/storage/${resume.file_path}`}
                                target="_blank"
                                className="text-sm font-bold text-gray-800 hover:text-blue-600 truncate max-w-37.5 md:max-w-xs"
                             >
                               {resume.file_name || "Resume File"}
                             </a>
                             {resume.is_default === 1 && (
                               <span className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                 <FaCheckCircle size={8} /> Default
                               </span>
                             )}
                          </div>
                          <p className="text-xs text-gray-400">Uploaded on {new Date(resume.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/resumes/${resume.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Resume"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(resume.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Resume"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-4 md:px-4 md:py-8 p-4 border border-dashed rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      No Resume yet.
                    </p>
                    <Link
                      to={"/resumes/create"}
                      className="text-blue-600 text-sm font-bold hover:underline"
                    >
                      + Add Resume
                    </Link>
                  </div>
                )}
              </div>
            </section>
            {/* --- END RESUME SECTION --- */}

            <section className="p-5 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-xs uppercase font-bold text-gray-400 mb-2">Member Status</p>
              <p className="text-gray-800 font-semibold">Active since {memberSince}</p>
            </section>
          </div>

          {/* Sidebar: Right Column */}
          <div className="space-y-6">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Contact & Social</h3>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FaEnvelope className="text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                    <p className="text-sm text-gray-700 truncate">{profile?.user?.email}</p>
                  </div>
                </div>

                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <FaLinkedin className="text-gray-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">LinkedIn</p>
                      <p className="text-sm text-blue-600 font-medium">View Profile</p>
                    </div>
                  </a>
                )}

                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black transition-colors">
                      <FaGithub className="text-gray-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">GitHub</p>
                      <p className="text-sm text-blue-600 font-medium">View Work</p>
                    </div>
                  </a>
                )}

                {profile?.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-600 transition-colors">
                      <FaGlobe className="text-gray-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Portfolio</p>
                      <p className="text-sm text-blue-600 font-medium">Visit Website</p>
                    </div>
                  </a>
                )}
              </div>

              <Link
                to="/my-jobs"
                className="mt-8 block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
              >
                View Saved Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;