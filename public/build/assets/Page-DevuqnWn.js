import{j as e,M as a}from"./app-DsVvwk6J.js";import"./Dropdown-BGyXKYpK.js";import{R as o}from"./ResponsiveNavLink-CrzQ78es.js";import{A as d}from"./AuthenticatedLayout-DB2dOl9d.js";import"./transition-BZKU5QWS.js";import"./use-sync-refs-DNgf-CQf.js";import"./ApplicationLogo-CDrwH3Pq.js";function l({header:s,children:i}){const r=[{id:"0",name:"Settings",route:"settings"},{id:"1",name:"Colors",route:"settings_colors.index"},{id:"2",name:"Sizes",route:"settings_sizes.index"},{id:"3",name:"Heel Heights",route:"settings_heel-heights.index"},{id:"4",name:"Categories",route:"settings_categories.index"}];return e.jsxs(d,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800",children:"Settings"}),children:[e.jsx(a,{title:"Settings"}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"overflow-hidden bg-white shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsx("div",{className:"flex flex-wrap gap-3 justify-center sm:justify-start p-4",children:r.map((t,n)=>e.jsx(o,{href:route(`${t.route}`),active:route().current(`${t.route}`),className:"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition",children:t.name},n))}),e.jsx("main",{children:i})]})})})})]})}const j=({sizes:s})=>e.jsx(l,{header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Settings"}),children:"Settings"});export{j as default};
