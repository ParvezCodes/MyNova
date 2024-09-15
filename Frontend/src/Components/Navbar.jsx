import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/infomanav.svg";

const Navbar = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <img src={logo} alt="" />
        </Link>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link to="/" className="mr-5 hover:text-white">
            TypeSense
          </Link>
          <Link to="/search" className="mr-5 hover:text-white">
            Search
          </Link>
          <Link to="/isin" className="mr-5 hover:text-white">
            ISIN
          </Link>
          <Link to="/prodCPlambdaCP" className="mr-5 hover:text-white">
            CP
          </Link>
          <Link to="/SingleShariahStatus" className="mr-5 hover:text-white">
           ComplientStatus
          </Link>
        </nav>
        <button className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
          Button
        </button>
      </div>
    </header>
  );
};

export default Navbar;
