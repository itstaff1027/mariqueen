import React, { useState, useEffect } from 'react';

const ProductFilters = ({ filters, onFilterChange, search, onSearchChange, colors, sizes, heelHeights, sizeValues, categories }) => {
    // Local state for debounced search
    const [localSearch, setLocalSearch] = useState(search);
    const [localFilters, setLocalFilters] = useState(filters);

    // Sync local state when parent search prop changes
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters])

    // Debounce calling onSearchChange
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(localSearch);
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [localSearch, onSearchChange]);

    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange(localFilters);
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [localFilters, onFilterChange]);

    return (
        <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <select
                value={localFilters.category || ''}
                className="rounded-md border p-2 shadow-sm focus:outline-none"
                onChange={(e) =>
                    setLocalFilters({
                        ...localFilters,
                        category: e.target.value || null,
                    })
                }
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.category_name}>
                        {cat.category_name}
                    </option>
                ))}
            </select>

            <select
                value={localFilters.size || ''}
                className="rounded-md border p-2 shadow-sm focus:outline-none"
                onChange={(e) =>
                    setLocalFilters({
                        ...localFilters,
                        size: e.target.value || null,
                    })
                }
            >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                    <option key={size.id} value={size.size_name}>
                        {size.size_name}
                    </option>
                ))}
            </select>

            <select
                value={localFilters.size_values || ''}
                className="rounded-md border p-2 shadow-sm focus:outline-none"
                onChange={(e) =>
                    setLocalFilters({
                        ...localFilters,
                        size_values: e.target.value || null,
                    })
                }
            >
                <option value="">Size Values</option>
                {sizeValues.map((size_value) => (
                    <option key={size_value.id} value={size_value.size_values}>
                        {size_value.size_values}
                    </option>
                ))}
            </select>

            <select
                value={localFilters.heelHeight || ''}
                className="rounded-md border p-2 shadow-sm focus:outline-none"
                onChange={(e) =>
                    setLocalFilters({
                        ...localFilters,
                        heelHeight: e.target.value || null,
                    })
                }
            >
                <option value="">All Heel Heights</option>
                {heelHeights.map((height) => (
                    <option key={height.id} value={height.value}>
                        {height.value}
                    </option>
                ))}
            </select>

            <select
                value={localFilters.color || ''}
                className="rounded-md border p-2 shadow-sm focus:outline-none"
                onChange={(e) =>
                    setLocalFilters({
                        ...localFilters,
                        color: e.target.value || null,
                    })
                }
            >
                <option value="">All Colors</option>
                {colors.map((color) => (
                    <option key={color.id} value={color.color_name}>
                        {color.color_name}
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Search for a product..."
                className="w-full rounded-md border p-2 shadow-sm focus:outline-none"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
        </div>
    );
};

export default ProductFilters;
