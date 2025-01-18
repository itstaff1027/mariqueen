
import { createContext, useContext, useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

const SizesContext = createContext();

const Sizes = ({ children }) => {
    return (
        <SizesContext.Provider>
            <div className="relative">{children}</div>
        </SizesContext.Provider>
    );
};


const Selection = ({
        className = "",
        handleSelectedSizes,
        sizes = [],
        availableSizes = [],
        ...props
    }) => {
        // Check if a size is already selected
        const isSizeselected = (size) =>
        sizes.some((selectedSizes) => selectedSizes.size_name === size.size_name);
    
        // Handle selecting a size
        const handleSelect = (option) => {
            if (!isSizeselected(option)) {
                handleSelectedSizes(option); // Add the size
            }
        };
    
        // Handle removing a selected size
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedSizes(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Sizes Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {sizes.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.size_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the size
                            aria-label={`Remove ${item.size_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Sizes Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableSizes.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the size
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isSizeselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isSizeselected(option)} // Disable if already selected
                    >
                        {option.size_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };

    const EditSelection = ({
        className = "",
        handleSelectedSizes,
        sizes = [],
        availableSizes = [],
        ...props
    }) => {
        // Check if a size is already selected
        const isSizeselected = (size) =>
        sizes.some((selectedSizes) => selectedSizes.size_name === size.size_name);
    
        // Handle selecting a size
        const handleSelect = (option) => {
            if (!isSizeselected(option)) {
                handleSelectedSizes(option); // Add the size
            }
        };
    
        // Handle removing a selected size
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedSizes(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Sizes Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {sizes.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.size_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the size
                            aria-label={`Remove ${item.size_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Sizes Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableSizes.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the size
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isSizeselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isSizeselected(option)} // Disable if already selected
                    >
                        {option.size_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };
  

Sizes.Selection = Selection;
Sizes.EditSelection = EditSelection;

export default Sizes;
