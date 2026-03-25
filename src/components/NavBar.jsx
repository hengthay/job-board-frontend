import { useEffect, useState } from "react";
import logoImage from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../feature/auth/authSlice";
import Swal from "sweetalert2";
import { RiMenuFold2Line, RiMenuFoldLine } from "react-icons/ri";

const NavBar = ({ isOpen, handleOpenMenu, sideBarOpen, handleOpenSideBar }) => {

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

  // To handle close all menu and userSetting
  const handleCloseAll = () => {
    setUserSetting(false); // close dropdown
    // only close in mobile menu if on small screen
    if (window.innerWidth < 768 && isOpen) {
      handleOpenMenu();
    }
  };

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

  console.log("Current User - ", user);

  // Check role
  const isAdmin = user?.user?.role === "admin";
  // Get location of url
  const isAdminURL = location.pathname === "/admin/dashboard";
  console.log(location);

  return (
    <header className="w-full container mx-auto">
      <div className="flex justify-between items-center min-h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link to={"/"}>
            <img src={logoImage} alt="logo" className="w-36 object-contain" />
          </Link>

          {isAdmin && isAdminURL && (
            <span className="hidden sm:block font-bold text-cyan-600 border-l pl-4 border-gray-300">
              Admin Panel
            </span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center gap-4">
          {isAdmin && isAdminURL ? (
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 shadow">
                  <button
                    type="button"
                    className="text-black cursor-pointer"
                    onClick={handleSettingClick}
                  >
                    {user?.user?.name[0].toUpperCase()}
                  </button>
                </div>
                <div className="flex items-center">
                  {isAdmin &&
                    (!sideBarOpen ? (
                      <button
                        className="flex max-sm:mx-2 cursor-pointer"
                        onClick={handleOpenSideBar}
                      >
                        <RiMenuFold2Line size={24} />
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenSideBar}
                        className="max-sm:mx-2 cursor-pointer"
                      >
                        <RiMenuFoldLine size={24} />
                      </button>
                    ))}
                </div>
              </div>
          ): (
            /* DEFAULT VIEW: Desktop Menu + Mobile Hamburger */
            <>
              <ul className="hidden md:flex gap-6 ">
                {menuLists.map((menu) => (
                  <li
                    key={menu.id}
                    className={`font-semibold text-base hover:text-gray-500 transition-colors ease-in-out duration-300 ${location.pathname === menu.path ? "underline underline-offset-4" : ""}`}
                  >
                    <Link to={`${menu.path}`}>{menu.name}</Link>
                  </li>
                ))}
              </ul>

              <div className="hidden md:flex items-center gap-3">
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
                    {user?.user?.role === "employer" && (
                      <div>
                        <Link
                          className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-black/80 transition-colors ease-linear duration-300"
                          to={"/jobs/create"}
                        >
                          Post a Job
                        </Link>
                      </div>
                    )}
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
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer (Only for non-admin dashboard views)*/}
      {showMobile && !(isAdmin && isAdminURL) && (
        <div
          className={`w-full md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"} mt-15 bg-cyan-100`}
          onClick={handleOpenMenu} // click outside closes
        >
          <div className="w-full md:hidden flex flex-col items-start gap-6 py-6 mx-6">
            {!isAdmin && (
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
            )}

            <div className="flex gap-3">
              {/* Check if user present or not, to change UI */}
              {user ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 shadow">
                    <button
                      type="button"
                      className="text-black cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent bubbling

                        handleSettingClick();
                      }}
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
          className={`flex flex-col shadow absolute md:top-17 md:right-23 ${isAdmin ? "justify-end items-end max-sm:left-13 top-29" : " max-sm:left-13 top-65 justify-start items-start"} bg-white min-w-62.5 p-1.5 z-50 ${
            userSetting ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full flex flex-col py-1.5 px-2 space-y-1 hover:bg-gray-200 transition-colors duration-300">
            <p className="text-gray-500 font-medium">Logged As</p>
            <p className="text-gray-800 text-base text-nowrap w-full font-medium">
              {user?.user?.email}
            </p>
          </div>

          {user?.user?.role === "employer" && (
            <>
              <Link
                to={"/my-jobs"}
                onClick={handleCloseAll}
                className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
              >
                View Jobs
              </Link>

              <Link
                to={"/applications/apply-jobs"}
                onClick={handleCloseAll}
                className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
              >
                View Jobs Applied
              </Link>
            </>
          )}

          {user?.user?.role === "user" && (
            <>
              <Link
                to={"/my-favorite-jobs"}
                onClick={handleCloseAll}
                className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
              >
                Favourite Jobs
              </Link>

              <Link
                to={"/applications/apply-jobs"}
                onClick={handleCloseAll}
                className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
              >
                My Apply Job
              </Link>
            </>
          )}

          {user?.user?.role === "admin" && (
            <>
              <Link
                to={"/admin/dashboard"}
                onClick={handleCloseAll}
                className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
              >
                Dashboard
              </Link>
            </>
          )}

          <Link
            to={"/profiles"}
            onClick={handleCloseAll}
            className="text-nowrap text-base hover:bg-gray-200 transition-colors duration-300 w-full py-1.5 px-2 cursor-pointer"
          >
            {/* <LiaUserLockSolid size={28} /> */}
            Go to Setting
          </Link>
          <hr className="text-gray-300 w-56.25 mx-auto" />
          <button
            type="button"
            className="px-2 py-1.5 cursor-pointer w-full bg-cyan-400 my-2 rounded-md text-white hover:bg-cyan-500 transition-colors ease-linear duration-300"
            onClick={() => {
              handleLogout();
              handleCloseAll();
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
