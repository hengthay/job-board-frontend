import { CiEdit, CiRead, CiTrash } from "react-icons/ci";
import { FiBriefcase, FiClock, FiFileText, FiMapPin, FiMessageSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../feature/auth/authSlice";
import Swal from "sweetalert2";
import { removeApplicatoin } from "../../feature/application/applicationSlice";
import { resetCompanyStatus } from "../../feature/company/companySlice";

const ApplicationCard = ({ application }) => {

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shortlist":
        return "bg-cyan-100 text-cyan-700 border-cyan-200"
      case "interview":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isUser = user?.user?.role === 'user';
  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Application will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeApplicatoin(id)).unwrap();

      // Reload Company Data
      dispatch(resetCompanyStatus());

      Swal.fire({
        title: "Deleted",
        text: "Application has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Application could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };
  
  return (
    <div
      key={application.id}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Job & Company Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {application.job?.company?.logo_path ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/storage/${application.job?.company?.logo_path}`}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiBriefcase className="text-gray-400 text-xl" />
            )}
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-cyan-600 transition-colors">
              {application.job?.title}
            </h3>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                {application.job?.company?.name}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin /> {application.job?.company?.location}
              </span>
              <span className="flex items-center gap-1">
                <FiClock /> Applied on {application.applied_at}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="flex flex-col md:items-end item-start gap-2">
            <span
              className={`px-3 py-1 w-22 text-center rounded-full text-xs font-semibold border uppercase ${getStatusColor(application.status)}`}
            >
              {application.status}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FiFileText /> {application.resume?.file_name}
            </span>
          </div>
        </div>
      </div>

      {/* Optional: Show short snippet of cover letter */}
      {application.cover_letter && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 italic line-clamp-1">
            " {application.cover_letter} "
          </p>
        </div>
      )}
      {/* NEW: Employer Remark Section */}
      {application.employer_note && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
          <div className="mt-1">
            <FiMessageSquare className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Feedback from Employer
            </p>
            <p className="text-sm text-amber-900 mt-1">
              {application.employer_note}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 my-4">
        <Link
          to={`/applications/${application?.id}/detail`}
          title="View Details"
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shadow"
        >
          <CiRead size={24} />
        </Link>
        <Link
          to={`/applications/${application?.id}/edit`}
          title="Edit Application"
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shadow"
        >
          <CiEdit size={24} />
        </Link>
        {
          isUser && (
            <button
              type="button"
              onClick={() => handleDelete(application?.id)}
              title="Delete Application"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shadow"
            >
              <CiTrash size={24} />
            </button>
          )
        }
      </div>
    </div>
  );
};

export default ApplicationCard;
