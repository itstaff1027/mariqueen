import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Colors from "@/Components/Colors";
import Sizes from "@/Components/Sizes";
import HeelHeights from "@/Components/HeelHeights";
import Categories from "@/Components/Categories";

const ViewProductVariant = ({
  product_variant,
  stock_per_warehouse,
}) => {
  const { data, setData, put, errors } = useForm({
    product_name: product_variant.product.product_name || "",
    status: product_variant.product.status || "",
    cost: product_variant.product.cost || 0,
    srp: product_variant.product.srp || 0,
    colors: product_variant.product.colors || [],
    sizes: product_variant.product.sizes || [],
    heel_heights: product_variant.product.heel_heights || [],
    categories: product_variant.product.categories || [],
    product_sku: product_variant.sku || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/inventory/products/${product_variant.id}`);
  };

  useEffect(() => {
    console.log(product_variant);
    console.log(stock_per_warehouse);
  }, []);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          View Product Variant
        </h2>
      }
    >
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-md rounded-lg">
            <div className="p-6">
              <div className="container mx-auto p-6">
                {/* Product Information */}
                <h1 className="text-3xl font-bold mb-6 text-gray-900">
                  Product Variant Details
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">SKU:</h2>
                    <p className="text-gray-700">{product_variant.sku}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Model:</h2>
                    <p className="text-gray-700">
                      {product_variant.product.product_name}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Color:</h2>
                    <p className="text-gray-700">
                      {product_variant.colors.color_name}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Size:</h2>
                    <p className="text-gray-700">
                      {product_variant.size_values.size_values}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Heel Height:</h2>
                    <p className="text-gray-700">
                      {product_variant.heel_heights.value} inches
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Category:</h2>
                    <p className="text-gray-700">
                      {product_variant.categories.category_name}
                    </p>
                  </div>
                </div>

                {/* Stock Per Warehouse - ID Card Design */}
                <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900">
                  Stock Per Warehouse - NEED LAGYAN NG DETAILS PAG CLICK NG WAREHOUSE DAPAT MAKITA YUNG TRANSACTION HISTORY
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stock_per_warehouse.length > 0 ? (
                    stock_per_warehouse.map((stocks, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-300 rounded-lg shadow-md p-6 flex flex-col items-center text-center"
                      >
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
                          W-{stocks.warehouse_id}
                        </div>
                        <h2 className="text-lg font-bold mt-4">
                            {stocks.warehouse.name}
                        </h2>
                        <div className="w-full mt-4">
                          <p className="text-gray-700">
                            <span className="font-semibold">Remaining Stocks:</span>{" "}
                            {stocks.total_stock}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Purchased:</span>{" "}
                            {stocks.total_purchased}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Sold:</span>{" "}
                            {stocks.total_sold}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Transfers In:</span>{" "}
                            {stocks.total_transfer_in}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Transfers Out:</span>{" "}
                            {stocks.total_transfer_out}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Returns:</span>{" "}
                            {stocks.total_return}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Adjustments:</span>{" "}
                            {stocks.total_adjustment}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Corrections:</span>{" "}
                            {stocks.total_correction}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Repairs:</span>{" "}
                            {stocks.total_repair}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 col-span-3">
                      No stock data available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ViewProductVariant;
