import { useEffect } from "react";
import {
  BiBriefcaseAlt2,
  BiMap,
  BiLinkExternal,
  BiFile,
  BiUserCircle,
  BiCalendarCheck,
  BiTimeFive,
  BiBuildings,
} from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchApplicationById,
  selectApplicationDataDetail,
  selectApplicationDetailStatus,
  selectApplicationError,
} from "../../feature/application/applicationSlice";
import formatDate from "../Helper/formateDate";

const ApplicationDetail = () => {
  const { id } = useParams();
  // console.log('Application id: ', id);
  const applicationDetail = useSelector(selectApplicationDataDetail);
  const applicationDetailStatus = useSelector(selectApplicationDetailStatus);
  const applicationError = useSelector(selectApplicationError);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (id) dispatch(fetchApplicationById(id));
    } catch (error) {
      console.log(error);
    }
  }, [id, dispatch]);

  console.log("application data ", applicationDetail);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shortlist":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "interview":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 lg:p-12">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
        {applicationDetailStatus === "succeeded" && (
          <div className="p-6 md:p-10">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-100 pb-8 mb-8 gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                  <BiBriefcaseAlt2 className="text-lg" />{" "}
                  {applicationDetail?.job?.company?.industry}
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                  {applicationDetail?.job?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <BiBuildings className="text-slate-400" />{" "}
                    {applicationDetail?.job?.company?.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BiMap className="text-slate-400" />{" "}
                    {applicationDetail?.job?.company?.location}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase ${getStatusColor(applicationDetail?.status)}`}
                >
                  {applicationDetail?.status}
                </span>
              </div>
            </div>

            {/* --- Main Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                {/* Cover Letter */}
                <section>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <IoDocumentTextOutline className="text-blue-500 text-xl" />{" "}
                    Cover Letter
                  </h2>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-600 leading-relaxed shadow-sm">
                    "{applicationDetail?.cover_letter}"
                  </div>
                </section>

                {/* Employer Instruction */}
                {applicationDetail?.employer_note && (
                  <section className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">
                      Employer Instruction
                    </h3>
                    <p className="text-amber-900 font-semibold text-xl">
                      {applicationDetail?.employer_note}
                    </p>
                  </section>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-6">
                {/* Applicant Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                    Applicant
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-1 bg-blue-50 rounded-full text-blue-500">
                      <BiUserCircle size={44} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-slate-900 truncate">
                        {applicationDetail?.user?.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {applicationDetail?.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-5 border-t border-slate-50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 flex items-center gap-2 font-medium">
                        <BiCalendarCheck /> Applied On
                      </span>
                      <span className="font-bold text-slate-700">
                        {formatDate(applicationDetail?.applied_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 flex items-center gap-2 font-medium">
                        <BiTimeFive /> Status Update
                      </span>
                      <span className="font-bold text-slate-700 font-mono">
                        {formatDate(applicationDetail?.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attachments Card */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl shadow-slate-200">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5">
                    Attachments
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-800 rounded-xl border border-slate-700 group cursor-default">
                      <div className="flex items-center gap-3 min-w-0">
                        <BiFile className="text-blue-400 shrink-0" size={24} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate pr-2">
                            {applicationDetail?.resume?.file_name}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/storage/${applicationDetail?.resume?.file_path}`}
                        rel="noreferrer"
                        className="text-[10px] font-black bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors tracking-tighter uppercase"
                      >
                        Download
                      </a>
                    </div>

                    <a
                      href={applicationDetail?.job?.company?.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <BiLinkExternal className="text-sm" /> Visit Company
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {applicationDetailStatus === "loading" && (
          <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8 px-2">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-black font-medium">
              Loading<span className="animate-pulse">...</span>
            </p>
          </div>
        )}
        {applicationDetailStatus === "failed" && (
          <div className="bg-red-400 py-1.5 px-3 rounded-md my-8 mx-2">
            <p className="text-white">
              Failed to load applications, {applicationError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
