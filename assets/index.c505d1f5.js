function e(e,t){const n=Object.create(null),r=e.split(",");for(let o=0;o<r.length;o++)n[r[o]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();e("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt");e("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot"),e("svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view"),e("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr");const t=Object.assign,n=Object.prototype.hasOwnProperty,r=(e,t)=>n.call(e,t),o=Object.prototype.toString,s=Array.isArray,i=e=>"symbol"==typeof e,c=e=>null!==e&&"object"==typeof e,a=e=>{return(t=e,o.call(t)).slice(8,-1);var t},l=e=>"string"==typeof e&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e;e(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");const u=(e,t)=>!Object.is(e,t),f=e=>{const t=new Set(e);return t.w=0,t.n=0,t},h=new WeakMap;let p=!0;const d=[];function g(){const e=d.pop();p=void 0===e||e}const m=Symbol(""),b=[];let y;class v{constructor(e,t=null){this.fn=e,this.scheduler=t,this.active=!0,this.deps=[],this.fn=e,this.scheduler=t}run(){if(!this.active)return this.fn();if(!b.includes(this))try{return b.push(y=this),d.push(p),p=!0,this.fn()}finally{g(),b.pop();const e=b.length;y=e>0?b[e-1]:void 0}}stop(){this.active&&(this.onStop&&this.onStop(),this.active=!1)}}function w(e,n){const r=function(e,t){return new v(e)}(e);n&&t(r,n),n&&n.lazy||r.run();const o=r.run.bind(r);return o.effect=r,o}function _(e,t,n){if(!p||void 0===y)return;let r=h.get(e);r||h.set(e,r=new Map);let o=r.get(n);o||r.set(n,o=f()),function(e){let t=!1;t=!e.has(y),t&&(e.add(y),y.deps.push(e))}(o)}function M(e,t,n,r,o){const i=h.get(e);if(!i)return;let c=[];if("clear"===t)c=[...i.values()];else if("length"===n&&s(e))i.forEach(((e,t)=>{("length"===t||t>=r)&&c.push(e)}));else switch(void 0!==n&&c.push(i.get(n)),t){case"add":s(e)?l(n)&&c.push(i.get("length")):c.push(i.get(m))}if(1===c.length)c[0]&&k(c[0]);else{const e=[];for(const t of c)t&&e.push(...t);k(f(e))}}function k(e){for(const t of s(e)?e:[...e])(t!==y||t.allowRecurse)&&(t.scheduler?t.scheduler():t.run())}const R=new Set(Object.getOwnPropertyNames(Symbol).map((e=>Symbol[e])).filter(i));const S=function(){const e={};return["indexOf","lastIndexOf","includes"].forEach((t=>{e[t]=function(...e){const n=T(this);for(let t=0;t<this.length;t++)_(n,0,t+"");const r=n[t](...e);return-1===r||!1===r?n[t](...e.map(T)):r}})),["push","pop","shift","unshift","splice"].forEach((t=>{e[t]=function(...e){d.push(p),p=!1;const n=T(this)[t].apply(this,e);return g(),n}})),e}();function O(e=!1,t=!1){return function(n,o,i){if("__v_isReactive"===o)return!e;if("__v_isReadonly"===o)return e;if("__v_raw"===o&&i===(e?t?W:V:t?U:B).get(n))return n;const a=s(n);if(!e&&a&&r(S,o))return Reflect.get(S,o,i);const l=Reflect.get(n,o,i);return e||_(n,0,o),t?l:c(l)?e?function(e){return F(e,!0,A,V)}(l):D(l):l}}const C=O(),N=O(!1,!0),x=O(!0),E=O(!0,!0);function L(e=!1){return function(t,n,o,i){let c=t[n];e||(o=T(o),c=T(c));const a=s(t)&&l(n)?Number(n)<t.length:r(t,n),f=Reflect.set(t,n,o,i);return t===T(i)&&(a?u(o,c)&&M(t,"set",n,o):M(t,"add",n,o)),f}}const j=L(),I=L(!0);const P={get:C,set:j,deleteProperty:function(e,t){const n=r(e,t);e[t];const o=Reflect.deleteProperty(e,t);return o&&n&&M(e,"delete",t,void 0),o},has:function(e,t){const n=Reflect.has(e,t);return i(t)&&R.has(t)||_(e,0,t),n},ownKeys:function(e){return _(e,0,s(e)?"length":m),Reflect.ownKeys(e)}},A={get:x,set:(e,t)=>!0,deleteProperty:(e,t)=>!0};t({},P,{get:N,set:I}),t({},A,{get:E});const B=new WeakMap,V=new WeakMap,U=new WeakMap,W=new WeakMap;function F(e,t,n,r){if(!c(e))return e;if(e.__v_raw&&(!t||!e.__v_isReactive))return e;const o=r.get(e);if(o)return o;if(0===function(e){return e.__v_skip||!Object.isExtensible(e)?0:function(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}(a(e))}(e))return e;const s=new Proxy(e,n);return r.set(e,s),s}function D(e){return e&&e.__v_isReactive?e:F(e,!1,P,B)}function T(e){const t=e&&e.__v_raw;return t?T(t):e}const q=e=>c(e)?D(e):e;class G{constructor(e,t){this._shallow=t,this.__v_isRef=!0,this._rawValue=t?e:T(e),this._value=t?e:q(e)}get value(){return _(this,0,"value"),this._value}set value(e){e=this._shallow?e:T(e),u(e,this._rawValue)&&(this._rawValue=e,this._value=this._shallow?e:q(e),M(this,"set","value",e))}}function K(e,t=!1){return n=e,Boolean(n&&!0===n.__v_isRef)?e:new G(e,t);var n}function z(e,t){if(e.tag===t.tag){const n=t.el=e.el,r=e.props||{},o=t.props||{};for(const e in o){const t=r[e],s=o[e];t!==s&&(null==n||n.setAttribute(e,s))}for(const e in r)e in o||null==n||n.removeAttribute(e);const i=e.children,c=t.children;if("string"==typeof c)"string"==typeof i?i!==c&&(n.textContent=c):n.textContent=c;else if(s(c))if("string"==typeof i)n.innerHTML="",c.forEach((e=>{H(e,n)}));else if(s(i)){const e=Math.min(i.length,c.length);for(let t=0;t<e;t++)z(i[t],c[t]);c.length>i.length?c.slice(i.length).forEach((e=>{H(e,n)})):c.length<i.length&&i.slice(c.length).forEach((e=>{n.removeChild(e)}))}}}function H(e,t){const n=e.el=document.createElement(e.tag);if(e.props)for(const r in e.props){const t=e.props[r];r.startsWith("on")?n.addEventListener(r.slice(2).toLowerCase(),t):n.setAttribute(r,t)}e.children&&("string"==typeof e.children?n.textContent=e.children:s(e.children)&&e.children.forEach((e=>{H(e,n)}))),t.appendChild(n)}const J=K(1);(function(e){let t,n=!1;return{mount:function(r){const o=document.querySelector(r);if(!o)throw new Error("未找到挂载 DOM");w((()=>{if(n){const n=e.render();z(t,n),t=n}else t=e.render(),H(t,o),n=!0}))}}})({data:D({count:1}),render(){return e="button",t={class:"blue",onClick:()=>{J.value++}},n=String(J.value),{tag:e,props:t,children:n};var e,t,n}}).mount("#app");
