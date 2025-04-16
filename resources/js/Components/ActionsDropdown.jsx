import React, { useState } from 'react';

const ActionsDropdown = ({ states, onSelectStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown open/closed
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  // Handle an action click: log, optionally bubble to parent, and close dropdown.
  const handleActionClick = (status) => {
    if (onSelectStatus) {
      onSelectStatus(status);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        id="actions-menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Actions
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 3a1 1 0 01.894.553l3.5 7a1 1 0 01-.062.923A1 1 0 0113.5 12H6.5a1 1 0 01-.732-1.62l3.5-7A1 1 0 0110 3zm0 2.382L8.118 9h3.764L10 5.382zM10 14a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Only show dropdown options if isOpen is true */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="actions-menu">
            {states && states.length > 0 ? (
              states.map((status, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(status)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {status}
                </button>
              ))
            ) : (
              <span className="block w-full text-left px-4 py-2 text-sm text-gray-700">
                No actions available
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
