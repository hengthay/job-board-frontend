import React from "react";
import formatDate from "../../Helper/formateDate";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { removeJobCategory, resetJobCategoryStatus } from "../../../feature/jobcategories/jobCategoriesSlice";
import { useDispatch } from "react-redux";
import { CiEdit, CiTrash } from "react-icons/ci";

const JobCategoryCard = ({ jobCategory }) => {

  const dispatch = useDispatch();
  
  const handleDelete = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Job-Category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeJobCategory(id)).unwrap();

      // Reload Company Data
      dispatch(resetJobCategoryStatus());

      Swal.fire({
        title: "Deleted",
        text: "Job-Category has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Job-Category could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="group w-full bg-white border border-gray-200 hover:border-blue-400 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          #{jobCategory.id}
        </span>

        <span className="text-[11px] text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded-md">
          Job Category
        </span>
      </div>

      <div className="space-y-1.5 text-wrap">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-wrap">
          {jobCategory.name}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Created on {formatDate(jobCategory.created_at)}
        </p>
      </div>

      <div className="my-4 h-px bg-gray-100"></div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Link
          to={`/admin/job-categories/${jobCategory.id}/edit`}
          title="Edit"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition"
        >
          <CiEdit size={20} />
        </Link>

        <button
          type="button"
          title="Delete"
          onClick={() => handleDelete(jobCategory?.id)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
        >
          <CiTrash size={20} />
        </button>
      </div>

    </div>
  );
};

export default JobCategoryCard;
