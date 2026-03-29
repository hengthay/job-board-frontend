import React from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { Link } from "react-router-dom";
import formatDate from "../../Helper/formateDate";
import { useDispatch } from "react-redux";
import { removeJobType, resetJobTypeStatus } from "../../../feature/jobtype/jobTypeSlice";
import Swal from "sweetalert2";
const JobTypeCard = ({ jobType }) => {

  const dispatch = useDispatch();
  
  const handleDelete = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Job-Type will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeJobType(id)).unwrap();

      // Reload Company Data
      dispatch(resetJobTypeStatus());

      Swal.fire({
        title: "Deleted",
        text: "Job-Type has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Job-Type could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="group relative w-full bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md rounded-xl md:p-5 p-3 transition-all duration-200">
      {/* Header: Label & ID Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          ID: {jobType.id}
        </div>
        <div className="text-xs text-gray-400 italic">Job Category</div>
      </div>

      {/* Main Content */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {jobType.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">Created: {formatDate(jobType.created_at)}</p>
      </div>

      {/* Actions Section */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-50">
        <Link
          to={`/admin/job-types/${jobType.id}/edit`}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
          title="Edit"
        >
          <CiEdit size={20} />
        </Link>
        <button
          type="button"
          onClick={() => handleDelete(jobType?.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          title="Delete"
        >
          <CiTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default JobTypeCard;
