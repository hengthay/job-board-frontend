import React, { useEffect, useState } from 'react'
import { CiUser } from "react-icons/ci";
import { MdArrowOutward, MdOutlineWorkOutline, MdOutlineCategory } from "react-icons/md";
import { FaIdCard } from "react-icons/fa6";
import { SlOrganization } from "react-icons/sl";
import { LuTypeOutline } from "react-icons/lu";
import { Link, useOutletContext } from 'react-router-dom'
import ChartOverview from '../components/ChartOverview';
import PolarOverview from '../components/PolarOverview';
import { API_BASE_URL, axiosInstance } from '../components/AxiosInstance';

const Dashboard = () => {

  // State
  const [count, setCount] = useState({
    users: 0,
    candidateProfiles: 0,
    jobs: 0,
    companies: 0,
    jobTypes: 0,
    jobCategories: 0
  });
  // Loading
  const [loading, setLoading] = useState(false);
  const { sideBarOpen } = useOutletContext();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`${API_BASE_URL}/admin/dashboard-stat`, {
          withCredentials: true,
        });

        // Extract data
        const data = res?.data?.data;

        setCount({
          users: data?.users ?? 0,
          candidateProfiles: data?.candidateProfiles ?? 0,
          jobs: data?.jobs ?? 0,
          companies: data?.companies ?? 0,
          jobTypes: data?.jobTypes ?? 0,
          jobCategories: data?.jobCategories ?? 0,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      };
    }
    
    fetchCounts();
    
  }, []);

  const gridDataList = [
    {
      id: 1, name: 'Total Users', value: count.users, icon: CiUser, link: '/', color: "bg-blue-50 text-blue-700 group-hover:bg-blue-100 group-hover:text-blue-800"
    },
    {
      id: 2, name: 'Total Candidate Profiles', value: count.candidateProfiles, icon: FaIdCard, link: '/', color: "bg-purple-50 text-purple-700 group-hover:bg-purple-100 group-hover:text-purple-800",
    },
    {
      id: 3, name: 'Total Jobs', value: count.jobs, icon: MdOutlineWorkOutline, link: '/', color: "bg-green-50 text-green-700 group-hover:bg-green-100 group-hover:text-green-800",
    },
    {
      id: 4, name: 'Total Company', value: count.companies, icon: SlOrganization, link: '/', color: "bg-amber-50 text-amber-700 group-hover:bg-amber-100 group-hover:text-amber-800",
    },
    {
      id: 5, name: 'Total Job-Type', value: count.jobTypes, icon: LuTypeOutline, link: '/', color: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-100 group-hover:text-cyan-800",
    },
    {
      id: 6, name: 'Total Job-Category', value: count.jobCategories, icon: MdOutlineCategory, link: '/', color: "bg-red-50 text-red-700 group-hover:bg-red-100 group-hover:text-red-800",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      id: 1,
      label: "Add Job-Type",
      desc: "Create a new job-type",
      link: "/",
    },
    {
      id: 2,
      label: "Add Job-Category",
      desc: "Create a new job-category",
      link: "/",
    },
  ];

  return (
    <div className={`w-full transition-all ease-in-out duration-300 ${sideBarOpen ? "pl-70" : 'pl-0'}`}>
      <div className={`${sideBarOpen ? 'md:pr-4' : 'md:px-8 px-3'}`}>
        <div className='w-full mx-auto border border-gray-300 shadow-sm rounded-sm'>
          <div className='md:p-6 p-4 space-y-3'>
            <div className='space-y-2'>
              <h1 className='md:text-3xl text-2xl font-medium tracking-wide'>Dashboard</h1>
              <p className='md:text-base text-sm text-gray-500 tracking-wide leading-relaxed'>Tracking overview of website and manage verify there.</p>
            </div>
            {/* Grid of total action or data on website */}
            <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-6 gap-4'>
              {
                gridDataList.map((data) => {
                  // Get icon
                  const Icon = data.icon;
                  
                  return (
                   <Link
                      to={data.link}
                      key={data.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{data.name}</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {loading ? (
                              <span className="animate-pulse">...</span>
                            ) : (
                              data.value
                            )}
                          </p>
                        </div>
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ease-in-out duration-300 ${data.color}`}
                        >
                          <Icon size={20} />
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-1 mt-3">
                        <p className="text-xs text-gray-400">View details</p>
                        <MdArrowOutward
                          size={20}
                          className="transform transition ease-in duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-400"
                        />
                      </div>
                    </Link>
                  )
                })
              }
            </div>
            {/* Charts section */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Analytics Overview</h2>
              <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-4">
                <div className='w-full border border-gray-200 rounded-xl p-6 bg-gray-50/50 space-y-2'>
                  <p className='md:text-base text-sm text-gray-500'>Overview of Bar Charts</p>
                  <ChartOverview dataValues={count} />
                </div>
                <div className='w-full border border-gray-200 rounded-xl p-6 bg-gray-50/50 space-y-2'>
                  <p className='md:text-base text-sm text-gray-500'>Overview of Polar Area Charts</p>
                  <PolarOverview dataValues={count} />
                </div>
              </div>
            </div>

            {/* Quick actions and Admin profile */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:my-7 my-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <span className="text-xs text-gray-400">Shortcuts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {quickActions.map((a) => (
                    <Link
                      to={a.link}
                      key={a.id}
                      className="group rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
                    >
                      <p className="font-medium text-gray-900 group-hover:underline">
                        {a.label}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{a.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Profile card */}
              <div className="bg-white rounded-xl h-60 border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/80"
                    alt="Admin"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="text-gray-900">Admin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last Login</span>
                    <span className="text-gray-900">Today</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/"
                    className="flex-1 text-center px-3 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/"
                    className="flex-1 text-center px-3 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-900 transition"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard