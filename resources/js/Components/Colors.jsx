
import { createContext, useContext, useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

const ColorsContext = createContext();

const Colors = ({ children }) => {
    return (
        <ColorsContext.Provider>
            <div className="relative">{children}</div>
        </ColorsContext.Provider>
    );
};


    const Selection = ({
        className = "",
        handleSelectedColor,
        colors = [],
        availableColors = [],
        ...props
    }) => {
        // Check if a color is already selected
        const isColorSelected = (color) =>
        colors.some((selectedColor) => selectedColor.color_name === color.color_name);
    
        // Handle selecting a color
        const handleSelect = (option) => {
            if (!isColorSelected(option)) {
                handleSelectedColor(option); // Add the color
            }
            };
    
        // Handle removing a selected color
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedColor(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Colors Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {colors.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.color_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the color
                            aria-label={`Remove ${item.color_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Colors Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableColors.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the color
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isColorSelected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isColorSelected(option)} // Disable if already selected
                    >
                        {option.color_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };
  
  
  
  
    const EditSelection = ({
        className = "",
        handleSelectedColor,
        colors = [],
        availableColors = [],
        ...props
    }) => {
        // Check if a color is already selected
        const isColorSelected = (color) =>
        colors.some((selectedColor) => selectedColor.color_name === color.color_name);
    
        // Handle selecting a color
        const handleSelect = (option) => {
            if (!isColorSelected(option)) {
                handleSelectedColor(option); // Add the color
            }
            };
    
        // Handle removing a selected color
        const handleRemove = (e, item) => {
            e.preventDefault();
            handleSelectedColor(item, true); // Pass 'true' to indicate removal
        };
    
        return (
        <div className={`w-full relative ${className}`}>
            {/* Selected Colors Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {colors.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                        {item.color_name}
                        <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={(e) => handleRemove(e, item)} // Remove the color
                            aria-label={`Remove ${item.color_name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
    
            {/* Available Colors Section */}
            <div className="grid grid-cols-4 gap-4">
                {availableColors.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option)} // Add the color
                        className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                            isColorSelected(option)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-100 hover:border-blue-400"
                        }`}
                        disabled={isColorSelected(option)} // Disable if already selected
                    >
                        {option.color_name}
                    </button>
                ))}
            </div>
        </div>
        );
    };
    

const OrderTypes = ({ className = '', handleSelectedOrderTypes, colorName='', colorValueIds=0, selectedOrderTypes, filteredOptions, isHidden=Boolean, ...props }) => {

  return (
      <div 
          {...props}
          className={`items-center justify-center w-full` + className}
      >
        <h1>Choose Color - Order Type</h1>
        <div className="flex flex-wrap gap-2 mb-2">
                {selectedOrderTypes.name === null ? <h1>None</h1> : (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center">

                          {selectedOrderTypes.name}
                        {/* <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveColor(item)} // Pass the whole item for removal
                        >
                            ×
                        </button> */}
                    </span>
                )}
            </div>
        {filteredOptions?.length > 0 && (
          <Dropdown className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg z-10">
              <Dropdown.Trigger>
                  <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                  >
                      Select Order Type
                  </button>
              </Dropdown.Trigger>
              <Dropdown.Content>
              {filteredOptions// Exclude selected options
                  .map((option, index) => (
                      <div
                          key={index}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectedOrderTypes(option.id)}
                      >
                          {option.name}
                      </div>
                  ))}
              </Dropdown.Content>
          </Dropdown>
        )}

      </div>
  );
}


const AdvancedDropdown = () => {
    const [options] = useState(["Option 1", "Option 2", "Option 3", "Option 4"]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
  
      // Filter options based on input
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    };
  
    const handleSelect = (option) => {
      if (!selectedItems.includes(option)) {
        setSelectedItems([...selectedItems, option]);
      }
      setInputValue(""); // Clear input after selection
      setFilteredOptions(options); // Reset options
    };
  
    const handleRemove = (item) => {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    };
  
    return (
      <div className="w-72 relative">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center"
            >
              {item}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemove(item)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type to search or select"
          value={inputValue}
          onChange={handleInputChange}
        />
        <ul className="absolute mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    );
  };

Colors.Selection = Selection;
Colors.OrderTypes = OrderTypes;
Colors.EditSelection = EditSelection;
Colors.Advance = AdvancedDropdown;

export default Colors;
