import{j as s,M as o}from"./app-BMbUDzsq.js";import"./Dropdown-BM-ifQW-.js";import{R as d}from"./ResponsiveNavLink-aSw3nFTR.js";import{A as n}from"./AuthenticatedLayout-f1mvhp92.js";import"./transition-DrUESQXy.js";import"./use-sync-refs-CTaSzcgv.js";import"./ApplicationLogo-DlZMD46S.js";function c({header:i,children:t}){const r=[{id:"0",name:"Logistics",route:"logistics"},{id:"1",name:"Couriers",route:"couriers.index"},{id:"2",name:"Sales Orders",route:"logistics_orders.index"}];return s.jsxs(n,{header:s.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Logistics"}),children:[s.jsx(o,{title:"Logistics"}),s.jsx("div",{className:"py-12",children:s.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:s.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:s.jsxs("div",{className:"p-6 text-gray-900",children:[s.jsx("div",{className:"flex flex-wrap gap-3 justify-center sm:justify-start p-4",children:r.map((e,a)=>s.jsx(d,{href:route(`${e.route}`),active:route().current(`${e.route}`),className:"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition",children:e.name},a))}),s.jsx("main",{children:t})]})})})})]})}const j=({sizes:i})=>s.jsx(c,{header:s.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Logistics"}),children:"Logistics"});export{j as default};
