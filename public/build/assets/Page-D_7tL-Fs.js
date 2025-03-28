import{r,j as e,U as m,h as p}from"./app-B9zs1XDa.js";import{A}from"./AuthenticatedLayout-BVBNPDOM.js";import"./ApplicationLogo-Dhb1On_J.js";const Q=({products:l,colors:g,sizes:b,size_values:v,heel_heights:j,categories:y})=>{const[o,N]=r.useState(""),[i,S]=r.useState(""),[n,_]=r.useState(""),[d,w]=r.useState(""),[c,f]=r.useState(""),[h,z]=r.useState(""),[x,C]=r.useState("all"),k=()=>{p.visit("/inventory/stocks",{method:"get",data:{category:h,size:n,size_value:d,heel_height:c,color:i,qty:x,search:o},preserveState:!0,preserveScroll:!0})},H=()=>{const s=l.data.map(a=>({SKU:a.sku,Design:a.product.product_name,Color:a.colors.color_name,Size:a.sizes.size_name,SizeValues:a.size_values.size_values,HeelHeight:a.heel_heights.value,Category:a.categories.category_name,OverallQty:parseInt(a.total_purchased- -a.total_sold)})),t=XLSX.utils.json_to_sheet(s),u=XLSX.utils.book_new();XLSX.utils.book_append_sheet(u,t,"Over all Product Stocks"),XLSX.writeFile(u,`product_variants_${new Date().toISOString().split("T")[0]}.xlsx`)};return e.jsx(A,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Products Management"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden rounded-lg bg-white shadow-md",children:e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsxs("div",{className:"mb-6 flex items-center justify-between",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Product Variants"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(m,{href:"/inventory/stock/transactions",className:"bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600",children:"Stock Transactions"}),e.jsx("button",{onClick:H,className:"bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600",children:"Export to Excel"})]})]}),e.jsxs("div",{className:"col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",children:[e.jsxs("select",{value:h||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>z(s.target.value),children:[e.jsx("option",{value:"",children:"All Categories"}),y.map(s=>e.jsx("option",{value:s.id,children:s.category_name},s.id))]}),e.jsxs("select",{value:n||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>_(s.target.value),children:[e.jsx("option",{value:"",children:"All Sizes"}),b.map(s=>e.jsx("option",{value:s.id,children:s.size_name},s.id))]}),e.jsxs("select",{value:d||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>w(s.target.value),children:[e.jsx("option",{value:"",children:"Size Values"}),v.map(s=>e.jsx("option",{value:s.id,children:s.size_values},s.id))]}),e.jsxs("select",{value:c||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>f(s.target.value),children:[e.jsx("option",{value:"",children:"All Heel Heights"}),j.map(s=>e.jsx("option",{value:s.id,children:s.value},s.id))]}),e.jsxs("select",{value:i||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>S(s.target.value),children:[e.jsx("option",{value:"",children:"All Colors"}),g.map(s=>e.jsx("option",{value:s.id,children:s.color_name},s.id))]}),e.jsxs("select",{value:x,className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:s=>C(s.target.value),children:[e.jsx("option",{value:"all",children:"All Quantities"}),e.jsx("option",{value:"negative",children:"Negative Quantities"}),e.jsx("option",{value:"zero",children:"Zero Quantities"}),e.jsx("option",{value:"positive",children:"Positive Quantities"})]})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("input",{type:"text",placeholder:"Search for a product...",className:"w-full rounded-md border p-2",value:o,onChange:s=>N(s.target.value)}),e.jsx("button",{onClick:k,className:"bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600",children:"Filter"})]}),e.jsxs("table",{className:"w-full table-auto border-collapse border border-gray-300 text-center mt-4",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Product SKU"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Overall Qty"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Heel Height"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Size"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Size Values"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Category"}),e.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Action"})]})}),e.jsx("tbody",{children:l.data.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.sku}),e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.total_purchased- -s.total_sold}),e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.heel_heights.value}),e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.sizes.size_name}),e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.size_values.size_values}),e.jsx("td",{className:"border border-gray-300 px-4 py-2",children:s.categories.category_name}),e.jsx("td",{className:"space-x-2 border border-gray-300 px-6 py-3",children:e.jsx(m,{href:`/inventory/product/variant/${s.id}`,className:"text-orange-500 hover:underline",children:"View"})})]},s.id))})]}),l.links&&e.jsx("div",{className:"mt-4 flex justify-center",children:l.links.map((s,t)=>e.jsx("button",{onClick:()=>{s.url&&p.visit(s.url,{preserveState:!0,preserveScroll:!0})},className:`mx-1 px-3 py-1 border rounded ${s.active?"bg-blue-500 text-white":"bg-white text-blue-500"}`,dangerouslySetInnerHTML:{__html:s.label}},t))})]})})})})})})};export{Q as default};
