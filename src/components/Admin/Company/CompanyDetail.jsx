import { useEffect } from 'react'
import { IoMdArrowBack } from 'react-icons/io';
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { CiLocationOn } from 'react-icons/ci';
import { FaEnvelope } from 'react-icons/fa';
import { GiWorld } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { findCompanyProfileByAdmin, selectCompanyDetailData, selectCompanyDetailStatus, selectCompanyError } from '../../../feature/company/companySlice';
const CompanyDetail = () => {

  const { sideBarOpen } = useOutletContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id);
  const companyDetail = useSelector(selectCompanyDetailData);
  const companyStatus = useSelector(selectCompanyDetailStatus);
  const companyError = useSelector(selectCompanyError);

  useEffect(() => {
    try {
      if(id) dispatch(findCompanyProfileByAdmin(id));    
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, id]);

  // console.log(companyDetail);

  const memberSince = companyDetail?.created_at
    ? new Date(companyDetail.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";
  return (
    <div
      className={`w-full transition-all ease-in-out duration-300 ${sideBarOpen ? "pl-70" : "pl-0"}`}
      >
      <div className={`${sideBarOpen ? "md:pr-4" : "md:px-8 px-3"}`}>
        <div className="max-w-7xl mx-auto border border-gray-300 shadow-sm rounded-sm">
          <div className="md:p-6 p-4 space-y-3">
            <div className="bg-linear-to-r from-black to-black/70 h-32">
              <Link
                to={'/admin/companies'}
                className="p-1"
                >
                <IoMdArrowBack size={24} className='text-gray-500 hover:text-cyan-500 transition-colors duration-300 ease-linear mx-2'/>
              </Link>
            </div>
            {
              companyStatus === 'succeeded' && (    
                <div className="px-8 pb-8 md:space-y-8 space-y-4">
                  <div className="relative flex flex-col sm:flex-row items-start md:items-end -mt-12 gap-5">
                    {/* Logo */}
                    <div className="bg-white p-2 rounded-lg shadow-md border">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/storage/${companyDetail?.logo_path}`}
                        alt={`logo`}
                        className="w-32 h-32 object-contain rounded-md"
                      />
                    </div>
          
                    {/* Title & Badge */}
                    <div className="flex-1 pb-2 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {companyDetail?.name}
                        </h1>
                        
                        {
                          companyDetail?.verified_at ? (
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 text-nowrap">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 text-nowrap">
                              Not Verified
                            </span>
                          )
                        }
                      </div>
                      <p className="text-lg text-gray-600">{companyDetail?.industry}</p>
                      <p className="text-sm text-gray-500 flex gap-x-1 items-center"><CiLocationOn />{companyDetail?.location}</p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h3 className="text-xl font-semibold text-gray-800">About Company</h3>

                    <div className='grid md:grid-cols-3 grid-cols-1 gap-6'>
                      <div className='md:col-span-2 col-span-1'>
                        <hr className='text-gray-400'/>
                        <div className='space-y-3'>
                          <p className='text-base text-gray-500 my-3'>{companyDetail?.description}</p>
                          <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 uppercase font-bold">
                                Company Size
                              </p>
                              <p className="text-gray-800 font-medium">
                                {companyDetail?.size} Employees
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 uppercase font-bold">
                                Member Since
                              </p>
                              <p className="text-gray-800 font-medium">{memberSince}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-1 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100'>
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
                                {companyDetail?.user?.email}
                              </p>
                            </div>
                          </div>  
                          {companyDetail?.website_url && (
                            <a
                              href={companyDetail.website_url}
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
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          {
            companyStatus === 'loading' && (
              <div className="flex justify-center mx-auto items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
          }
          {
            companyStatus === 'failed' && (
              <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                <p className="text-white">Failed to load jobs data, {companyError}</p>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CompanyDetail