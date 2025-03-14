import{r as o,j as e,h as D,b as K}from"./app-DsVvwk6J.js";import{A as L}from"./AuthenticatedLayout-DB2dOl9d.js";import"./ApplicationLogo-CDrwH3Pq.js";const B=({product_variants:m,warehouses:x,stock_levels:U})=>{const[n,u]=o.useState([]),[f,y]=o.useState({}),[l,C]=o.useState("purchase"),[d,v]=o.useState(""),[b,g]=o.useState("");o.useState("draft");const[N,T]=o.useState(""),[F,k]=o.useState(m),[h,R]=o.useState([]);o.useEffect(()=>{if(console.log(d),l==="transfer"&&d){const s=h.filter(t=>t.warehouse_id.toString()===d.toString()).map(t=>t.product_variant);k(s)}else k(m)},[l,d,h]);const _=()=>{const s=n.map(t=>t.sku).filter(Boolean);return m.filter(t=>!s.includes(t.sku))},S=()=>{const s=n.map(r=>r.sku).filter(Boolean),t=h.map(r=>r.product_variant);return console.log(h),t.filter(r=>!s.includes(r.sku))},W=()=>{u([...n,{id:"",sku:"",quantity:""}])},A=s=>{u(n.filter((t,r)=>r!==s))},j=(s,t,r)=>{const i=n.map((a,c)=>c===s?{...a,[t]:r}:a);u(i)},w=(s,t,r)=>{const i=n.map((a,c)=>c===s?{...a,sku:t,id:r}:a);u(i),y(a=>({...a,[s]:!1}))},p=s=>{y(t=>({...t,[s]:!t[s]}))},V=s=>{C(s.target.value),v(""),g(""),u([])},E=s=>{s.preventDefault();const t={transaction_type:l,remarks:N,from_warehouse_id:l==="transfer"?d:null,to_warehouse_id:b,products:n.map(r=>({product_variant_id:r.id,quantity:r.quantity}))};console.log(t),D.post("/inventory/stock/transactions",t)},q=s=>{K.get(route("stock_movements",{id:s})).then(t=>{console.log(t.data),R(t.data)}).catch(t=>{console.error("Error fetching data:",t)})};return e.jsx(L,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Stock Transactions"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-md rounded-lg",children:e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Stock Transactions"}),e.jsx("button",{type:"button",onClick:S,className:"text-2xl font-bold",children:"test"}),e.jsxs("div",{className:"space-x-2",children:[e.jsx("button",{type:"submit",className:"bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 mt-4",onClick:E,children:"Submit"}),e.jsx("button",{onClick:W,className:"bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600",children:"Add Row"})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-bold mb-2",children:"Transaction Type:"}),e.jsxs("select",{className:"w-full border border-gray-300 rounded px-4 py-2",value:l,onChange:V,children:[e.jsx("option",{value:"purchase",children:"Purchase"}),e.jsx("option",{value:"return",children:"Return"}),e.jsx("option",{value:"adjustment",children:"Adjustment"}),e.jsx("option",{value:"correction",children:"Correction"}),e.jsx("option",{value:"repair",children:"Repair"}),e.jsx("option",{value:"transfer",children:"Transfer"})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-bold mb-2",children:"General Remarks:"}),e.jsx("textarea",{className:"w-full border border-gray-300 rounded px-4 py-2",placeholder:"Enter general remarks for this transaction",value:N,onChange:s=>T(s.target.value)})]}),l==="transfer"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-bold mb-2",children:"Source Warehouse:"}),e.jsxs("select",{className:"w-full border border-gray-300 rounded px-4 py-2",value:d,onChange:s=>{v(s.target.value),q(s.target.value)},children:[e.jsx("option",{value:"",disabled:!0,children:"Select Source Warehouse"}),x.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-bold mb-2",children:"Target Warehouse:"}),e.jsxs("select",{className:"w-full border border-gray-300 rounded px-4 py-2",value:b,onChange:s=>g(s.target.value),children:[e.jsx("option",{value:"",disabled:!0,children:"Select Target Warehouse"}),x.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]})]}):e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-bold mb-2",children:"Warehouse:"}),e.jsxs("select",{className:"w-full border border-gray-300 rounded px-4 py-2",value:b,onChange:s=>g(s.target.value),children:[e.jsx("option",{value:"",disabled:!0,children:"Select Warehouse"}),x.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})]}),e.jsxs("table",{className:"w-full table-auto border-collapse border border-gray-300",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"border px-4 py-2",children:"Product SKU"}),e.jsx("th",{className:"border px-4 py-2",hidden:l!=="transfer",children:"Available Stocks"}),e.jsx("th",{className:"border px-4 py-2",children:"Quantity"}),e.jsx("th",{className:"border px-4 py-2",children:"Actions"})]})}),e.jsx("tbody",{children:n.map((s,t)=>{var i;const r=((i=h.find(a=>a.product_variant_id===s.id))==null?void 0:i.total_stock)||0;return e.jsxs("tr",{children:[e.jsxs("td",{className:"border px-4 py-2 relative",children:[l==="transfer"?e.jsx("input",{type:"text",className:"w-full border px-2 py-1 rounded",placeholder:"Search SKU (Transfer)",value:s.sku,onChange:a=>{j(t,"sku",a.target.value),p(t)},onFocus:()=>p(t)}):e.jsx("input",{type:"text",className:"w-full border px-2 py-1 rounded",placeholder:"Search SKU (Purchase)",value:s.sku,onChange:a=>{j(t,"sku",a.target.value),p(t)},onFocus:()=>p(t)}),l==="transfer"?f[t]&&e.jsx("ul",{className:"absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto",children:S().map(a=>e.jsx("li",{className:"px-4 py-2 hover:bg-gray-200 cursor-pointer",onClick:()=>w(t,a.sku,a.id),children:a.sku},a.id))}):f[t]&&e.jsx("ul",{className:"absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto",children:_().filter(a=>a.sku.toLowerCase().includes(s.sku.toLowerCase())).map(a=>e.jsx("li",{className:"px-4 py-2 hover:bg-gray-200 cursor-pointer",onClick:()=>w(t,a.sku,a.id),children:a.sku},a.id))})]}),l==="transfer"&&e.jsx("td",{className:"border px-4 py-2 text-center",children:r>0?e.jsxs("span",{className:"text-green-600 font-bold",children:[r," Available"]}):e.jsx("span",{className:"text-red-600 font-bold",children:"Out of Stock"})}),e.jsx("td",{className:"border px-4 py-2",children:e.jsx("input",{type:"number",className:"w-full border px-2 py-1 rounded",placeholder:"Enter Quantity",value:s.quantity,onChange:a=>{let c=parseInt(a.target.value,10)||0;l==="transfer"&&c>r&&(c=r),j(t,"quantity",c)},min:"1",max:l==="transfer"?r:"",disabled:l==="transfer"&&r===0})}),e.jsx("td",{className:"border px-4 py-2",children:e.jsx("button",{type:"button",onClick:()=>A(t),className:"bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600",children:"Remove"})})]},t)})})]})]})})})})})})};export{B as default};
