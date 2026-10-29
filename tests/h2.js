const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let src=html.split('<script>')[1].split('</script>')[0];
src+=`;globalThis.X={get S(){return S},set S(v){S=v},get G(){return G},set G(v){G=v},get SV(){return SV},set SV(v){SV=v},K,pr,upd,draw,brief,play,load,save,mkB,mhp,cdm,se,kill,dmg,surge,shoot,hurt,respawn,bossHit,mn,TI,get M(){return M},WP,SQ,BHP,LV,E,setTap(t){tap=t},get TOUCH(){return TOUCH},set TOUCH(v){TOUCH=v}}`;
const store={};const noop=()=>{};
const ctx=new Proxy({},{get:(t,k)=>k=='createLinearGradient'?()=>({addColorStop:noop}):noop,set:()=>true});
const el=()=>new Proxy({style:{},appendChild:noop,addEventListener:noop,getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0,width:320,height:180}),set className(v){},set textContent(v){}},{get:(t,k)=>k in t?t[k]:noop,set:(t,k,v)=>{t[k]=v;return true}});
const {createCanvas}=require('@napi-rs/canvas');const real=createCanvas(320,180);Object.assign(real,{style:{},addEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width:320,height:180})});const ctx0=real.getContext('2d');
const sb={innerWidth:1366,innerHeight:768,devicePixelRatio:1,document:{getElementById:id=>id=='c'?real:el(),createElement:t=>{const c=createCanvas(1,1);c.style={};c.appendChild=noop;c.addEventListener=noop;return c},addEventListener:noop,hidden:false},window:{},addEventListener:noop,localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},navigator:{getGamepads:()=>[]},matchMedia:()=>({matches:false}),requestAnimationFrame:noop,console,Math,JSON,Object,Array};
sb.window=sb;sb.globalThis=sb;vm.createContext(sb);
try{vm.runInContext(src,sb)}catch(e){console.log('LOAD ERROR',e.stack);process.exit(1)}
module.exports={X:sb.X,store,sb,real};
