import { useEffect, useState } from "react";
import logoImage from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../feature/auth/authSlice";
import Swal from "sweetalert2";

const NavBar = ({ isOpen, handleOpenMenu }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const user = useSelector(selectUser);
  const [userSetting, setUserSetting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let t;

    if (isOpen) {
      setIsVisible(true);
    } else {
      // wait for transition to finish then unmount
      t = setTimeout(() => setIsVisible(false), 220);
    }
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleSettingClick = () => setUserSetting((prev) => !prev);
  const showMobile = isOpen || isVisible;

  const menuLists = [
    {
      id: 1,
      name: "Jobs",
      path: "/",
    },
    {
      id: 2,
      name: "Companies",
      path: "/companies",
    },
    {
      id: 3,
      name: "Blogs",
      path: "/blogs",
    },
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

  console.log('Current User - ', user);

  return (
    <header className="w-full container mx-auto">
      <div className="flex justify-between items-center min-h-16">
        {/* Logo */}
        <img src={logoImage} alt="logo" className="w-36 object-contain" />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-6 ">
            {menuLists.map((menu) => (
              <li
                key={menu.id}
                className={`font-semibold text-base hover:text-gray-500 transition-colors ease-in-out duration-300 ${location.pathname === menu.path ? "underline underline-offset-4" : ""}`}
              >
                <Link to={`${menu.path}`}>{menu.name}</Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            {/* Check if user present or not, to change UI */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 shadow">
                  <button
                    type="button"
                    className="text-black cursor-pointer"
                    onClick={handleSettingClick}
                  >
                    {user?.user?.name[0].toUpperCase()}
                  </button>
                </div>
                {
                  user?.user?.role === 'employer' && (<div>
                    <Link 
                      className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-black/80 transition-colors ease-linear duration-300"
                      to={'/jobs/create'}>
                      Post a Job
                    </Link>
                  </div>)
                }
              </div>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="border px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:border-cyan-400 cursor-pointer"
                >
                  Sign in
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to={"/register"}
                  className="bg-black text-white px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:bg-black/80 cursor-pointer"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        {!isOpen ? (
          <button
            className="md:hidden flex text-2xl max-sm:mx-2 cursor-pointer"
            onClick={handleOpenMenu}
          >
            <GiHamburgerMenu size={24} />
          </button>
        ) : (
          <button
            onClick={handleOpenMenu}
            className="max-sm:mx-2 cursor-pointer"
          >
            <MdOutlineCancel size={24} />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div
          className={`w-full md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"} mt-15 bg-cyan-100`}
          onClick={handleOpenMenu} // click outside closes
        >
          <div className="w-full md:hidden flex flex-col items-start gap-6 py-6 mx-6">
            <ul className="flex flex-col gap-6 font-semibold">
              {menuLists.map((menu) => (
                <li
                  key={menu.id}
                  className={`font-semibold text-base hover:text-gray-500 transition-colors ease-in-out duration-300 ${location.pathname === menu.path ? "underline underline-offset-4" : ""}`}
                >
                  <Link to={`${menu.path}`}>{menu.name}</Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              {/* Check if user present or not, to change UI */}
              {user ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 shadow">
                    <button
                      type="button"
                      className="text-black cursor-pointer"
                      onClick={handleSettingClick}
                    >
                      {user?.user?.name[0].toUpperCase()}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="border px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:border-cyan-400 cursor-pointer"
                  >
                    Sign in
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to={"/register"}
                    className="bg-black text-white px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:bg-black/80 cursor-pointer"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {userSetting && (
        <div
          className={`flex flex-col justify-start items-start absolute top-17 right-23 bg-white min-w-62.5 p-1.5 z-10 ${
            userSetting ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-gray-800 text-base text-nowrap hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 font-medium">
            {user?.user?.email}
          </span>
          <Link
            to={"/my-jobs"}
            className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
          >
            {/* <LiaUserLockSolid size={28} /> */}
            View Jobs
          </Link>
          <Link
            to={"/profiles"}
            className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
          >
            {/* <LiaUserLockSolid size={28} /> */}
            Go to Setting
          </Link>
          <hr className="text-gray-300 w-56.25 mx-auto" />
          <button
            type="button"
            className="px-2 py-1.5 cursor-pointer w-full bg-cyan-400 my-2 rounded-md text-white hover:bg-cyan-500 transition-colors ease-linear duration-300"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
