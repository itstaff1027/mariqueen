import{r,j as e,h as o}from"./app-Cewx4LIb.js";import{A as p}from"./AuthenticatedLayout-BdxpDDzm.js";import"./ApplicationLogo-B4V_1q-8.js";const b=({sales_order:t,user:x})=>{r.useState(""),r.useState(""),r.useState(""),r.useState(""),r.useState(""),r.useState(""),r.useState("all");const[n,d]=r.useState([]);r.useEffect(()=>{d(m(x))},[x]);const m=s=>{const l=s.roles.flatMap(a=>a.permissions),c=[];return l.some(a=>a.name==="update"&&t.status!=="cancelled")&&c.push("paid"),l.some(a=>a.name==="update"&&t.status!=="cancelled")&&c.push("partial"),l.some(a=>a.name==="refund"&&t.status!=="cancelled")&&c.push("refunded"),l.some(a=>a.name==="cancel")&&c.push("cancelled"),c},i=s=>new Date(s).toLocaleDateString(),h=s=>{if(confirm(`Are you sure you want to update the order status to ${s}?`)){const l=s;o.post(`/finance_orders/update/status/${t.id}`,{new_status:l})}};return e.jsx(p,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:t.order_number}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden rounded-lg bg-white shadow-md",children:e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsx("div",{children:e.jsx("select",{value:t==null?void 0:t.status,className:"rounded-lg bg-green-500 px-5 py-2 text-white shadow transition hover:bg-green-600",children:n.map(s=>e.jsx("option",{value:s,onClick:l=>h(l.target.value),disabled:(t==null?void 0:t.status)===s,children:s.charAt(0).toUpperCase()+s.slice(1)},s))})}),e.jsxs("div",{className:"flex w-full flex-col items-center justify-center p-10",children:[e.jsxs("div",{className:"grid w-full grid-cols-2 border-b-2",children:[e.jsxs("h1",{className:"w-full text-left text-3xl font-bold",children:["Order Date: ",i(t.created_at)]}),e.jsxs("h1",{className:"w-full text-right text-3xl font-bold",children:["Status: ",t.status]})]}),e.jsxs("div",{className:"w-full p-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Customer Information"}),t.customers?e.jsxs("div",{children:[e.jsxs("p",{className:"text-gray-700",children:[t.customers.first_name," ",t.customers.last_name]}),e.jsxs("p",{className:"text-gray-700",children:["Email:"," ",t.customers.email]}),e.jsxs("p",{className:"text-gray-700",children:["Phone:"," ",t.customers.phone]}),e.jsxs("p",{className:"text-gray-700",children:["Address:"," ",t.customers.address]}),t.customers.receiver_name&&e.jsxs("p",{className:"text-gray-700",children:["Receiver:"," ",t.customers.receiver_name]})]}):e.jsx("p",{className:"text-gray-700",children:"No customer information available."})]}),e.jsxs("div",{className:"mb-8 w-full",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Order Items"}),e.jsxs("table",{className:"min-w-full border border-gray-300",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"border px-4 py-2 text-left",children:"SKU"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Quantity"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Unit Price"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Total Price"})]})}),e.jsx("tbody",{children:t.items&&t.items.length>0?t.items.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border px-4 py-2",children:s.product_variant.sku}),e.jsx("td",{className:"border px-4 py-2 text-right",children:s.quantity}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",parseFloat(s.unit_price).toFixed(2)]}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",parseFloat(s.total_price).toFixed(2)]})]},s.id)):e.jsx("tr",{children:e.jsx("td",{className:"border px-4 py-2 text-center",colSpan:"5",children:"No items found"})})})]})]}),e.jsxs("div",{className:"mb-8 w-full",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Payment Information"}),e.jsxs("table",{className:"min-w-full border border-gray-300",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"border px-4 py-2 text-left",children:"Payment Method"}),e.jsx("th",{className:"border px-4 py-2 text-left",children:"Amount Paid"}),e.jsx("th",{className:"border px-4 py-2 text-left",children:"Change Due"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Excess"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Balance"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Date"})]})}),e.jsx("tbody",{children:t.payments&&t.payments.length>0?t.payments.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border px-4 py-2",children:s.payment_method.name}),e.jsxs("td",{className:"border px-4 py-2",children:["₱",s.amount_paid]}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",s.change_due]}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",s.excess_amount]}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",s.remaining_balance]}),e.jsx("td",{className:"border px-4 py-2 text-right",children:i(s.created_at)})]},s.id)):e.jsx("tr",{children:e.jsx("td",{className:"border px-4 py-2 text-center",colSpan:"5",children:"No items found"})})})]})]}),e.jsxs("div",{className:"flex w-full flex-col items-end justify-end border-t pt-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Order Summary"}),e.jsxs("p",{className:"text-gray-700",children:["Subtotal: ₱",parseFloat(t.total_amount).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["VATables: ₱",parseFloat(t.total_amount/1.12).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["VAT: ₱",parseFloat(t.total_amount/1.12*.12).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Shipping Cost: ₱",parseFloat(t.shipping_cost).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Rush Order Fee: ₱",parseFloat(t.rush_order_fee).toFixed(2)]}),e.jsxs("p",{className:"font-bold text-gray-700",children:["Grand Total: ₱",parseFloat(t.grand_amount).toFixed(2)]})]}),e.jsxs("div",{className:"w-full border-t pt-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Remarks/Note:"}),e.jsx("div",{className:"h-40 w-full rounded-xl border p-4",children:t.remarks})]})]}),e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md",children:[e.jsxs("div",{className:"mb-8 border-b pb-4",children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold",children:"Sales Order"}),e.jsxs("p",{className:"text-gray-600",children:["Order Number:"," ",t.order_number]}),e.jsxs("p",{className:"text-gray-600",children:["Order Date:"," ",i(t.created_at)]}),e.jsxs("p",{className:"text-gray-600",children:["Status: ",t.status]})]}),e.jsxs("div",{className:"mb-8 border-b pb-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Customer Information"}),t.customers?e.jsxs("div",{children:[e.jsxs("p",{className:"text-gray-700",children:[t.customers.first_name," ",t.customers.last_name]}),e.jsxs("p",{className:"text-gray-700",children:["Email:"," ",t.customers.email]}),e.jsxs("p",{className:"text-gray-700",children:["Phone:"," ",t.customers.phone]}),e.jsxs("p",{className:"text-gray-700",children:["Address:"," ",t.customers.address]}),t.customers.receiver_name&&e.jsxs("p",{className:"text-gray-700",children:["Receiver:"," ",t.customers.receiver_name]})]}):e.jsx("p",{className:"text-gray-700",children:"No customer information available."})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Order Items"}),e.jsxs("table",{className:"min-w-full border border-gray-300",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"border px-4 py-2 text-left",children:"SKU"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Quantity"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Unit Price"}),e.jsx("th",{className:"border px-4 py-2 text-right",children:"Total Price"})]})}),e.jsx("tbody",{children:t.items&&t.items.length>0?t.items.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border px-4 py-2",children:s.product_variant.sku}),e.jsx("td",{className:"border px-4 py-2 text-right",children:s.quantity}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",parseFloat(s.unit_price).toFixed(2)]}),e.jsxs("td",{className:"border px-4 py-2 text-right",children:["₱",parseFloat(s.total_price).toFixed(2)]})]},s.id)):e.jsx("tr",{children:e.jsx("td",{className:"border px-4 py-2 text-center",colSpan:"5",children:"No items found"})})})]})]}),e.jsxs("div",{className:"mb-8 border-t pt-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Payment Information"}),t.payments&&t.payments.length>0?t.payments.map(s=>e.jsxs("div",{className:"mb-2",children:[e.jsxs("p",{className:"text-gray-700",children:["Amount Paid: ₱",parseFloat(s.amount_paid).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Change Due: ₱",parseFloat(s.change_due).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Remaining Balance: ₱",parseFloat(s.remaining_balance).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Payment Method:"," ",s.payment_method.name]}),e.jsxs("p",{className:"text-gray-700",children:["Status:"," ",s.status]})]},s.id)):e.jsx("p",{className:"text-gray-700",children:"No payment information available."})]}),e.jsxs("div",{className:"border-t pt-4",children:[e.jsx("h2",{className:"mb-2 text-xl font-semibold",children:"Order Summary"}),e.jsxs("p",{className:"text-gray-700",children:["Subtotal: ₱",parseFloat(t.total_amount).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["VATables: ₱",parseFloat(t.total_amount/1.12).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["VAT: ₱",parseFloat(t.total_amount/1.12*.12).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Shipping Cost: ₱",parseFloat(t.shipping_cost).toFixed(2)]}),e.jsxs("p",{className:"text-gray-700",children:["Rush Order Fee: ₱",parseFloat(t.rush_order_fee).toFixed(2)]}),e.jsxs("p",{className:"font-bold text-gray-700",children:["Grand Total: ₱",parseFloat(t.grand_amount).toFixed(2)]})]})]})})]})})})})})})};export{b as default};
