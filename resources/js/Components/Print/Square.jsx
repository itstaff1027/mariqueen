import React, { useRef, useState, useEffect } from 'react';

const Square = ({ onClose, order }) => {
    const [logoBase64, setLogoBase64] = useState('');
    const contentRef = useRef();
  
    // Convert the image to Base64 when the component mounts
    useEffect(() => {
      fetch(`storage/assets/jojoBragaisWW.png`)
        .then((response) => response.blob())
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

    doc.html(contentRef.current, {
        callback: (doc) => doc.save(`SalesOrder_${order.order_number}.pdf`),
        x: 10,
        y: 10,
        width: 500,
    });
  };

  return (
      <div
          style={{
              position: 'fixed',
              inset: 0,
              // display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 50,
          }}
          className="overflow-auto"
      >
          <div
              style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  width: '90%',
                  maxWidth: '600px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
          >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                      onClick={onClose}
                      style={{
                          color: 'red',
                          fontSize: '14px',
                          border: 'none',
                          background: 'none',
                      }}
                  >
                      Close
                  </button>
              </div>

              <div
                  ref={contentRef}
                  style={{
                      padding: '20px',
                      color: '#000',
                      fontSize: '12pt',
                      backgroundColor: '#fff',
                  }}
              >
                  {/* Header with logo and sale date */}
                  <div className="grid grid-cols-2">
                      {logoBase64 ? (
              <img
                src={logoBase64}
                alt="Logo"
                style={{ maxWidth: "180px", marginBottom: "10px" }}
              />
            ) : (
              <h1 style={{ fontSize: "16pt", fontWeight: "bold" }}>Your Company Logo</h1>
            )}
                      <div className="w-full text-right">
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Closed Sale Date:{' '}
                              <u>
                                  {new Date(
                                      order.created_at,
                                  ).toLocaleDateString()}
                              </u>
                          </h2>
                          {/* Order and Agent Details */}
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Order #<u>{order.order_number}</u>
                          </h2>
                      </div>
                  </div>

                  {/* Courier Name Banner */}
                  <div
                      style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          textAlign: 'center',
                          padding: '10px 0',
                          marginBottom: '20px',
                      }}
                  >
                      <h1 style={{ fontSize: '24pt', margin: 0 }}>
                          {order.courier.name}
                      </h1>
                  </div>

                  {/* Customer and Status Details */}
                  <div className="mb-[15px] flex flex-col border border-black p-4">
                      <div
                          style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}
                      >
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Customer:{' '}
                              <u>
                                  {order.customers.first_name}{' '}
                                  {order.customers.last_name}
                              </u>
                          </h2>
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Status: <u>{order.status}</u>
                          </h2>
                      </div>
                      <div
                          style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                          }}
                      >
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Mobile #: <u>{order.customers.phone}</u>
                          </h2>
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                              Warehouse: <u>{order.warehouse.name}</u>
                          </h2>
                      </div>
                  </div>

                  <hr style={{ margin: '12px 0', border: '1px solid #000' }} />

                  {/* Warehouse Banner */}
                  {/* <div
            style={{
              backgroundColor: "#000",
              color: "#fff",
              textAlign: "center",
              padding: "10px 0",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ fontSize: "24pt", margin: 0 }}>{order.warehouse.name}</h1>
          </div> */}

                  {/* Order Details Section */}
                  <div
                      style={{
                          border: '2px solid #000',
                          textAlign: 'center',
                          padding: '10px',
                          marginBottom: '10px',
                      }}
                  >
                      <h1 style={{ fontSize: '20pt', margin: 0 }}>
                          ORDER DETAILS
                      </h1>
                  </div>
                  <hr style={{ margin: '12px 0', border: '1px solid #000' }} />

                  <table
                      className="border border-black"
                      style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginBottom: '20px',
                      }}
                  >
                      <thead>
                          <tr>
                              <th
                                  style={{
                                      borderBottom: '1px solid #000',
                                      padding: '8px',
                                      textAlign: 'left',
                                  }}
                              >
                                  SKU
                              </th>
                              <th
                                  style={{
                                      borderBottom: '1px solid #000',
                                      padding: '8px',
                                      textAlign: 'left',
                                  }}
                              >
                                  Items
                              </th>
                              <th
                                  style={{
                                      borderBottom: '1px solid #000',
                                      padding: '8px',
                                      textAlign: 'center',
                                  }}
                              >
                                  Qty
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {order.items.map((item, index) => (
                              <tr key={index}>
                                  <td
                                      style={{
                                          padding: '8px',
                                          borderBottom: '1px solid #000',
                                          textAlign: 'center',
                                      }}
                                  >
                                      {item.product_variant.sku}
                                  </td>
                                  <td
                                      style={{
                                          padding: '8px',
                                          borderBottom: '1px solid #000',
                                      }}
                                  >
                                      {
                                          item.product_variant.product
                                              .product_name
                                      }{' '}
                                      {item.product_variant.colors.color_name}{' '}
                                      SIZE{' '}
                                      {parseInt(
                                          item.product_variant.size_values
                                              .size_values,
                                      )}{' '}
                                      IN{' '}
                                      {item.product_variant.heel_heights.value}{' '}
                                      INCHES
                                  </td>
                                  <td
                                      style={{
                                          padding: '8px',
                                          borderBottom: '1px solid #000',
                                          textAlign: 'center',
                                      }}
                                  >
                                      {item.quantity}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

                  <div className="w-full border border-black p-2" style={{ fontWeight: 'bold' }}>Packaging Type: {order.packaging_type?.packaging_name}</div>
                  <div className="w-full border border-black p-2" style={{ fontWeight: 'bold' }}>Shipping Cost: {order.shipping_cost} - Shoulder By: {order.shoulder_by}</div>
                  <div className="w-full border border-black p-2" style={{ fontWeight: 'bold' }}>Remarks: {order.remarks}</div>

                  {/* Customer Details Section */}
                  <div style={{ marginBottom: '20px' }}>
                      <div
                          style={{
                              backgroundColor: '#000',
                              color: '#fff',
                              textAlign: 'center',
                              padding: '10px',
                          }}
                      >
                          <h1 style={{ fontSize: '20pt', margin: 0 }}>
                              CUSTOMER DETAILS
                          </h1>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                          <h2
                            className="w-full border border-black p-2"
                              style={{
                                  fontSize: '14pt',
                                  fontWeight: 'bold',
                                  border: '1px solid #000',
                              }}
                          >
                              Receiver: {order.customers.phone}
                          </h2>
                          <h2
                            className="w-full border border-black p-2"
                              style={{
                                  fontSize: '14pt',
                                  fontWeight: 'bold',
                                  border: '1px solid #000',
                              }}
                          >
                              Mobile #: {order.customers.phone}
                          </h2>
                          <h2
                             className="w-full border border-black p-2"
                              style={{
                                  fontSize: '14pt',
                                  fontWeight: 'bold',
                                  border: '1px solid #000',
                              }}
                          >
                              Address: {order.customers.address}
                          </h2>
                          <h2
                           className="w-full border border-black p-2"
                              style={{
                                  fontSize: '14pt',
                                  fontWeight: 'bold',
                                  border: '1px solid #000',
                              }}
                          >
                              SOCMED: {order.customers.social_media_account}
                          </h2>
                      </div>
                  </div>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                      onClick={downloadPDF}
                      style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                      }}
                  >
                      Download PDF
                  </button>
              </div>
          </div>
      </div>
  );
};

export default Square;
