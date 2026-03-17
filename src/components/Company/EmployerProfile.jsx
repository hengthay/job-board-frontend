import { CiEdit, CiLocationOn, CiTrash } from "react-icons/ci";
import {
  FaEdit,
  FaEnvelope,
  FaFacebookF,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiWorld } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetCompanyStatus } from "../../feature/company/companySlice";
import { removeCompanySocial } from "../../feature/companySocial/companySocialSlice";

const EmployerProfile = ({ data }) => {
  const SOCIAL_PLATFORM_CONFIG = {
    Facebook: {
      icon: FaFacebookF,
      bg: "group-hover:bg-blue-600",
      iconColor: "text-blue-500  group-hover:text-white",
    },
    Telegram: {
      icon: FaTelegramPlane,
      bg: "group-hover:bg-sky-500",
      iconColor: "text-sky-500   group-hover:text-white",
    },
    Instagram: {
      icon: FaInstagram,
      bg: "group-hover:bg-pink-500",
      iconColor: "text-pink-500  group-hover:text-white",
    },
    Linkedin: {
      icon: FaLinkedinIn,
      bg: "group-hover:bg-blue-700",
      iconColor: "text-blue-700  group-hover:text-white",
    },
    Other: {
      icon: FaGlobe,
      bg: "group-hover:bg-gray-600",
      iconColor: "text-gray-500  group-hover:text-white",
    },
  };
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Company Social will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(removeCompanySocial(id)).unwrap();

      // Reload Company Data
      dispatch(resetCompanyStatus());

      Swal.fire({
        title: "Deleted",
        text: "Company Social has been deleted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Your Company Social could not be deleted. ${error.message}`,
        icon: "error",
      });
    }
  };

  const company = Array.isArray(data) ? data[0] : data;

  if (!company) return null;

  // Format the date for a "Member Since" feature
  const memberSince = company?.created_at
    ? new Date(company.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 my-10">
      {/* Top Banner / Header Area */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 h-32"></div>

      <div className="px-8 pb-8">
        <div className="relative flex flex-col sm:flex-row items-end -mt-12 gap-5">
          {/* Logo */}
          <div className="bg-white p-2 rounded-lg shadow-md border">
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/${company?.logo_path}`}
              alt={`${company?.name} logo`}
              className="w-32 h-32 object-contain rounded-md"
            />
          </div>

          {/* Title & Badge */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {company?.name}
              </h1>
              {company?.verified_at && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 text-nowrap">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-lg text-gray-600">{company?.industry}</p>
          </div>

          <div className="flex gap-3 pb-2">
            <Link
              to={`/companies/${company?.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <FaEdit size={14} /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                About Company
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {company?.description || "No description provided."}
              </p>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 uppercase font-bold">
                  Company Size
                </p>
                <p className="text-gray-800 font-medium">
                  {company?.company_size} Employees
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 uppercase font-bold">
                  Member Since
                </p>
                <p className="text-gray-800 font-medium">{memberSince}</p>
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FaEnvelope className="text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Email
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {company?.user?.email}
                    </p>
                  </div>
                </div>

                {company?.location && (
                  <div className="flex items-center gap-4 group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-300 transition-colors">
                      <CiLocationOn className="text-gray-400 " />
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-gray-700">{company?.location}</p>
                    </div>
                  </div>
                )}

                {company?.website_url && (
                  <a
                    href={company?.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black transition-colors">
                      <GiWorld className="text-gray-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">
                        Website
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        View Website
                      </p>
                    </div>
                  </a>
                )}
              </div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-800 mb-4">Social Media</h3>
                <Link
                  to={"/company-socials/create"}
                  className="hover:text-blue-500 cursor-pointer"
                >
                  <IoMdAdd size={20} />
                </Link>
              </div>
              <div className="space-y-5">
                {company?.company_social?.length === 0 ? (
                  <div className="mt-4 p-4 border border-dashed rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      No social links added yet.
                    </p>
                    <Link
                      to={"/company-socials/create"}
                      className="text-blue-600 text-sm font-bold hover:underline"
                    >
                      + Add Social Media
                    </Link>
                  </div>
                ) : (
                  <>
                    {company?.company_social?.map((social) => {
                      const config =
                        SOCIAL_PLATFORM_CONFIG[social?.platform] ??
                        SOCIAL_PLATFORM_CONFIG.Other;
                      const PlatformIcon = config.icon;

                      return (
                        <div
                          className="flex justify-between items-center"
                          key={social?.id}
                        >
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                          >
                            <div
                              className={`p-2 bg-gray-100 rounded-lg  transition-colors ${config.bg}`}
                            >
                              <PlatformIcon
                                size={20}
                                className={config.iconColor}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">
                                {social?.platform}
                              </p>
                              <p className="text-sm text-blue-600 font-medium">
                                Visit
                              </p>
                            </div>
                          </a>
                          <div className="flex gap-x-1">
                            <Link
                              to={`/company-socials/${social.id}/edit`}
                              title="Edit Company Social"
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <CiEdit size={24} />
                            </Link>
                            <button
                              onClick={() => handleDelete(social?.id)}
                              type="button"
                              title="Delete Company Social"
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <CiTrash size={24} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <Link
                to="/my-jobs"
                className="mt-8 block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
              >
                View Open Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
