import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdWork, MdPeople, MdOutlineCategory, MdSocialDistance } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../feature/auth/authSlice";
import Swal from "sweetalert2";
import { IoBusinessOutline } from "react-icons/io5";
import { LuTypeOutline } from "react-icons/lu";

const SideBar = ({ sideBarOpen, handleOpenSideBar }) => {

  const location = useLocation();
  const navigate = useNavigate();
  // Get user
  const user = useSelector(selectUser);
  // Action
  const dispatch = useDispatch();

  const adminLinks = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard", 
      icon: <MdDashboard />, 
      color: "text-gray-500", // Trustworthy & Primary
      style: "group-hover:text-blue-500" 
    },
    { 
      name: "Job Type", 
      path: "/admin/job-types", 
      icon: <LuTypeOutline />, 
      color: "text-purple-500", // Creative & Categorical
      style: "group-hover:text-purple-600" 
    },
    { 
      name: "Job Category", 
      path: "/admin/job-categories", 
      icon: <MdOutlineCategory />, 
      color: "text-pink-500", // Organized & Vibrant
      style: "group-hover:text-pink-600" 
    },
    { 
      name: "Manage Jobs", 
      path: "/admin/jobs", 
      icon: <MdWork />, 
      color: "text-orange-500", // Energy & Action
      style: "group-hover:text-orange-600" 
    },
    { 
      name: "All Users", 
      path: "/admin/users", 
      icon: <MdPeople />, 
      color: "text-emerald-500", // Growth & Community
      style: "group-hover:text-emerald-600" 
    },
    { 
      name: "Candidate-Profile", 
      path: "/admin/candidate-profiles", 
      icon: <MdPeople />, 
      color: "text-cyan-500", // Fresh & Focused
      style: "group-hover:text-cyan-600" 
    },
    { 
      name: "Company", 
      path: "/admin/companies", 
      icon: <IoBusinessOutline />, 
      color: "text-indigo-500", // Professional & Corporate
      style: "group-hover:text-indigo-600" 
    },
    { 
      name: "Company-Social", 
      path: "/admin/company-socials", 
      icon: <MdSocialDistance />, 
      color: "text-rose-500", // Social & Engaging
      style: "group-hover:text-rose-600" 
    }
  ];

  const handleLogout = async () => {
    try {
      if (!user) {
        return;
      }

      await dispatch(logoutUser()).unwrap();

      Swal.fire({
        title: "Success",
        text: "Your logout successful!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your logout failed!",
        icon: "warning",
        timer: 2000,
      });
      console.log(error);
    }
  };
  
  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed top-24 bottom-0 left-0 z-50 h-screen bg-white border-r border-gray-300 transition-all duration-300 ease-in-out shadow-xl 
        ${sideBarOpen ? "opacity-100 translate-x-0 w-64" : "opacity-0 -translate-x-full w-0"}`}
      >
        <div className="flex h-screen w-full overflow-hidden">
          <div className="relative flex flex-col h-full p-4">
            <div className="font-bold text-xl text-cyan-600 mb-8 border-b md:pb-4 pb-2">
              Admin Panel
            </div>

            <nav className="flex flex-col md:gap-2 gap-1.5">
              {adminLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors group 
                  ${location.pathname === link.path 
                    ? "border-l-4 border-yellow-500 hover:bg-grey-200 text-black bg-gray-100 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <span className={`text-xl transition-colors duration-300 ${link.color} ${link.style}`}>{link.icon}</span>
                  <span className="font-medium text-nowrap">{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom Action Area */}
            <div className="absolute bottom-22 md:-right-4 -right-4 w-full py-4 px-2">
              <button 
                type="button"
                title="Sign Out"
                onClick={() => handleLogout()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold bg-black hover:bg-black/80 rounded-lg transition-colors ease-linear duration-300 border border-transparent cursor-pointer hover:border-red-100 group"
              >
                <span className="text-nowrap">Sign Out</span>
                <RiLogoutBoxRLine size={20} className="group-hover:translate-x-1 transition-transform ease-in-out duration-300"/>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay: Closes sidebar when clicking outside on mobile */}
      {sideBarOpen && (
        <div 
          className="fixed inset-0 max-sm:mt-24 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => handleOpenSideBar()}
        />
      )}
    </>
  );
};

export default SideBar;