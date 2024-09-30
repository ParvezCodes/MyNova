import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/infomanav.svg";

const Navbar = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to="/keep/Nova_Helper"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <img src={logo} alt="" />
        </Link>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link to="/keep/Nova_Helper" className="mr-5 hover:text-white">
            SearchTS
          </Link>
          <Link to="/keep/Nova_Helper/search" className="mr-5 hover:text-white">
            SearchDB
          </Link>
          {/* <Link
            to="/keep/Nova_Helper/searchTS"
            className="mr-5 hover:text-white"
          >
            TypeSense
          </Link> */}
          <Link to="/keep/Nova_Helper/isin" className="mr-5 hover:text-white">
            ISIN
          </Link>
          <Link
            to="/keep/Nova_Helper/prodCPlambdaCP"
            className="mr-5 hover:text-white"
          >
            CP
          </Link>
          <Link to="/keep/Nova_Helper/fixts" className="mr-5 hover:text-white">
            UpdateTS
          </Link>
          <Link
            to="/keep/Nova_Helper/merlinTonova"
            className="mr-5 hover:text-white"
          >
            MerlinToNova
          </Link>
          <Link
            to="/keep/Nova_Helper/mismatchReports"
            className="mr-5 hover:text-white"
          >
            Mismatch Report
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
