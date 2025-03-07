import{r,j as s,U as m}from"./app-B5iY72Ue.js";import{A}from"./AuthenticatedLayout-CFofA4XK.js";import"./ApplicationLogo-DtXMchGH.js";const E=({products:n,colors:g,sizes:v,size_values:b,heel_heights:j,categories:y})=>{const[l,_]=r.useState(""),[d,N]=r.useState(""),[c,w]=r.useState(""),[h,S]=r.useState(""),[u,f]=r.useState(""),[x,C]=r.useState(""),[i,z]=r.useState("all"),p=n.filter(e=>{const o=e.total_purchased-e.total_sold;let t=!0;i==="positive"?t=o>0:i==="zero"?t=o===0:i==="negative"&&(t=o<0);const a=(!x||e.category_id===parseInt(x))&&(!c||e.size_id===parseInt(c))&&(!h||e.size_value_id===parseInt(h))&&(!u||e.heel_height_id===parseInt(u))&&(!d||e.color_id===parseInt(d)),H=l===""||e.sku.toLowerCase().includes(l.toLowerCase())||e.colors.color_name.toLowerCase().includes(l.toLowerCase())||e.categories.category_name.toLowerCase().includes(l.toLowerCase());return a&&H&&t});r.useEffect(()=>{console.log(n)},[n]);const L=()=>{const e=p.map(a=>({SKU:a.product_variant.sku,Design:a.product_variant.product.product_name,Color:a.product_variant.colors.color_name,Size:a.product_variant.sizes.size_name,SizeValues:a.product_variant.size_values.size_values,HeelHeight:a.product_variant.heel_heights.value,Category:a.product_variant.categories.category_name,OverallQty:a.total_purchased-a.total_sold})),o=XLSX.utils.json_to_sheet(e),t=XLSX.utils.book_new();XLSX.utils.book_append_sheet(t,o,"Over all Product Stocks"),XLSX.writeFile(t,`product_variants_${new Date().toISOString().split("T")[0]}.xlsx`)};return s.jsx(A,{header:s.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Products Management"}),children:s.jsx("div",{className:"py-12",children:s.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:s.jsx("div",{className:"overflow-hidden rounded-lg bg-white shadow-md",children:s.jsx("div",{className:"p-6",children:s.jsxs("div",{className:"container mx-auto p-6",children:[s.jsxs("div",{className:"mb-6 flex items-center justify-between",children:[s.jsx("h1",{className:"text-2xl font-bold",children:"Product Variants"}),s.jsxs("div",{className:"flex gap-2",children:[s.jsx(m,{href:"/inventory/stock/transactions",className:"bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600",children:"Stock Transactions"}),s.jsx("button",{onClick:L,className:"bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600",children:"Export to Excel"})]})]}),s.jsxs("div",{className:"col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",children:[s.jsxs("select",{value:x||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>C(e.target.value),children:[s.jsx("option",{value:"",children:"All Categories"}),y.map(e=>s.jsx("option",{value:e.id,children:e.category_name},e.id))]}),s.jsxs("select",{value:c||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>w(e.target.value),children:[s.jsx("option",{value:"",children:"All Sizes"}),v.map(e=>s.jsx("option",{value:e.id,children:e.size_name},e.id))]}),s.jsxs("select",{value:h||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>S(e.target.value),children:[s.jsx("option",{value:"",children:"Size Values"}),b.map(e=>s.jsx("option",{value:e.id,children:e.size_values},e.id))]}),s.jsxs("select",{value:u||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>f(e.target.value),children:[s.jsx("option",{value:"",children:"All Heel Heights"}),j.map(e=>s.jsx("option",{value:e.id,children:e.value},e.id))]}),s.jsxs("select",{value:d||"",className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>N(e.target.value),children:[s.jsx("option",{value:"",children:"All Colors"}),g.map(e=>s.jsx("option",{value:e.id,children:e.color_name},e.id))]}),s.jsxs("select",{value:i,className:"rounded-md border p-2 shadow-sm focus:outline-none",onChange:e=>z(e.target.value),children:[s.jsx("option",{value:"all",children:"All Quantities"}),s.jsx("option",{value:"negative",children:"Negative Quantities"}),s.jsx("option",{value:"zero",children:"Zero Quantities"}),s.jsx("option",{value:"positive",children:"Positive Quantities"})]})]}),s.jsx("input",{type:"text",placeholder:"Search for a product...",className:"w-full rounded-md border p-2",value:l,onChange:e=>_(e.target.value)}),s.jsxs("table",{className:"w-full table-auto border-collapse border border-gray-300 text-center mt-4",children:[s.jsx("thead",{children:s.jsxs("tr",{className:"bg-gray-100",children:[s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Product SKU"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Overall Qty"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Heel Height"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Size"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Size Values"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Category"}),s.jsx("th",{className:"border border-gray-300 px-4 py-2",children:"Action"})]})}),s.jsx("tbody",{children:p.map(e=>s.jsxs("tr",{children:[s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.sku}),s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.total_purchased-e.total_sold}),s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.heel_heights.value}),s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.sizes.size_name}),s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.size_values.size_values}),s.jsx("td",{className:"border border-gray-300 px-4 py-2",children:e.categories.category_name}),s.jsx("td",{className:"space-x-2 border border-gray-300 px-6 py-3",children:s.jsx(m,{href:`/inventory/product/variant/${e.id}`,className:"text-orange-500 hover:underline",children:"View"})})]},e.id))})]})]})})})})})})};export{E as default};
