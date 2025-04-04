import React, { useRef, useState, useEffect } from 'react';

const OnlineReceipt = ({ onClose, order }) => {
  const [logoBase64, setLogoBase64] = useState('');
  const contentRef = useRef(null);

  // Convert the image to Base64 when the component mounts
  useEffect(() => {
    // Assuming your image is stored in the public folder under /storage/assets/
    fetch(`/storage/assets/jojoBragaisWW.png`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => console.error("Error loading image:", error));
  }, []);

  const downloadPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
  
    const margin = 10; // Adjust this margin as needed
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentElement = contentRef.current;
    const contentWidth = contentElement.offsetWidth;
  
    // Calculate a scale factor to shrink your content to fit the page width (accounting for margins)
    const scaleFactor = (pageWidth - margin * 2) / contentWidth;
  
    doc.html(contentElement, {
      x: margin,
      y: margin,
      // Pass the scale factor to html2canvas so the content is rendered at the correct size
      html2canvas: { useCORS: true, scale: scaleFactor },
      callback: (doc) => {
        doc.save(`SalesOrder_${order.order_number}.pdf`);
      },
    });
  };
  

  return (
    <div
    className="w-full"
    style={{
      position: "fixed",
      inset: 0,
    //   display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 50,
      overflowY: "auto", // added for scrolling
    }}
    >
      <div
            style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                // maxWidth: "600px",
                // width: "90%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                margin: "20px", // margin for breathing room on small screens
              }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              color: "red",
              fontSize: "14px",
              border: "none",
              background: "none",
            }}
          >
            Close
          </button>
        </div>

        <div
          ref={contentRef}
          style={{
            padding: "20px",
            color: "#000",
            fontSize: "12pt",
            backgroundColor: "#fff",
          }}
        >
          <div className="container mx-auto p-6">
            {/* Logo (if loaded) */}
            {logoBase64 && (
              <div className="flex justify-center mb-4">
                <img
                  src={logoBase64}
                  alt="Logo"
                  style={{ maxWidth: "150px", marginBottom: "10px" }}
                />
              </div>
            )}

            <div className="flex w-full flex-col items-center justify-center p-10">
              <div className="grid w-full grid-cols-2 border-b-2">
                <h1 className="w-full text-left text-3xl font-bold">
                  {/* Order Date: {formatDate(order.created_at)} */}
                </h1>
                <h1 className="w-full text-right text-3xl font-bold">
                  Status: {order.status.toUpperCase()}
                </h1>
              </div>

              <div className="grid grid-cols-2 w-full">
                <h1 className="text-2xl font-bold w-full text-left">
                  Courier: <u>{order.courier.name.toUpperCase()}</u>
                </h1>
                <h1 className="text-2xl font-bold w-full text-right">
                  Packaging Type:{" "}
                  <u>{order.packaging_type.packaging_name.toUpperCase()}</u>
                </h1>
              </div>
              <div className="grid grid-cols-2 w-full">
                <h1 className="text-2xl font-bold w-full text-left">
                  Shoulder By: <u>{order.shoulder_by.toUpperCase()}</u>
                </h1>
              </div>

              <div className="my-4 w-full">
                <h2 className="mb-2 text-xl font-semibold">Order Items</h2>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">SKU</th>
                      <th className="border px-4 py-2 text-right">
                        Quantity
                      </th>
                      <th className="border px-4 py-2 text-right">
                        Unit Price
                      </th>
                      <th className="border px-4 py-2 text-right">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="border px-4 py-2">
                            {item.product_variant.sku}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            {item.quantity}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            P {parseFloat(item.unit_price).toFixed(2)}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            P {parseFloat(item.total_price).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="border px-4 py-2 text-center"
                          colSpan="5"
                        >
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex w-full flex-col items-end justify-end border-t pt-4">
                <h2 className="mb-2 text-xl font-semibold">Order Summary</h2>
                <p className="text-gray-700">
                  Subtotal: P {parseFloat(order.total_amount).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  VATables: P 
                  {parseFloat(order.total_amount / 1.12).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  VAT: P 
                  {parseFloat((order.total_amount / 1.12) * 0.12).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  Shipping Cost: P {parseFloat(order.shipping_cost).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  Rush Order Fee: P 
                  {parseFloat(order.rush_order_fee).toFixed(2)}
                </p>
                <p className="font-bold text-2xl text-gray-700">
                  Grand Total: P {parseFloat(order.grand_amount).toFixed(2)}
                </p>
              </div>

              <div className="w-full mb-4">
                <p className="text-l font-bold w-full">
                  Packaging Type Description:{" "}
                  <u>{order.packaging_type.description}</u>
                </p>
              </div>

              <div className="mb-4 w-full">
                <h2 className="mb-2 text-xl font-semibold">
                  Payment Information
                </h2>
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">
                        Payment Method
                      </th>
                      <th className="border px-4 py-2 text-left">
                        Amount Paid
                      </th>
                      <th className="border px-4 py-2 text-left">
                        Change Due
                      </th>
                      <th className="border px-4 py-2 text-right">Excess</th>
                      <th className="border px-4 py-2 text-right">
                        Balance
                      </th>
                      <th className="border px-4 py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments && order.payments.length > 0 ? (
                      order.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="border px-4 py-2">
                            {payment.payment_method.name}
                          </td>
                          <td className="border px-4 py-2">
                            P {payment.amount_paid}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            P {payment.change_due}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            P {payment.excess_amount}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            P {payment.remaining_balance}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            {/* Payment date can be formatted here */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="border px-4 py-2 text-center"
                          colSpan="5"
                        >
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="w-full p-4">
                <h2 className="mb-2 text-xl font-semibold">
                  Customer Information
                </h2>
                {order.customers ? (
                  <div>
                    <p className="text-gray-700">
                      {order.customers.first_name}{" "}
                      {order.customers.last_name}
                    </p>
                    <p className="text-gray-700">
                      Email: {order.customers.email}
                    </p>
                    <p className="text-gray-700">
                      Phone: {order.customers.phone}
                    </p>
                    <p className="text-gray-700">
                      Address: {order.customers.address}
                    </p>
                    {order.customers.receiver_name && (
                      <p className="text-gray-700">
                        Receiver: {order.customers.receiver_name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700">
                    No customer information available.
                  </p>
                )}
              </div>

              <div className="w-full border-t pt-4">
                <h2 className="mb-2 text-xl font-semibold">
                  Remarks/Note:
                </h2>
                <div className="h-40 w-full rounded-xl border p-4">
                  {order.remarks}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={downloadPDF}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineReceipt;
