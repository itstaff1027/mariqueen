import{a as d,j as e}from"./app-B5iY72Ue.js";import{A as c}from"./AuthenticatedLayout-CFofA4XK.js";import{T as i}from"./TextInput-BCIc3s24.js";import{I as n}from"./InputLabel-BLoE7w9L.js";import{I as r}from"./InputError-CWwfNm0E.js";import"./ApplicationLogo-DtXMchGH.js";const g=({heel_height:x})=>{const{data:t,setData:s,post:o,errors:m}=d({name:"",is_active:1}),l=a=>{a.preventDefault(),o("/payment_methods")};return e.jsx(c,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Create Payment Method"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsx("div",{className:"p-6 text-gray-900",children:e.jsxs("form",{onSubmit:l,children:[e.jsxs("div",{className:"mb-6",children:[e.jsx(n,{for:"name",value:"Payment Method Name"}),e.jsx(i,{id:"name",name:"name",value:t.name,onChange:a=>s("name",a.target.value),className:"w-full"}),e.jsx(r,{message:m.name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(n,{for:"is_active",value:"Is Active (1 = Active : 0 = In_Active)"}),e.jsx(i,{id:"is_active",name:"is_active",type:"number",value:t.is_active,onChange:a=>s("is_active",a.target.value),className:"w-full",max:1,min:0}),e.jsx(r,{message:m.value})]}),e.jsx("button",{type:"submit",className:"bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",children:"Create Payment Method"})]})})})})})})};export{g as default};
