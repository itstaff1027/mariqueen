import{a as v,j as e}from"./app-B1sjvdko.js";import{A as p}from"./AuthenticatedLayout-Bmz7T_3p.js";import{T as r}from"./TextInput-CfKEztCc.js";import{I as o}from"./InputLabel-djE-f7yw.js";import{I as i}from"./InputError-D-Vi496J.js";import"./ApplicationLogo-lMO7AezW.js";const y=({made_to_order_product:l,products:c,colors:h,sizes:d,heel_heights:u})=>{const{data:a,setData:t,put:m,errors:n}=v({made_to_order_product_id:l.id||"",product_name:l.product_name||"",color_name:l.color||"",size_value:l.size||"",heel_height:l.heel_height||"",type_of_heel:l.type_of_heel||"",round:l.round||"",length:l.length||"",back_strap:l.back_strap||"",cost:l.cost||""}),x=s=>{s.preventDefault(),m(`/inventory_mto_products/${l.id}`)};return e.jsx(p,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Edit MTO Product"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsx("h1",{className:"text-xl font-semibold mb-6",children:"Edit MTO Product"}),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"product_name",value:"Product Name"}),e.jsxs("select",{className:"w-full rounded-md border p-2",value:a.product_name,onChange:s=>t("product_name",s.target.value),children:[e.jsx("option",{value:"",children:"Select Product Name"}),c.map(s=>e.jsx("option",{value:s.product_name,children:s.product_name},s.id)),e.jsx("option",{value:"others",children:"Others"})]}),e.jsx(i,{message:n.product_name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"color_name",value:"Product Name"}),e.jsxs("select",{className:"w-full rounded-md border p-2",value:a.color_name,onChange:s=>t("color_name",s.target.value),children:[e.jsx("option",{value:"",children:"Select Color"}),h.map(s=>e.jsx("option",{value:s.color_name,children:s.color_name},s.id)),e.jsx("option",{value:"others",children:"Others"})]}),e.jsx(i,{message:n.color_name})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"size_value",value:"Product Descprition"}),e.jsxs("select",{className:"w-full rounded-md border p-2",value:a.size_value,onChange:s=>t("size_value",s.target.value),children:[e.jsx("option",{value:"",children:"Select Size"}),d.map(s=>e.jsxs("option",{value:s.size_values,children:[s.size_values," - ",s.size.size_name]},s.id)),e.jsx("option",{value:"others",children:"Others"})]}),e.jsx(i,{message:n.size_value})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"heel_height",value:"Heel Height"}),e.jsxs("select",{className:"w-full rounded-md border p-2",value:a.heel_height,onChange:s=>t("heel_height",s.target.value),children:[e.jsx("option",{value:"",children:"Select Heel Height"}),u.map(s=>e.jsxs("option",{value:s.value,children:[s.value," Inches"]},s.id)),e.jsx("option",{value:"others",children:"Others"})]}),e.jsx(i,{message:n.heel_height})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"type_of_heel",value:"Product Descprition"}),e.jsxs("select",{className:"w-full rounded-md border p-2",value:a.type_of_heel,onChange:s=>t("type_of_heel",s.target.value),children:[e.jsx("option",{value:"",children:"Select Type of Heels"}),e.jsx("option",{value:"b-thick_heel",children:"B-Thick Heel"}),e.jsx("option",{value:"pin_heel",children:"Pin Heel"}),e.jsx("option",{value:"block_heel",children:"Block Heel"}),e.jsx("option",{value:"others",children:"Others"})]}),e.jsx(i,{message:n.type_of_heel})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"round",value:"Round"}),e.jsx(r,{type:"text",id:"round",name:"round",value:a.round,onChange:s=>t("round",s.target.value),className:"w-full"}),e.jsx(i,{message:n.round})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"length",value:"Length"}),e.jsx(r,{type:"text",id:"length",name:"length",value:a.length,onChange:s=>t("length",s.target.value),className:"w-full"}),e.jsx(i,{message:n.length})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"back_strap",value:"Back Strap"}),e.jsx(r,{type:"text",id:"back_strap",name:"back_strap",value:a.back_strap,onChange:s=>t("back_strap",s.target.value),className:"w-full"}),e.jsx(i,{message:n.back_strap})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(o,{for:"cost",value:"Cost"}),e.jsx(r,{type:"text",id:"cost",name:"cost",value:a.cost,onChange:s=>t("cost",s.target.value),className:"w-full"}),e.jsx(i,{message:n.cost})]}),e.jsx("button",{type:"submit",className:"bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",onClick:x,children:"Edit MTO Product"})]})]})})})})})};export{y as default};
