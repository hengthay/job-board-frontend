import React from "react";
import { CiEdit, CiLocationOn, CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { removeCompanyProfileByAdmin, resetAllCompaniesStatus } from "../../../feature/company/companySlice";

const CompanyCard = ({ company }) => {

  const dispatch = useDispatch();
  
  const handleDelete = async (id) => {
    console.log(id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Company will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeCompanyProfileByAdmin(id)).unwrap();

      // Reload Company Data
      dispatch(resetAllCompaniesStatus());

      Swal.fire({
        title: "Deleted",
        text: "Company has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Company could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="group w-full bg-white border border-gray-200  rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start">
        <div className="w-full flex md:flex-row flex-col gap-x-3 md:items-center items-start">
          <div className="flex md:flex-row flex-col justify-start md:justify-center items-start md:items-center md:gap-2 gap-4 space-y-2 relative">
            <span className="text-[10px] font-semibold tracking-wider text-white bg-black px-2 py-1 rounded-md absolute -top-2 -left-4">
              ID: {company.id}
            </span>
            <div className="md:w-20 md:h-20 w-full h-full">
              <img
                src={`${import.meta.env.VITE_API_URL}/storage/${company.logo_path}`}
                alt={company.name}
                className="object-contain w-full h-full rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start md:space-y-1 space-y-2.5">
            <p className="md:text-xl text-lg font-medium tracking-wide">
              {company.name}
            </p>
            <div className="flex md:flex-row flex-col gap-x-1 tracking-wide">
              <p className="">Industry: {company.industry}</p>

              <p className="flex items-center gap-1">
                <CiLocationOn className="text-red-500" /> {company.location}
              </p>
            </div>
            <p className="md:text-base text-sm tracking-wide text-gray-500">
              Created By: {company.user?.name}
            </p>
          </div>
        </div>
        {/* Action button */}
        <div className="flex md:flex-col flex-row md:items-center items-center justify-end w-full md:w-auto my-6 gap-2">
          <Link
            to={`/admin/companies/${company.id}/edit`}
            title="Edit"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition"
          >
            <CiEdit size={20} />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(company.id)}
            title="Delete"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
          >
            <CiTrash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
