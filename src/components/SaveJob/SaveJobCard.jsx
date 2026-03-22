import { CiBookmarkRemove, CiLocationOn, CiRead } from "react-icons/ci";
import formatOnlyDay from "../Helper/formatOnlyDay";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSaveJobStatus, unsaveFavoriteJob } from "../../feature/saveJob/saveJobSlice";

const SaveJobCard = ({ save }) => {

  const dispatch = useDispatch();

  const unFavoriteJob = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be permanently unfavorite!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, unfavorite it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(unsaveFavoriteJob(id)).unwrap();

      // Reset save job
      dispatch(resetSaveJobStatus());    

      Swal.fire({
        title: "Deleted",
        text: "Job has been unfavorite successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Job could not be unfavorite. ${error.message}`,
        icon: "error",
        timer: 1500,
      });
    }
  };
  
  return (
    <div
      key={save.id}
      className="w-full bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="w-full flex md:flex-row flex-col gap-4">
          <div className="md:w-20 md:h-20 w-full h-auto bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 font-bold text-xl">
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/${save?.job?.company?.logo_path}`}
              alt={save?.job?.company?.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="md:space-y-1.5 space-y-2">
            <h4 className="text-lg font-bold text-gray-900">{save?.job?.title}</h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CiLocationOn /> {save?.job?.company?.location}
              </span>
              <span>•</span>
              <span>{save?.job?.job_type?.name}</span>
              <span>•</span>
              <span className="text-gray-400">
                {formatOnlyDay(save?.created_at) === "Just now"
                  ? "Saved just now"
                  : `Saved ${formatOnlyDay(save?.created_at)} ago`}
              </span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                Status
              </p>
              <span
                className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase ${save?.job?.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {save?.job?.status === "open" ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <div className="flex items-start justify-end gap-x-1.5">
            <div className="w-14 h-12 md:flex-none p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <Link
                to={`/jobs/${save?.job?.id}/view`}
                title="View Details"
                className="flex items-center justify-center"
              >
                <CiRead size={24} />
              </Link>
            </div>
            <div className="w-14 h-12 md:flex-none p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <button
                onClick={() => unFavoriteJob(save?.job?.id)}
                type="button"
                title="Unfavorite"
                className="flex items-center justify-center mx-auto cursor-pointer"
              >
                <CiBookmarkRemove size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveJobCard;
