(this["webpackJsonpparvaty-admin-panel"]=this["webpackJsonpparvaty-admin-panel"]||[]).push([[7],{508:function(e,t,n){"use strict";n.r(t);var a=n(162),r=n(58),s=n(641),c=n(1),o=n(19),i=n(161),l=n.n(i),u=n(639),h=n(637),j=n(638),d=n(24);t.default=function(){var e=Object(o.g)(),t=Object(o.i)(),n=l.a.get("authToken"),i=Object(c.useState)(!1),f=Object(s.a)(i,2),b=f[0],m=f[1],p=Object(c.useState)({show:!1,text:null,type:"info"}),O=Object(s.a)(p,2),x=O[0],g=O[1],y=Object(c.useState)({token:null,email:null,password:null,password_confirmation:null}),w=Object(s.a)(y,2),v=w[0],S=w[1];Object(c.useEffect)((function(){S((function(e){return Object(r.a)(Object(r.a)({},e),{},{email:t.email,token:t.token})}))}),[t]);var k=function(e){S(Object(r.a)(Object(r.a)({},v),{},Object(a.a)({},e.target.name,e.target.value)))},N=function(){m(!0),(new u.a).get("POST","/reset/password",v,!1,(function(t,n){m(!1),g({show:!0,text:n,type:"success"}),setTimeout((function(){e.push("/login")}),1e3)}),(function(e){m(!1),g({show:!0,text:e,type:"danger"})}))};return Object(d.jsxs)("div",{className:"c-app c-default-layout flex-row align-items-center",children:["undefined"===n||void 0===n||""===n||null===n?void l.a.remove("authToken"):Object(d.jsx)(o.a,{to:"/dashboard"}),Object(d.jsx)(h.m,{children:Object(d.jsx)(h.L,{className:"justify-content-center",children:Object(d.jsx)(h.l,{md:"5",children:Object(d.jsx)(h.j,{children:Object(d.jsx)(h.g,{className:"p-4",children:Object(d.jsxs)(h.h,{children:[Object(d.jsx)("h1",{children:"Reset Password"}),Object(d.jsx)("p",{className:"text-muted",children:"Enter new password"}),Object(d.jsx)(h.a,{color:x.type,show:x.show,onShowChange:function(e){g(Object(r.a)(Object(r.a)({},x),{},{show:e}))},closeButton:!0,children:x.text}),Object(d.jsxs)(h.v,{onSubmit:function(e){e.preventDefault(),N()},children:[Object(d.jsxs)(h.B,{className:"mb-3",children:[Object(d.jsx)(h.D,{children:Object(d.jsx)(h.E,{children:Object(d.jsx)(j.a,{name:"cil-lock-locked"})})}),Object(d.jsx)(h.A,{name:"password",type:"password",placeholder:"Password",onChange:k})]}),Object(d.jsxs)(h.B,{className:"mb-3",children:[Object(d.jsx)(h.D,{children:Object(d.jsx)(h.E,{children:Object(d.jsx)(j.a,{name:"cil-lock-locked"})})}),Object(d.jsx)(h.A,{name:"password_confirmation",type:"password",placeholder:"Confirm Password",onChange:k})]}),Object(d.jsxs)(h.L,{children:[Object(d.jsx)(h.l,{xs:"6",className:"text-left",children:Object(d.jsx)(h.f,{to:"/login",color:"link",className:"",children:"Login"})}),Object(d.jsx)(h.l,{xs:"6",className:"text-right",children:Object(d.jsx)(h.f,{color:"primary",type:"submit",className:"px-4",children:b?Object(d.jsx)(h.U,{className:"mt-1",color:"light",size:"sm"}):"Reset"})})]})]})]})})})})})})]})}},639:function(e,t,n){"use strict";var a=n(640),r=n(163);t.a=function e(){var t=this;Object(a.a)(this,e),this.get=function(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(){},c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:function(){},o={};if(o.method=e,r){var i=new Headers;i.append("Authorization","Bearer "+t.state.authToken),o.headers=i}if(a){var l=t.getFormData(a);o.body=l}fetch(t.baseUrl+n,o).then((function(e){return e.json()})).then((function(e){1===e.status?s(e.data,e.message):c(e.message)}),(function(e){c("Something went wrong, please contact the admin or try again later.")}))},this.getFormData=function(e){var t=new FormData;if(e)for(var n in e)e.hasOwnProperty(n)&&t.append(n,e[n]);return t},this.checkUser=function(){t.get("GET","/check",null,!0,(function(e,t){r.a.dispatch({type:"set",userPermissions:e}),localStorage.setItem("userPermissions",JSON.stringify(e))}),(function(e){console.log(e)}))},this.baseUrl="https://parvaty.me/api/admin",this.state=r.a.getState()}},640:function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}n.d(t,"a",(function(){return a}))},641:function(e,t,n){"use strict";function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,r=!1,s=void 0;try{for(var c,o=e[Symbol.iterator]();!(a=(c=o.next()).done)&&(n.push(c.value),!t||n.length!==t);a=!0);}catch(i){r=!0,s=i}finally{try{a||null==o.return||o.return()}finally{if(r)throw s}}return n}}(e,t)||function(e,t){if(e){if("string"===typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}n.d(t,"a",(function(){return r}))}}]);
//# sourceMappingURL=7.b83e0cad.chunk.js.map