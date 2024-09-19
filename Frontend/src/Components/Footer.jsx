import React from "react";
import logo from "../assets/infomanav.svg";
import { FaEarthAmericas } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
        <Link to="https://www.infomanav.com/">
          <img className="w-auto h-7" src={logo} alt="" />
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          © Copyright 2025. All Rights Reserved.
        </p>

        <div className="flex -mx-2">
          <Link
            to="https://www.infomanav.com"
            className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Reddit"
          >
            <FaEarthAmericas />
          </Link>

          <Link
            to="https://www.infomanav.com"
            className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Facebook"
          >
            <FaEarthAmericas />
          </Link>

          <Link
            to="https://www.infomanav.com"
            className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Github"
          >
            <FaEarthAmericas />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
