import{c as o}from"./createLucideIcon-BJIvPw8-.js";import{j as n,h as g,U as s}from"./app-DzVPnBm_.js";/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],a=o("check",h);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],x=o("chevron-left",b);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],m=o("chevron-right",p);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],f=o("ellipsis",y);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],l=o("pencil",v);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],J=o("plus",j);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],_=o("refresh-cw",k);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],w=o("save",N);/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],M=o("trash-2",z);function K({value:e,preserveStateBool:d,preserveScrollBool:u}){if(!e.links)return null;const r=t=>{g.visit(t,{preserveState:d,preserveScroll:u})};return n.jsxs("nav",{className:"mt-6 flex items-center justify-center space-x-1","aria-label":"Pagination",children:[n.jsx("button",{onClick:()=>r(e.prev_page_url),disabled:!e.prev_page_url,className:`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${e.prev_page_url?"bg-white hover:bg-gray-100":"bg-gray-50"}`,"aria-label":"",children:n.jsx(x,{size:20})}),e.links.map((t,i)=>{if(t.label==="...")return n.jsx("span",{className:"px-3 py-1 rounded-md border bg-white text-gray-500",children:n.jsx(f,{size:16})},i);const c=t.active;return Number.isNaN(+t.label)?t.label:+t.label,n.jsx("button",{onClick:()=>t.url&&r(t.url),dangerouslySetInnerHTML:{__html:t.label},className:`px-3 py-1 rounded-md border transition
              ${c?"bg-blue-600 text-white border-transparent":"bg-white text-blue-600 hover:bg-blue-50"}
            `,"aria-current":c?"page":void 0},i)}),n.jsx("button",{onClick:()=>r(e.next_page_url),disabled:!e.next_page_url,className:`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${e.next_page_url?"bg-white hover:bg-gray-100":"bg-gray-50"}`,"aria-label":"",children:n.jsx(m,{size:20})})]})}const C=e=>n.jsx("button",{className:"px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",...e,children:"Submit"}),L=e=>n.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",...e,children:"Edit"}),B=e=>n.jsx("button",{className:"px-4 py-2 bg-green-600 text-white rounded-md font-semibold transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500",...e,children:"Update"}),$=e=>n.jsx("button",{className:"px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",...e,children:"Save"}),I=e=>n.jsx("button",{className:"px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",...e,children:"Delete"}),S=e=>n.jsx("button",{className:"p-2 bg-blue-600 text-white rounded-full transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",...e,children:n.jsx(a,{size:16})}),E=e=>n.jsx("button",{className:"p-2 bg-gray-200 text-gray-800 rounded-full transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",...e,children:n.jsx(l,{size:16})}),H=e=>n.jsx("button",{className:"p-2 bg-green-600 text-white rounded-full transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500",...e,children:n.jsx(_,{size:16})}),P=e=>n.jsx("button",{className:"p-2 bg-indigo-600 text-white rounded-full transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",...e,children:n.jsx(w,{size:16})}),U=e=>n.jsx("button",{className:"p-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",...e,children:n.jsx(M,{size:16})}),O={SubmitButton:C,EditButton:L,UpdateButton:B,SaveButton:$,DeleteButton:I,IconSubmitButton:S,IconEditButton:E,IconUpdateButton:H,IconSaveButton:P,IconDeleteButton:U},A=e=>{s,{...e}},V=e=>{s,{...e}},D=e=>{s,{...e}},R=e=>n.jsx(s,{...e,children:n.jsx(CirclePlus,{size:16})}),q=e=>n.jsx(s,{...e,className:"inline-flex items-center rounded-md bg-yellow-100 p-2 hover:bg-yellow-200",children:n.jsx(l,{size:16})}),T=e=>n.jsx(s,{...e,className:"inline-flex items-center rounded-md bg-green-100 p-2 hover:bg-green-200",children:n.jsx(a,{size:16})}),Q={LinkCreate:A,LinkEdit:V,LinkAssign:D,LinkIconCreate:R,LinkIconEdit:q,LinkIconAssign:T};export{O as B,K as C,Q as L,J as P};
