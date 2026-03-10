import React, { useEffect, useState } from "react";
import logoImage from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const NavBar = ({ isOpen, handleOpenMenu }) => {

  const [isVisible, setIsVisible] = useState(false);  
  const location = useLocation();

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

  const showMobile = isOpen || isVisible;

  const menuLists = [
    {
      id: 1, name: "Jobs", path: "/",
    },
    {
      id: 2, name: "Companies", path: "/companies"
    },
    {
      id: 3, name: "Blogs", path: "/blogs"
    }
  ];

  return (
    <header className="w-full container mx-auto">
      <div className="flex justify-between items-center min-h-16">
        {/* Logo */}
        <img src={logoImage} alt="logo" className="w-36 object-contain" />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 ">
            {
              menuLists.map((menu) => (
                <li 
                  key={menu.id} 
                  className={`font-semibold text-base hover:text-gray-500 transition-colors ease-in-out duration-300 ${location.pathname === menu.path ? "underline underline-offset-4" : ""}`}
                >
                  <Link to={`${menu.path}`}>{menu.name}</Link>
                </li>
              ))
            }
          </ul>

          <div className="flex gap-3">
            <button className="border px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:border-cyan-400 cursor-pointer">
              Sign in
            </button>

            <button className="bg-black text-white px-3 py-1 rounded-md transition-all ease-in-out duration-300 hover:bg-black/80 cursor-pointer">
              Sign up
            </button>
          </div>
        </div>

        {/* Mobile Button */}
        {
          !isOpen ? (<button
          className="md:hidden flex text-2xl max-sm:mx-2 cursor-pointer"
          onClick={handleOpenMenu}
        >
          <GiHamburgerMenu size={24}/>
        </button>) : (
            <button
            onClick={handleOpenMenu}
            className="max-sm:mx-2 cursor-pointer"
          >
            <MdOutlineCancel size={24}/>
          </button>
          )
        }
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div 
          className={`w-full md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"} mt-15 bg-cyan-100`}
          onClick={handleOpenMenu} // click outside closes
        >

          <div className="w-full md:hidden flex flex-col items-start gap-6 py-6 mx-6">
            <ul className="flex flex-col gap-6 font-semibold">
              {
                menuLists.map((menu) => (
                  <li 
                    key={menu.id} 
                    className={`font-semibold text-base hover:text-gray-500 transition-colors ease-in-out duration-300 ${location.pathname === menu.path ? "underline underline-offset-4" : ""}`}
                  >
                    <Link to={`${menu.path}`}>{menu.name}</Link>
                  </li>
                ))
              }
            </ul>
            <button className="border px-4 py-1 rounded-md">Sign in</button>
            <button className="bg-black text-white px-4 py-1 rounded-md">
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
