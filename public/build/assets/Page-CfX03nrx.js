import{a as d,j as e}from"./app-CCafkY1E.js";import{A as h}from"./AuthenticatedLayout-odc7iwR6.js";import{T as r}from"./TextInput-Denya3bJ.js";import{I as m}from"./InputLabel-C7ZDeeAP.js";import{I as n}from"./InputError-DUYCfAcs.js";import"./ApplicationLogo-BL6nlEVA.js";const g=({colors:s})=>{const{data:t,setData:o,put:i,errors:l}=d({name:s.color_name||"",hex:s.hex||""}),x=a=>{a.preventDefault(),i(`/settings_colors/${s.id}`)};return e.jsx(h,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Edit Colors"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsx("h1",{className:"text-xl font-semibold mb-6",children:"Create Color"}),e.jsxs("form",{onSubmit:x,children:[e.jsxs("div",{className:"mb-6",children:[e.jsx(m,{for:"name",value:"Color Name"}),e.jsx(r,{id:"name",name:"name",value:t.name,onChange:a=>o("name",a.target.value),className:"w-full"}),e.jsx(n,{message:l.name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(m,{for:"hex",value:"Hex Code"}),e.jsx(r,{id:"hex",name:"hex",value:t.hex,onChange:a=>o("hex",a.target.value),className:"w-full"}),e.jsx(n,{message:l.hex})]}),e.jsx("button",{type:"submit",className:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",children:"Edit Color"})]})]})})})})})};export{g as default};
