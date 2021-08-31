var e,t=(e,t,n)=>{if(!t.has(e))throw TypeError("Cannot "+n)},n=(e,n,o)=>(t(e,n,"read from private field"),o?o.call(e):n.get(e));let o;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class r{constructor(){var n,o,r,i;((e,t,n)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,n)})(this,e,void 0),n=this,o=e,r=new Set,t(n,o,"write to private field"),i?i.call(n,r):o.set(n,r)}depend(){o&&n(this,e).add(o)}notify(){n(this,e).forEach((e=>e()))}}e=new WeakMap;const i=new WeakMap;function a(e,t){i.has(e)||i.set(e,new Map);const n=i.get(e);return n.has(t)||n.set(t,new r),n.get(t)}const s={get:(e,t,n)=>(a(e,t).depend(),Reflect.get(e,t,n)),set(e,t,n,o){const r=a(e,t),i=Reflect.set(e,t,n,o);return r.notify(),i}};function l(e,t){const n=Object.create(null),o=e.split(",");for(let r=0;r<o.length;r++)n[o[r]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}l("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt");l("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot"),l("svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view"),l("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr");const c=Array.isArray;function d(e,t){if(e.tag===t.tag){const n=t.el=e.el,o=e.props||{},r=t.props||{};for(const e in r){const t=o[e],i=r[e];t!==i&&(null==n||n.setAttribute(e,i))}for(const e in o)e in r||null==n||n.removeAttribute(e);const i=e.children,a=t.children;if("string"==typeof a)"string"==typeof i?i!==a&&(n.textContent=a):n.textContent=a;else if(c(a))if("string"==typeof i)n.innerHTML="",a.forEach((e=>{f(e,n)}));else if(c(i)){const e=Math.min(i.length,a.length);for(let t=0;t<e;t++)d(i[t],a[t]);a.length>i.length?a.slice(i.length).forEach((e=>{f(e,n)})):a.length<i.length&&i.slice(a.length).forEach((e=>{n.removeChild(e)}))}}}function f(e,t){const n=e.el=document.createElement(e.tag);if(e.props)for(const o in e.props){const t=e.props[o];o.startsWith("on")?n.addEventListener(o.slice(2).toLowerCase(),t):n.setAttribute(o,t)}e.children&&("string"==typeof e.children?n.textContent=e.children:c(e.children)&&e.children.forEach((e=>{f(e,n)}))),t.appendChild(n)}l(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");var p;(function(e){let t,n=!1;return{mount:function(r){const i=document.querySelector(r);if(!i)throw new Error("未找到挂载 DOM");var a;o=a=()=>{if(n){const n=e.render();d(t,n),t=n}else t=e.render(),f(t,i),n=!0},a(),o=null}}})({data:(p={count:1},new Proxy(p,s)),render(){return e="button",t={class:"blue",onClick:()=>{console.log(this.data),this.data.count++}},n=String(this.data.count),{tag:e,props:t,children:n};var e,t,n}}).mount("#app");
