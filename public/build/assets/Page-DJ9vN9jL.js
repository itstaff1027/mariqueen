import{a as p,j as e}from"./app-CCafkY1E.js";import{A as j}from"./AuthenticatedLayout-odc7iwR6.js";import{T as c}from"./TextInput-Denya3bJ.js";import{I as d}from"./InputLabel-C7ZDeeAP.js";import{I as r}from"./InputError-DUYCfAcs.js";import{C as v,S as f,H as b,a as N}from"./Categories-D3zMujZk.js";import"./ApplicationLogo-BL6nlEVA.js";import"./Dropdown-CRi31njx.js";import"./transition-DCZehKHd.js";const D=({colors:m,sizes:n,heel_heights:h,categories:x})=>{const{data:a,setData:t,post:u,errors:l,reset:y}=p({product_name:"",status:"inactive",cost:0,srp:0,colors:[],sizes:[],heel_heights:[],categories:[]}),g=s=>{console.log(a),s.preventDefault(),u("/inventory/products")};return e.jsx(j,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Products Management"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-md rounded-lg",children:e.jsx("div",{className:"p-6",children:e.jsxs("div",{className:"container mx-auto p-6",children:[e.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Add Product"}),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"name",value:"Product Name"}),e.jsx(c,{type:"text",id:"name",name:"name",value:a.product_name,onChange:s=>t("product_name",s.target.value),className:"w-full border px-4 py-2"}),e.jsx(r,{message:l.product_name})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(c,{type:"text",id:"status",name:"status",value:a.status,onChange:s=>t("status",s.target.value),className:"w-full border px-4 py-2",hidden:!0}),e.jsx(r,{message:l.status})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(c,{type:"number",id:"cost",name:"cost",value:a.cost,onChange:s=>t("cost",s.target.value),className:"w-full border px-4 py-2",hidden:!0}),e.jsx(r,{message:l.cost})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"srp",value:"SRP"}),e.jsx(c,{type:"number",id:"srp",name:"srp",value:a.srp,onChange:s=>t("srp",s.target.value),className:"w-full border px-4 py-2"}),e.jsx(r,{message:l.srp})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"colors",value:"Colors"}),e.jsx(v.Selection,{handleSelectedColor:(s,o=!1)=>{o?t("colors",a.colors.filter(i=>i.id!==s.id)):a.colors.some(i=>i.id===s.id)||t("colors",[...a.colors,s])},colors:a.colors,availableColors:m}),e.jsx(r,{message:l.colors})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"sizes",value:"Sizes"}),e.jsx(f.Selection,{handleSelectedSizes:(s,o=!1)=>{o?t("sizes",a.sizes.filter(i=>i.id!==s.id)):a.sizes.some(i=>i.id===s.id)||t("sizes",[...a.sizes,s])},sizes:a.sizes,availableSizes:n}),e.jsx(r,{message:l.sizes})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"heel_height",value:"Heel Heights"}),e.jsx(b.Selection,{handleSelectedHeelHeights:(s,o=!1)=>{o?t("heel_heights",a.heel_heights.filter(i=>i.id!==s.id)):a.heel_heights.some(i=>i.id===s.id)||t("heel_heights",[...a.heel_heights,s])},heelHeights:a.heel_heights,availableHeelHeights:h}),e.jsx(r,{message:l.HeelHeights})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(d,{for:"categories",value:"Category"}),e.jsx(N.Selection,{handleSelectedCategories:(s,o=!1)=>{o?t("categories",a.categories.filter(i=>i.id!==s.id)):a.categories.some(i=>i.id===s.id)||t("categories",[...a.categories,s])},categories:a.categories,availableCategories:x}),e.jsx(r,{message:l.categories})]}),e.jsx("button",{type:"submit",className:"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",onClick:s=>g(s),children:"Save"})]})]})})})})})})};export{D as default};
