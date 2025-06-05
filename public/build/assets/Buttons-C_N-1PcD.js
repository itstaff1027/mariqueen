import{j as t,h as d}from"./app-CNtLemjm.js";import{c as o}from"./createLucideIcon-BVGKL5Xa.js";import{C as l,b as u}from"./Links-De5lviw2.js";/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],b=o("chevron-left",g);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],p=o("chevron-right",h);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],f=o("ellipsis",x);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],m=o("refresh-cw",y);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],j=o("save",v);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],N=o("trash-2",_);function D({value:e,preserveStateBool:c,preserveScrollBool:a}){if(!e.links)return null;const r=n=>{d.visit(n,{preserveState:c,preserveScroll:a})};return t.jsxs("nav",{className:"mt-6 flex items-center justify-center space-x-1","aria-label":"Pagination",children:[t.jsx("button",{onClick:()=>r(e.prev_page_url),disabled:!e.prev_page_url,className:`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${e.prev_page_url?"bg-white hover:bg-gray-100":"bg-gray-50"}`,"aria-label":"",children:t.jsx(b,{size:20})}),e.links.map((n,s)=>{if(n.label==="...")return t.jsx("span",{className:"px-3 py-1 rounded-md border bg-white text-gray-500",children:t.jsx(f,{size:16})},s);const i=n.active;return Number.isNaN(+n.label)?n.label:+n.label,t.jsx("button",{onClick:()=>n.url&&r(n.url),dangerouslySetInnerHTML:{__html:n.label},className:`px-3 py-1 rounded-md border transition
              ${i?"bg-blue-600 text-white border-transparent":"bg-white text-blue-600 hover:bg-blue-50"}
            `,"aria-current":i?"page":void 0},s)}),t.jsx("button",{onClick:()=>r(e.next_page_url),disabled:!e.next_page_url,className:`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${e.next_page_url?"bg-white hover:bg-gray-100":"bg-gray-50"}`,"aria-label":"",children:t.jsx(p,{size:20})})]})}const w=e=>t.jsx("button",{className:"px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",...e,children:"Submit"}),k=e=>t.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",...e,children:"Edit"}),B=e=>t.jsx("button",{className:"px-4 py-2 bg-green-600 text-white rounded-md font-semibold transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500",...e,children:"Update"}),C=e=>t.jsx("button",{className:"px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",...e,children:"Save"}),M=e=>t.jsx("button",{className:"px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",...e,children:"Delete"}),z=e=>t.jsx("button",{className:"p-2 bg-blue-600 text-white rounded-full transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",...e,children:t.jsx(l,{size:16})}),S=e=>t.jsx("button",{className:"p-2 bg-gray-200 text-gray-800 rounded-full transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",...e,children:t.jsx(u,{size:16})}),$=e=>t.jsx("button",{className:"p-2 bg-green-600 text-white rounded-full transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500",...e,children:t.jsx(m,{size:16})}),I=e=>t.jsx("button",{className:"p-2 bg-indigo-600 text-white rounded-full transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",...e,children:t.jsx(j,{size:16})}),E=e=>t.jsx("button",{className:"p-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",...e,children:t.jsx(N,{size:16})}),R={SubmitButton:w,EditButton:k,UpdateButton:B,SaveButton:C,DeleteButton:M,IconSubmitButton:z,IconEditButton:S,IconUpdateButton:$,IconSaveButton:I,IconDeleteButton:E};export{R as B,D as C};
