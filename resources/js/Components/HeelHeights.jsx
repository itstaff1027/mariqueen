
import { createContext, useContext, useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

const HeelHeightsContext = createContext();

const HeelHeights = ({ children }) => {
    return (
        <HeelHeightsContext.Provider>
            <div className="relative">{children}</div>
        </HeelHeightsContext.Provider>
    );
};


const Selection = ({
        className = "",
        handleSelectedHeelHeights,
        heelHeights = [],
        availableHeelHeights = [],
        ...props
    }) => {
        // Check if a value is already selected
        const isHeelHeightselected = (value) =>
        heelHeights.some((selectedHeelHeights) => selectedHeelHeights.value === value.value);
    
        // Handle selecting a value
        const handleSelect = (option) => {
            if (!isHeelHeightselected(option)) {
                handleSelectedHeelHeights(option); // Add the value
            }
        };
    
        // Handle removing a selected value
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedHeelHeights(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected HeelHeights Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {heelHeights.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.value}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the value
                            aria-label={`Remove ${item.value}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available HeelHeights Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableHeelHeights.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the value
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isHeelHeightselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isHeelHeightselected(option)} // Disable if already selected
                    >
                        {option.value}
                    </button>
                ))}
            </div>
        </div>
        );
    };

    const EditSelection = ({
        className = "",
        handleSelectedHeelHeights,
        heelHeights = [],
        availableHeelHeights = [],
        ...props
    }) => {
        // Check if a value is already selected
        const isHeelHeightselected = (value) =>
        heelHeights.some((selectedHeelHeights) => selectedHeelHeights.value === value.value);
    
        // Handle selecting a value
        const handleSelect = (option) => {
            if (!isHeelHeightselected(option)) {
                handleSelectedHeelHeights(option); // Add the value
            }
        };
    
        // Handle removing a selected value
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedHeelHeights(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected HeelHeights Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {heelHeights.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.value}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the value
                            aria-label={`Remove ${item.value}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available HeelHeights Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableHeelHeights.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the value
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isHeelHeightselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isHeelHeightselected(option)} // Disable if already selected
                    >
                        {option.value}
                    </button>
                ))}
            </div>
        </div>
        );
    };
  

HeelHeights.Selection = Selection;
HeelHeights.EditSelection = EditSelection;

export default HeelHeights;
