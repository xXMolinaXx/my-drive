(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[971],{8829:function(e,t,a){Promise.resolve().then(a.bind(a,5080))},8525:function(e,t,a){"use strict";a.d(t,{V:function(){return s}});var n=a(4535),r=a(7542);function s(e){return(0,r.ZP)("MuiDivider",e)}let o=(0,n.Z)("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);t.Z=o},2733:function(e,t,a){"use strict";a.d(t,{f:function(){return s}});var n=a(4535),r=a(7542);function s(e){return(0,r.ZP)("MuiListItemIcon",e)}let o=(0,n.Z)("MuiListItemIcon",["root","alignItemsFlexStart"]);t.Z=o},467:function(e,t,a){"use strict";a.d(t,{L:function(){return s}});var n=a(4535),r=a(7542);function s(e){return(0,r.ZP)("MuiListItemText",e)}let o=(0,n.Z)("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]);t.Z=o},1656:function(e,t,a){"use strict";a.d(t,{Z:function(){return I}});var n=a(3950),r=a(2988),s=a(2265),o=a(4839),i=a(6259),l=a(317),c=a(8024),d=a(1738),u=a(9281),m=a(1175),p=a(7023),h=a(8632),g=a(909),x=a(8525),f=a(2733),v=a(467),Z=a(4535),y=a(7542);function j(e){return(0,y.ZP)("MuiMenuItem",e)}let b=(0,Z.Z)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]);var C=a(7437);let w=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],N=e=>{let{disabled:t,dense:a,divider:n,disableGutters:s,selected:o,classes:l}=e,c=(0,i.Z)({root:["root",a&&"dense",t&&"disabled",!s&&"gutters",n&&"divider",o&&"selected"]},j,l);return(0,r.Z)({},l,c)},P=(0,c.ZP)(p.Z,{shouldForwardProp:e=>(0,d.Z)(e)||"classes"===e,name:"MuiMenuItem",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:a}=e;return[t.root,a.dense&&t.dense,a.divider&&t.divider,!a.disableGutters&&t.gutters]}})(e=>{let{theme:t,ownerState:a}=e;return(0,r.Z)({},t.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!a.disableGutters&&{paddingLeft:16,paddingRight:16},a.divider&&{borderBottom:"1px solid ".concat((t.vars||t).palette.divider),backgroundClip:"padding-box"},{"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},["&.".concat(b.selected)]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / ").concat(t.vars.palette.action.selectedOpacity,")"):(0,l.Fq)(t.palette.primary.main,t.palette.action.selectedOpacity),["&.".concat(b.focusVisible)]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / calc(").concat(t.vars.palette.action.selectedOpacity," + ").concat(t.vars.palette.action.focusOpacity,"))"):(0,l.Fq)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},["&.".concat(b.selected,":hover")]:{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / calc(").concat(t.vars.palette.action.selectedOpacity," + ").concat(t.vars.palette.action.hoverOpacity,"))"):(0,l.Fq)(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?"rgba(".concat(t.vars.palette.primary.mainChannel," / ").concat(t.vars.palette.action.selectedOpacity,")"):(0,l.Fq)(t.palette.primary.main,t.palette.action.selectedOpacity)}},["&.".concat(b.focusVisible)]:{backgroundColor:(t.vars||t).palette.action.focus},["&.".concat(b.disabled)]:{opacity:(t.vars||t).palette.action.disabledOpacity},["& + .".concat(x.Z.root)]:{marginTop:t.spacing(1),marginBottom:t.spacing(1)},["& + .".concat(x.Z.inset)]:{marginLeft:52},["& .".concat(v.Z.root)]:{marginTop:0,marginBottom:0},["& .".concat(v.Z.inset)]:{paddingLeft:36},["& .".concat(f.Z.root)]:{minWidth:36}},!a.dense&&{[t.breakpoints.up("sm")]:{minHeight:"auto"}},a.dense&&(0,r.Z)({minHeight:32,paddingTop:4,paddingBottom:4},t.typography.body2,{["& .".concat(f.Z.root," svg")]:{fontSize:"1.25rem"}}))});var I=s.forwardRef(function(e,t){let a;let i=(0,u.Z)({props:e,name:"MuiMenuItem"}),{autoFocus:l=!1,component:c="li",dense:d=!1,divider:p=!1,disableGutters:x=!1,focusVisibleClassName:f,role:v="menuitem",tabIndex:Z,className:y}=i,j=(0,n.Z)(i,w),b=s.useContext(m.Z),I=s.useMemo(()=>({dense:d||b.dense||!1,disableGutters:x}),[b.dense,d,x]),k=s.useRef(null);(0,h.Z)(()=>{l&&k.current&&k.current.focus()},[l]);let S=(0,r.Z)({},i,{dense:I.dense,divider:p,disableGutters:x}),T=N(i),O=(0,g.Z)(k,t);return i.disabled||(a=void 0!==Z?Z:-1),(0,C.jsx)(m.Z.Provider,{value:I,children:(0,C.jsx)(P,(0,r.Z)({ref:O,role:v,tabIndex:a,component:c,focusVisibleClassName:(0,o.Z)(T.focusVisible,f),className:(0,o.Z)(T.root,y)},j,{ownerState:S,classes:T}))})})},5080:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return f}});var n=a(7437);a(273);var r=a(6648),s=a(6463),o=a(8433),i=a(4990),l=a(511),c=a(3473),d=a(6548),u=a(1656),m=a(2265),p=a(5410),h=a(7478);let g=/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;var x=a(301);function f(){let e=(0,s.useRouter)(),[t,a]=(0,m.useState)(!1),[f,v]=(0,m.useState)(!1),[Z,y]=(0,m.useState)(""),[j,b]=(0,m.useState)("ingreso"),[C,w]=(0,m.useState)({fullName:"",email:"",telphone:"",DNI:"",bornAt:new Date,gender:"hombre",password:"",confirmPassword:""}),[N,P]=(0,m.useState)({fullName:"",email:"",telphone:"",DNI:"",bornAt:new Date,gender:"",password:"",confirmPassword:""}),[I,k]=(0,m.useState)("success"),S=e=>{w({...C,[e.target.id]:e.target.value})};if((0,m.useEffect)(()=>{(0,x.C)()&&e.push("/catalog"),a(!0)},[]),t)return(0,n.jsx)("main",{children:(0,n.jsxs)("section",{className:"min-h-screen",children:[(0,n.jsx)(o.ZP,{className:"p-5 ",height:"100%",container:!0,justifyContent:"center",alignItems:"center",children:(0,n.jsx)(o.ZP,{item:!0,xs:12,md:6,lg:6,className:"w-94",children:(0,n.jsxs)(i.Z,{elevation:3,className:"p-5 w-94",children:[(0,n.jsx)(o.ZP,{container:!0,justifyContent:"center",alignItems:"center",children:(0,n.jsx)(r.default,{src:"/LCM-logo.png",width:100,height:100,alt:"logo lcm"})}),(0,n.jsxs)(o.ZP,{height:"100%",container:!0,spacing:2,justifyContent:"center",alignItems:"center",children:["ingreso"===j&&(0,n.jsxs)(o.ZP,{container:!0,item:!0,xs:12,justifyContent:"center",alignItems:"center",children:[(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(l.Z,{variant:"h4",textAlign:"center",children:"Ingresar"})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{className:"my-2",label:"Correo",variant:"outlined",fullWidth:!0,type:"email",id:"email",value:C.email,onChange:S,error:!!N.email,helperText:N.email})}),(0,n.jsxs)(o.ZP,{xs:12,children:[(0,n.jsx)(c.Z,{className:"my-2",label:"contrase\xf1a",variant:"outlined",type:"password",fullWidth:!0,id:"password",error:!!N.password,helperText:N.password,value:C.password,onChange:S}),(0,n.jsx)(d.Z,{variant:"text",className:"my-2",onClick:()=>b("newPassword"),children:"\xbfOlvidastes tu contrase\xf1a?"})]}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"text",className:"my-2",onClick:()=>b("registro"),children:"\xbfA\xfan no tienes usuario?"})}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"contained",className:"my-2",onClick:()=>{var t=new Date(new Date().getTime()+864e5);t.toLocaleDateString();let a=!1,n={fullName:"",email:"",telphone:"",DNI:"",bornAt:new Date,gender:"",password:"",confirmPassword:""};if(C.email||(n.email="Ingrese su correo",a=!0),C.password||(n.password="Ingrese una contrase\xf1a",a=!0),a){P(n);return}fetch("".concat(p.v.backend,"/auth/login"),{method:"POST",body:JSON.stringify({username:C.email,password:C.password}),headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat((0,x.C)())}}).then(e=>e.json()).then(a=>{200===a.statusCode?(document.cookie="access_token=".concat(a.data.access_token,"; expires=").concat(t),localStorage.setItem("user",JSON.stringify({...a.data,access_token:null})),"client"===a.data.role?e.push("/catalog"):"admin"===a.data.role&&e.push("/lcmadminlcm")):(y(a.message),v(!0))}).catch(e=>{y(e.toString()),v(!0)})},children:"Ingresar"})})]}),"registro"===j&&(0,n.jsxs)(o.ZP,{container:!0,item:!0,xs:12,justifyContent:"center",alignItems:"center",children:[(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(l.Z,{variant:"h4",textAlign:"center",children:"Registrarse"})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{id:"fullName",className:"my-2",label:"Nombre completo",variant:"outlined",fullWidth:!0,value:C.fullName,onChange:S,error:!!N.fullName,helperText:N.fullName})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{className:"my-2",label:"Correo",variant:"outlined",fullWidth:!0,type:"email",id:"email",value:C.email,onChange:S,error:!!N.email,helperText:N.email})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{className:"my-2",label:"Telefono",variant:"outlined",fullWidth:!0,type:"tel",id:"telphone",value:C.telphone,onChange:S,error:!!N.telphone,helperText:N.telphone})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{className:"my-2",label:"Identidad",variant:"outlined",fullWidth:!0,id:"DNI",value:C.DNI,onChange:S,error:!!N.DNI,helperText:N.DNI})}),(0,n.jsxs)(o.ZP,{xs:12,children:[(0,n.jsx)(c.Z,{className:"my-2 w-3/6",type:"date",variant:"outlined",helperText:"Fecha de nacimiento"}),(0,n.jsx)(c.Z,{className:"m-2 w-3/12",select:!0,label:"Genero",defaultValue:"EUR",id:"gender",value:C.gender,onChange:S,error:!!N.gender,helperText:N.gender,children:["Hombre","Mujer"].map((e,t)=>(0,n.jsx)(u.Z,{value:e,children:e},"key-select-".concat(e,"-").concat(t)))})]}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{type:"password",className:"my-2",label:"contrase\xf1a",variant:"outlined",fullWidth:!0,id:"password",error:!!N.password,helperText:N.password,value:C.password,onChange:S})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{type:"password",className:"my-2",label:"confirmar contrase\xf1a",variant:"outlined",fullWidth:!0,id:"confirmPassword",value:C.confirmPassword,error:!!N.confirmPassword,helperText:N.confirmPassword,onChange:S})}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"text",className:"my-2",onClick:()=>b("ingreso"),children:"\xbfYa tienes usuario?"})}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"contained",className:"my-2",onClick:()=>{var t=new Date(new Date().getTime()+864e5);t.toLocaleDateString();let a=!1,n={fullName:"",email:"",telphone:"",DNI:"",bornAt:new Date,gender:"",password:"",confirmPassword:""},r=g.test(C.email);if(C.fullName||(n.fullName="Ingrese su nombre",a=!0),C.email||(n.email="Ingrese su correo",a=!0),r||(n.email="No es un correo valido"),C.telphone||(n.telphone="Ingrese su telefono",a=!0),C.DNI||(n.DNI="Ingrese su DNI",a=!0),C.password||(n.password="Ingrese una contrase\xf1a",a=!0),C.password!==C.confirmPassword&&(n.confirmPassword="la contrase\xf1a no coincide",n.password="la contrase\xf1a no coinciden",a=!0),a){P(n);return}fetch("".concat(p.v.backend,"/users"),{method:"POST",body:JSON.stringify(C),headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat((0,x.C)())}}).then(e=>e.json()).then(a=>{200===a.statusCode?fetch("".concat(p.v.backend,"/auth/login"),{method:"POST",body:JSON.stringify({username:C.email,password:C.password}),headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat((0,x.C)())}}).then(e=>e.json()).then(a=>{200===a.statusCode?(document.cookie="access_token=".concat(a.data.access_token,"; expires=").concat(t),localStorage.setItem("user",JSON.stringify({...a.data,access_token:null})),"client"===a.data.role?e.push("/catalog"):"admin"===a.data.role&&e.push("/lcmadminlcm")):alert(a.message)}).catch(e=>alert("error en el sistema")):(y(a.error),v(!0))}).catch(e=>{y(e.toString()),v(!0)})},children:"Registarte"})})]}),"newPassword"===j&&(0,n.jsxs)(o.ZP,{container:!0,item:!0,xs:12,justifyContent:"center",alignItems:"center",children:[(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(l.Z,{variant:"h4",textAlign:"center",children:"Cambiar contrase\xf1a"})}),(0,n.jsx)(o.ZP,{xs:12,children:(0,n.jsx)(c.Z,{className:"my-2",label:"Correo",variant:"outlined",fullWidth:!0,type:"email",id:"email",value:C.email,onChange:S,error:!!N.email,helperText:N.email})}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"text",className:"my-2",onClick:()=>b("ingreso"),children:"\xbfYa tienes usuario?"})}),(0,n.jsx)(o.ZP,{xs:12,md:3,lg:3,children:(0,n.jsx)(d.Z,{variant:"contained",className:"my-2",onClick:()=>{fetch("".concat(p.v.backend,"/users/sendNotRemeberPassword"),{method:"POST",body:JSON.stringify({email:C.email,subject:"Cambio de contrase\xf1a",body:""}),headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat((0,x.C)())}}).then(e=>e.json()).then(e=>{200===e.statusCode?(y(e.message),v(!0),k("success")):(y(e.error),v(!0))})},children:"Enviar"})})]})]})]})})}),(0,n.jsx)(h.Z,{handleClose:()=>{v(!1),y(""),k("error")},message:Z,open:f,type:I})]})})}},5410:function(e,t,a){"use strict";a.d(t,{v:function(){return n}});let n={backend:"http://18.118.8.253"}},301:function(e,t,a){"use strict";function n(){let e=document.cookie.split(";"),t="";return e.forEach(e=>{let a=e.split("=");"access_token"===a[0].trim()&&(t=a[1])}),t}a.d(t,{C:function(){return n}})},7478:function(e,t,a){"use strict";a.d(t,{Z:function(){return o}});var n=a(7437),r=a(1520),s=a(4818);function o(e){let{message:t,open:a,handleClose:o,type:i,duration:l=3e3}=e;return(0,n.jsx)(r.Z,{anchorOrigin:{vertical:"top",horizontal:"center"},open:a,autoHideDuration:l,onClose:o,children:(0,n.jsx)(s.Z,{onClose:o,severity:i,variant:"filled",sx:{width:"100%"},children:t})})}},273:function(){}},function(e){e.O(0,[536,276,648,478,23,744],function(){return e(e.s=8829)}),_N_E=e.O()}]);