import{r as l,c as E,t as te}from"./app-DsVvwk6J.js";import{n as R,s as B,O as Ce,K as Q,y as ie,A as w,o as $,m as Fe,t as ye,L as se,a as Te,u as ue}from"./use-sync-refs-DNgf-CQf.js";function $e(e){typeof queueMicrotask=="function"?queueMicrotask(e):Promise.resolve().then(e).catch(t=>setTimeout(()=>{throw t}))}function q(){let e=[],t={addEventListener(n,r,i,u){return n.addEventListener(r,i,u),t.add(()=>n.removeEventListener(r,i,u))},requestAnimationFrame(...n){let r=requestAnimationFrame(...n);return t.add(()=>cancelAnimationFrame(r))},nextFrame(...n){return t.requestAnimationFrame(()=>t.requestAnimationFrame(...n))},setTimeout(...n){let r=setTimeout(...n);return t.add(()=>clearTimeout(r))},microTask(...n){let r={current:!0};return $e(()=>{r.current&&n[0]()}),t.add(()=>{r.current=!1})},style(n,r,i){let u=n.style.getPropertyValue(r);return Object.assign(n.style,{[r]:i}),this.add(()=>{Object.assign(n.style,{[r]:u})})},group(n){let r=q();return n(r),this.add(()=>r.dispose())},add(n){return e.includes(n)||e.push(n),()=>{let r=e.indexOf(n);if(r>=0)for(let i of e.splice(r,1))i()}},dispose(){for(let n of e.splice(0))n()}};return t}function ae(){let[e]=l.useState(q);return l.useEffect(()=>()=>e.dispose(),[e]),e}function Se(e=0){let[t,n]=l.useState(e),r=l.useCallback(s=>n(s),[t]),i=l.useCallback(s=>n(o=>o|s),[t]),u=l.useCallback(s=>(t&s)===s,[t]),f=l.useCallback(s=>n(o=>o&~s),[n]),c=l.useCallback(s=>n(o=>o^s),[n]);return{flags:t,setFlag:r,addFlag:i,hasFlag:u,removeFlag:f,toggleFlag:c}}var Ae={},re,le;typeof process<"u"&&typeof globalThis<"u"&&typeof Element<"u"&&((re=process==null?void 0:Ae)==null?void 0:re.NODE_ENV)==="test"&&typeof((le=Element==null?void 0:Element.prototype)==null?void 0:le.getAnimations)>"u"&&(Element.prototype.getAnimations=function(){return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.","Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.","","Example usage:","```js","import { mockAnimationsApi } from 'jsdom-testing-mocks'","mockAnimationsApi()","```"].join(`
`)),[]});var we=(e=>(e[e.None=0]="None",e[e.Closed=1]="Closed",e[e.Enter=2]="Enter",e[e.Leave=4]="Leave",e))(we||{});function xe(e){let t={};for(let n in e)e[n]===!0&&(t[`data-${n}`]="");return t}function Re(e,t,n,r){let[i,u]=l.useState(n),{hasFlag:f,addFlag:c,removeFlag:s}=Se(e&&i?3:0),o=l.useRef(!1),h=l.useRef(!1),C=ae();return R(()=>{var b;if(e){if(n&&u(!0),!t){n&&c(3);return}return(b=r==null?void 0:r.start)==null||b.call(r,n),Pe(t,{inFlight:o,prepare(){h.current?h.current=!1:h.current=o.current,o.current=!0,!h.current&&(n?(c(3),s(4)):(c(4),s(2)))},run(){h.current?n?(s(3),c(4)):(s(4),c(3)):n?s(1):c(1)},done(){var d;h.current&&typeof t.getAnimations=="function"&&t.getAnimations().length>0||(o.current=!1,s(7),n||u(!1),(d=r==null?void 0:r.end)==null||d.call(r,n))}})}},[e,n,t,C]),e?[i,{closed:f(1),enter:f(2),leave:f(4),transition:f(2)||f(4)}]:[n,{closed:void 0,enter:void 0,leave:void 0,transition:void 0}]}function Pe(e,{prepare:t,run:n,done:r,inFlight:i}){let u=q();return Le(e,{prepare:t,inFlight:i}),u.nextFrame(()=>{n(),u.requestAnimationFrame(()=>{u.add(Oe(e,r))})}),u.dispose}function Oe(e,t){var n,r;let i=q();if(!e)return i.dispose;let u=!1;i.add(()=>{u=!0});let f=(r=(n=e.getAnimations)==null?void 0:n.call(e).filter(c=>c instanceof CSSTransition))!=null?r:[];return f.length===0?(t(),i.dispose):(Promise.allSettled(f.map(c=>c.finished)).then(()=>{u||t()}),i.dispose)}function Le(e,{inFlight:t,prepare:n}){if(t!=null&&t.current){n();return}let r=e.style.transition;e.style.transition="none",n(),e.offsetHeight,e.style.transition=r}let M=l.createContext(null);M.displayName="OpenClosedContext";var x=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(x||{});function oe(){return l.useContext(M)}function ke({value:e,children:t}){return E.createElement(M.Provider,{value:e},t)}function Ke({children:e}){return E.createElement(M.Provider,{value:null},e)}function He(){let e=typeof document>"u";return"useSyncExternalStore"in te?(t=>t.useSyncExternalStore)(te)(()=>()=>{},()=>!1,()=>!e):!1}function de(){let e=He(),[t,n]=l.useState(B.isHandoffComplete);return t&&B.isHandoffComplete===!1&&n(!1),l.useEffect(()=>{t!==!0&&n(!0)},[t]),l.useEffect(()=>B.handoff(),[]),e?!1:t}function Ne(){let e=l.useRef(!1);return R(()=>(e.current=!0,()=>{e.current=!1}),[]),e}function fe(e){var t;return!!(e.enter||e.enterFrom||e.enterTo||e.leave||e.leaveFrom||e.leaveTo)||((t=e.as)!=null?t:me)!==l.Fragment||E.Children.count(e.children)===1}let U=l.createContext(null);U.displayName="TransitionContext";var je=(e=>(e.Visible="visible",e.Hidden="hidden",e))(je||{});function qe(){let e=l.useContext(U);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}function Me(){let e=l.useContext(D);if(e===null)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}let D=l.createContext(null);D.displayName="NestingContext";function I(e){return"children"in e?I(e.children):e.current.filter(({el:t})=>t.current!==null).filter(({state:t})=>t==="visible").length>0}function ce(e,t){let n=Te(e),r=l.useRef([]),i=Ne(),u=ae(),f=$((d,a=w.Hidden)=>{let p=r.current.findIndex(({el:m})=>m===d);p!==-1&&(ue(a,{[w.Unmount](){r.current.splice(p,1)},[w.Hidden](){r.current[p].state="hidden"}}),u.microTask(()=>{var m;!I(r)&&i.current&&((m=n.current)==null||m.call(n))}))}),c=$(d=>{let a=r.current.find(({el:p})=>p===d);return a?a.state!=="visible"&&(a.state="visible"):r.current.push({el:d,state:"visible"}),()=>f(d,w.Unmount)}),s=l.useRef([]),o=l.useRef(Promise.resolve()),h=l.useRef({enter:[],leave:[]}),C=$((d,a,p)=>{s.current.splice(0),t&&(t.chains.current[a]=t.chains.current[a].filter(([m])=>m!==d)),t==null||t.chains.current[a].push([d,new Promise(m=>{s.current.push(m)})]),t==null||t.chains.current[a].push([d,new Promise(m=>{Promise.all(h.current[a].map(([S,P])=>P)).then(()=>m())})]),a==="enter"?o.current=o.current.then(()=>t==null?void 0:t.wait.current).then(()=>p(a)):p(a)}),b=$((d,a,p)=>{Promise.all(h.current[a].splice(0).map(([m,S])=>S)).then(()=>{var m;(m=s.current.shift())==null||m()}).then(()=>p(a))});return l.useMemo(()=>({children:r,register:c,unregister:f,onStart:C,onStop:b,wait:o,chains:h}),[c,f,r,C,b,h,o])}let me=l.Fragment,pe=Ce.RenderStrategy;function Ue(e,t){var n,r;let{transition:i=!0,beforeEnter:u,afterEnter:f,beforeLeave:c,afterLeave:s,enter:o,enterFrom:h,enterTo:C,entered:b,leave:d,leaveFrom:a,leaveTo:p,...m}=e,[S,P]=l.useState(null),v=l.useRef(null),y=fe(e),A=ie(...y?[v,t,P]:t===null?[]:[t]),W=(n=m.unmount)==null||n?w.Unmount:w.Hidden,{show:F,appear:X,initial:Y}=qe(),[T,z]=l.useState(F?"visible":"hidden"),Z=Me(),{register:k,unregister:H}=Z;R(()=>k(v),[k,v]),R(()=>{if(W===w.Hidden&&v.current){if(F&&T!=="visible"){z("visible");return}return ue(T,{hidden:()=>H(v),visible:()=>k(v)})}},[T,v,k,H,F,W]);let V=de();R(()=>{if(y&&V&&T==="visible"&&v.current===null)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")},[v,T,V,y]);let ve=Y&&!X,J=X&&F&&Y,_=l.useRef(!1),N=ce(()=>{_.current||(z("hidden"),H(v))},Z),ee=$(K=>{_.current=!0;let j=K?"enter":"leave";N.onStart(v,j,L=>{L==="enter"?u==null||u():L==="leave"&&(c==null||c())})}),ne=$(K=>{let j=K?"enter":"leave";_.current=!1,N.onStop(v,j,L=>{L==="enter"?f==null||f():L==="leave"&&(s==null||s())}),j==="leave"&&!I(N)&&(z("hidden"),H(v))});l.useEffect(()=>{y&&i||(ee(F),ne(F))},[F,y,i]);let ge=!(!i||!y||!V||ve),[,g]=Re(ge,S,F,{start:ee,end:ne}),Ee=Fe({ref:A,className:((r=ye(m.className,J&&o,J&&h,g.enter&&o,g.enter&&g.closed&&h,g.enter&&!g.closed&&C,g.leave&&d,g.leave&&!g.closed&&a,g.leave&&g.closed&&p,!g.transition&&F&&b))==null?void 0:r.trim())||void 0,...xe(g)}),O=0;T==="visible"&&(O|=x.Open),T==="hidden"&&(O|=x.Closed),g.enter&&(O|=x.Opening),g.leave&&(O|=x.Closing);let be=se();return E.createElement(D.Provider,{value:N},E.createElement(ke,{value:O},be({ourProps:Ee,theirProps:m,defaultTag:me,features:pe,visible:T==="visible",name:"Transition.Child"})))}function De(e,t){let{show:n,appear:r=!1,unmount:i=!0,...u}=e,f=l.useRef(null),c=fe(e),s=ie(...c?[f,t]:t===null?[]:[t]);de();let o=oe();if(n===void 0&&o!==null&&(n=(o&x.Open)===x.Open),n===void 0)throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[h,C]=l.useState(n?"visible":"hidden"),b=ce(()=>{n||C("hidden")}),[d,a]=l.useState(!0),p=l.useRef([n]);R(()=>{d!==!1&&p.current[p.current.length-1]!==n&&(p.current.push(n),a(!1))},[p,n]);let m=l.useMemo(()=>({show:n,appear:r,initial:d}),[n,r,d]);R(()=>{n?C("visible"):!I(b)&&f.current!==null&&C("hidden")},[n,b]);let S={unmount:i},P=$(()=>{var A;d&&a(!1),(A=e.beforeEnter)==null||A.call(e)}),v=$(()=>{var A;d&&a(!1),(A=e.beforeLeave)==null||A.call(e)}),y=se();return E.createElement(D.Provider,{value:b},E.createElement(U.Provider,{value:m},y({ourProps:{...S,as:l.Fragment,children:E.createElement(he,{ref:s,...S,...u,beforeEnter:P,beforeLeave:v})},theirProps:{},defaultTag:l.Fragment,features:pe,visible:h==="visible",name:"Transition"})))}function Ie(e,t){let n=l.useContext(U)!==null,r=oe()!==null;return E.createElement(E.Fragment,null,!n&&r?E.createElement(G,{ref:t,...e}):E.createElement(he,{ref:t,...e}))}let G=Q(De),he=Q(Ue),ze=Q(Ie),Be=Object.assign(G,{Child:ze,Root:G});export{ze as F,Ne as f,x as i,de as l,q as o,ae as p,Ke as s,$e as t,oe as u,Be as z};
