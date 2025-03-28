import React, { useRef } from 'react';

const Square = ({ onClose, order }) => {
  const contentRef = useRef();

  const downloadPDF = () => {
    // Access jsPDF from the global window object (assumes jsPDF and html2canvas are loaded via CDN)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Use doc.html() to render the printable content
    doc.html(contentRef.current, {
      callback: function (doc) {
        doc.save(`SalesOrder_${order.order_number}.pdf`);
      },
      x: 10,
      y: 10,
      width: 500, // Adjust if needed to fit your thermal printer page size
    });
  };

  return (
    <div
        style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 50,
        }}
    >
      <div
        style={{
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '4px',
            width: '90%',
            maxWidth: '600px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ color: 'red', fontSize: '14px' }}>
                Close
            </button>
        </div>
        <div
            ref={contentRef}
            style={{
                padding: '16px',
                color: '#000',
                fontSize: '12pt',
                backgroundColor: '#fff',
            }}
        >
            <h2 className="underline" style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '12px' }}>
                Closed Sale Date: {Date(order.created_at)}
            </h2>
            <div className="bg-black w-full flex justify-center items-center text-white text-4xl">
                <h1 className="mb-8">{order.courier.name}</h1>
            </div>
            <div className="flex justify-between">
                <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Order #{order.order_number}
                </h2>
                <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Agent: {order.user.name}
                </h2>
            </div>
            <div className="flex justify-between">
                <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Customer: {order.customers.first_name}{' '}
                    {order.customers.last_name}
                </h2>
                <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Status:{order.status}
                </h2>
            </div>

            <div className="flex justify-between">
                <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Telephone or Mobile #: {order.customers.phone}
                </h2>
                {/* <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' }}>
                    Status:{order.status}
                </h2> */}
            </div>
            
            <div className="bg-black w-full flex justify-center items-center text-white text-4xl">
                <h1 className="mb-8">{order.warehouse.name}</h1>
            </div>
            
          
            
            <div className="border border-black w-full mt-2 flex justify-center items-center text-xl">
                <h1 className="mb-4">ORDER DETAILS</h1>
            </div>
            <hr style={{ margin: '12px 0', border: '1px solid #000' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th
                        style={{
                            borderBottom: '1px solid #000',
                            padding: '4px 0',
                            textAlign: 'left',
                        }}
                    >
                        SKU
                    </th>
                    <th
                        style={{
                            borderBottom: '1px solid #000',
                            padding: '4px 0',
                            textAlign: 'left',
                        }}
                    >
                        Items
                    </th>
                    <th
                        style={{
                            borderBottom: '1px solid #000',
                            padding: '4px 0',
                            textAlign: 'center',
                        }}
                    >
                        Qty
                    </th>
                </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} className="text-lg">
                            <td
                                style={{
                                    padding: '4px 0',
                                    borderBottom: '1px solid #000',
                                    textAlign: 'center',
                                }}
                            >
                                {item.product_variant.sku}
                            </td>
                            <td
                                style={{
                                    padding: '4px 0',
                                    borderBottom: '1px solid #000',
                                }}
                            >
                                {item.product_variant.product.product_name}{' '}
                                {item.product_variant.colors.color_name}{' SIZE '}
                                {parseInt(item.product_variant.size_values.size_values)}{' IN '}
                                {item.product_variant.heel_heights.value} {' INCHES'}
                            </td>
                            <td
                                style={{
                                    padding: '4px 0',
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
          <div>
            <div className="bg-black w-full flex justify-center items-center text-white">
                <h1 className="mb-4">CUSTOMER DETAILS</h1>
            </div>
            <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                Receiver: {order.customers.phone}
            </h2>
            <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                Telephone or Mobile #: {order.customers.phone}
            </h2>
            <h2 className="underline" style={{ fontSize: '14pt', fontWeight: 'bold' }}>
                Address: {order.customers.address}
            </h2>
          </div>
        </div>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
                onClick={downloadPDF}
                style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
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
