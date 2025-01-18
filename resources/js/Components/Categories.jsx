
import { createContext, useContext, useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

const CategoriesContext = createContext();

const Categories = ({ children }) => {
    return (
        <CategoriesContext.Provider>
            <div className="relative">{children}</div>
        </CategoriesContext.Provider>
    );
};


const Selection = ({
        className = "",
        handleSelectedCategories,
        categories = [],
        availableCategories = [],
        ...props
    }) => {
        // Check if a size is already selected
        const isCategorieselected = (size) =>
        categories.some((selectedCategories) => selectedCategories.category_name === size.category_name);
    
        // Handle selecting a size
        const handleSelect = (option) => {
            if (!isCategorieselected(option)) {
                handleSelectedCategories(option); // Add the size
            }
        };
    
        // Handle removing a selected size
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedCategories(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Categories Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.category_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the size
                            aria-label={`Remove ${item.category_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Categories Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableCategories.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the size
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isCategorieselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isCategorieselected(option)} // Disable if already selected
                    >
                        {option.category_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };
  
    const EditSelection = ({
        className = "",
        handleSelectedCategories,
        categories = [],
        availableCategories = [],
        ...props
    }) => {
        // Check if a size is already selected
        const isCategorieselected = (size) =>
        categories.some((selectedCategories) => selectedCategories.category_name === size.category_name);
    
        // Handle selecting a size
        const handleSelect = (option) => {
            if (!isCategorieselected(option)) {
                handleSelectedCategories(option); // Add the size
            }
        };
    
        // Handle removing a selected size
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedCategories(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Categories Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.category_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the size
                            aria-label={`Remove ${item.category_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Categories Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableCategories.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the size
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isCategorieselected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isCategorieselected(option)} // Disable if already selected
                    >
                        {option.category_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };

Categories.Selection = Selection;
Categories.EditSelection = EditSelection;

export default Categories;
