import { CiEdit, CiLocationOn, CiRead, CiTrash } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi";
import { Link } from "react-router-dom";
import formatOnlyDay from "../Helper/formatOnlyDay";
import { useDispatch } from "react-redux";
import { deleteJob } from "../../feature/jobs/jobSlice";
import Swal from "sweetalert2";

const JobCard = ({ job }) => {

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteJob(id)).unwrap();

      Swal.fire({
        title: "Deleted",
        text: "Job has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Job could not be deleted. ${error.message}`,
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <div
      key={job?.id}
      className="w-full bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="w-full flex md:flex-row flex-col gap-4">
          <div className="md:w-14 md:h-14 w-full h-auto bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 font-bold text-xl">
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/${job?.company?.logo_path}`}
              alt={job?.company?.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CiLocationOn /> {job?.location}
              </span>
              <span>•</span>
              <span>{job?.job_type?.name}</span>
              <span>•</span>
              <span className="text-gray-400">
                Posted {formatOnlyDay(job?.created_at)} days ago
              </span>
            </div>
          </div>
        </div>

        {/* Middle Section: Stats */}
        <div className="flex items-center gap-8 px-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Applications
            </p>
            <div className="flex items-center justify-center gap-1 text-cyan-600 mt-1">
              <HiOutlineUsers size={18} />
              <span className="font-bold text-lg">45</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
              Status
            </p>
            <span
              className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase ${job?.status === 'open' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {job?.status === 'open' ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
          <Link
            to={`/jobs/${job.id}/view`}
            title="View Details"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <CiRead size={24} />
          </Link>
          <Link
            to={`/jobs/${job.id}/edit`}
            title="Edit Job"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <CiEdit size={24} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(job.id)}
            title="Delete Job"
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <CiTrash size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
