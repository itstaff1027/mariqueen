import{a as d,j as e}from"./app-B5iY72Ue.js";import{A as u}from"./AuthenticatedLayout-CFofA4XK.js";import{T as t}from"./TextInput-BCIc3s24.js";import{I as l}from"./InputLabel-BLoE7w9L.js";import{I as n}from"./InputError-CWwfNm0E.js";import"./ApplicationLogo-DtXMchGH.js";const p=({heel_height:x})=>{const{data:a,setData:m,post:i,errors:r}=d({first_name:"",last_name:"",email:"",phone:"",address:"",receiver_name:""}),o=s=>{s.preventDefault(),i("/customers")};return e.jsx(u,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Create Customers"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsx("div",{className:"p-6 text-gray-900",children:e.jsxs("form",{onSubmit:o,children:[e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"first_name",value:"Customers First Name"}),e.jsx(t,{id:"first_name",name:"first_name",value:a.first_name,onChange:s=>m("first_name",s.target.value),className:"w-full"}),e.jsx(n,{message:r.first_name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"last_name",value:"Customers Last Name"}),e.jsx(t,{id:"last_name",name:"last_name",value:a.last_name,onChange:s=>m("last_name",s.target.value),className:"w-full"}),e.jsx(n,{message:r.last_name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"email",value:"Customers Email"}),e.jsx(t,{id:"email",name:"email",value:a.email,onChange:s=>m("email",s.target.value),className:"w-full"}),e.jsx(n,{message:r.email})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"phone",value:"Customers Phone"}),e.jsx(t,{id:"phone",name:"phone",value:a.phone,onChange:s=>m("phone",s.target.value),className:"w-full"}),e.jsx(n,{message:r.phone})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"address",value:"Customers Address"}),e.jsx(t,{id:"address",name:"address",value:a.address,onChange:s=>m("address",s.target.value),className:"w-full"}),e.jsx(n,{message:r.address})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(l,{for:"receiver_name",value:"Receiver Name"}),e.jsx(t,{id:"receiver_name",name:"receiver_name",type:"text",value:a.receiver_name,onChange:s=>m("receiver_name",s.target.value),className:"w-full"}),e.jsx(n,{message:r.receiver_name})]}),e.jsx("button",{type:"submit",className:"bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",children:"Create Customers"})]})})})})})})};export{p as default};
