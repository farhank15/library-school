import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ title, links }) => {
  return (
    <div className="h-screen bg-gray-800 text-white w-64">
      {/* Sidebar Header */}
      <div className="p-4 text-center border-b border-gray-700">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-4">
        {links.map((link, index) => (
          <li key={index} className="px-4 py-2 hover:bg-gray-700">
            <Link to={link.path} className="flex items-center space-x-2">
              {link.icon && <span>{link.icon}</span>}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
