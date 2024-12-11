import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./logo";
import BtnOutline from "./btnOutline";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { useAuth } from "../context/useAuth";
import { RiArrowDownSFill } from "react-icons/ri";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown
  const navigate = useNavigate();
  

  const links = [
    { name: "Home", url: user? user?.role === "admin" ? "/dashboard": "/":"/" },
    user?.role == "student" ? { name: "Reviews", url: "/dashboard/my-quizzes" } :
      { name: "Features", url: "/" },
      user?.role == "student" && 
        { name: "Newsletters", url: "/dashboard/news-letters" },
      user?.role == "student" && 

        { name: "Solutions", url: "/dashboard/solutions" },
      
    { name: "About Us", url: "/about" }
  ].filter(Boolean);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex w-full items-center p-4 lg:px-24">
      <div className="flex items-center justify-between w-full border-b pb-3">
        <div><Logo /></div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center w-full max-w-4xl justify-between">
          <div className="flex items-center gap-5">
            {links.map((link, index) => (
              <Link key={index} to={link.url} className="mx-4 text-xl font-normal">
                {link.name}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center cursor-pointer text-primary" onClick={handleDropdownToggle}>
                <IoPersonSharp className="text-2xl" />
                <span className="ml-2 text-xl font-bold">{user.username}</span>
                <RiArrowDownSFill className="mt-1" size={25} />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md z-10">
                  <button onClick={handleLogout} className="block text-left px-4 py-2 w-full text-black hover:bg-gray-200">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <BtnOutline text="Login" css="hidden lg:block" handleClick={handleLogin} />
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-primary z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-end p-4">
          <FaTimes className="text-white text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        <div className="flex flex-col h-[calc(100%-80px)] justify-between">
          <div className="flex flex-col flex-1 items-start px-8">
            {links.map((link, index) => (
              <Link key={index} to={link.url} className="text-white text-xl font-normal py-4 w-full" onClick={toggleSidebar}>
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="text-white text-xl font-bold py-4 w-full flex items-center">
                <IoPersonSharp className="text-2xl" />
                <span className="ml-2">{user.username}</span>
              </div>
            ) : (
              <BtnOutline text="Login" css="text-white mt-4 w-full border-white" handleClick={handleLogin} />
            )}
          </div>
          {user && (
            <div className="flex items-center justify-center px-8">
              <button onClick={handleLogout} className="text-white text-xl font-normal text-center border-2 border-white p-4 w-full">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
