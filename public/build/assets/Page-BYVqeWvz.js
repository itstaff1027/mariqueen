import{a as d,j as e}from"./app-DtsliT9F.js";import{A as m}from"./AuthenticatedLayout-CH7yFXWl.js";import"./ApplicationLogo-Darbfv_U.js";const u=({permission:t})=>{const{data:n,setData:r,put:i,errors:a}=d({name:t.name}),l=s=>{s.preventDefault(),i(`/admin-permissions/${t.id}`)};return e.jsx(m,{header:e.jsx("h2",{className:"text-2xl font-semibold leading-tight text-gray-800",children:"Admin Dashboard"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsx("h1",{className:"text-3xl font-bold mb-6",children:"Edit Permission"}),e.jsxs("form",{onSubmit:l,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block text-lg font-medium text-gray-700",children:"Permission Name"}),e.jsx("input",{type:"text",id:"name",value:n.name,onChange:s=>r("name",s.target.value),className:"mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),a.name&&e.jsx("span",{className:"text-red-500 text-sm mt-1",children:a.name})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",children:"Update Permission"})})]})]})})})})})};export{u as default};
