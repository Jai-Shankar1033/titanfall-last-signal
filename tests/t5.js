const {X,store,sb,els,TB,WL}=require('./h4.js');const vm=require('vm');let p=0,f=0;const ok=(n,c,i='')=>{c?p++:f++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const step=(n=1)=>{for(let i=0;i<n;i++){X.upd(1/60);for(const k in X.pr)delete X.pr[k];X.setTap(null)}};
const key=(t,code)=>(WL[t]||[]).forEach(fn=>fn({code,repeat:false,preventDefault(){}}));const down=c=>key('keydown',c),up=c=>key('keyup',c);
const ev=s=>vm.runInContext(s,sb),K=X.K;
// defaults
down('KeyD');ok('default D moves right',K.KeyD==1);up('KeyD');ok('keyup releases',!K.KeyD);
// rebind jump -> KeyZ
ev("cap='jump'");down('KeyZ');ok('capture binds jump to Z and ends capture',X.SV.kb.jump=='KeyZ'&&ev('cap')===null);
down('KeyZ');ok('Z now jumps',K.Space==1&&X.pr.Space==1);up('KeyZ');ok('Z release stops jump',!K.Space);
down('Space');ok('old Space key no longer jumps',!K.Space);up('Space');
ok('binding persists to save',JSON.parse(store.tfl1).kb.jump=='KeyZ'&&X.load().kb.jump=='KeyZ');
// conflict swap: bind fire to Z -> jump gets J
ev("cap='fire'");down('KeyZ');ok('conflict swaps keys',X.SV.kb.fire=='KeyZ'&&X.SV.kb.jump=='KeyJ',JSON.stringify(X.SV.kb));
down('KeyZ');ok('Z fires after swap',K.KeyJ==1);up('KeyZ');down('KeyJ');ok('J jumps after swap',K.Space==1);up('KeyJ');
// reserved keys and escape
ev("cap='swap'");down('Enter');ok('Enter not bindable (capture stays)',ev('cap')=='swap');down('KeyF');down('KeyV');ok('F/V reserved',ev('cap')=='swap'&&!X.SV.kb.swap);down('Escape');ok('Escape cancels capture',ev('cap')===null&&!X.SV.kb.swap);
// reset defaults + back to default behavior
X.SV.kb={};ev('rb()');down('Space');ok('defaults restored: Space jumps',K.Space==1);up('Space');
// sanitise bad saved bindings
store.tfl1=JSON.stringify({v:1,kb:{jump:'<script>',fire:'KeyZ',swap:42},ts:9,to:-1,hs:7,hb:0,hv:0});const L=X.load();
ok('bad bindings rejected, good kept',!L.kb.jump&&L.kb.fire=='KeyZ'&&!L.kb.swap);ok('out-of-range layout/HUD values reset to defaults',L.ts==1&&L.to==.8&&L.hs==1&&L.hb==0&&L.hv==0);
// touch layout: left-handed + scaling
const b=n=>els.find(e=>e.tag=='b'&&e.textContent==n),js=els.filter(e=>e.tag=='div')[0];
X.SV.lh=0;X.SV.ts=1;ev('lay()');ok('right-handed: fire on right, stick on left',b('FIRE').style.right&&!b('FIRE').style.left&&js.style.left&&!js.style.right);
X.SV.lh=1;ev('lay()');ok('left-handed: fire on left, stick on right',b('FIRE').style.left&&!b('FIRE').style.right&&js.style.right&&!js.style.left);
ok('pause button stays top-right when left-handed',b('II').style.right&&!b('II').style.left&&b('II').style.top);
X.SV.ts=1.3;ev('lay()');ok('button size scales joystick',js.style.width==116*1.3+'px');X.SV.lh=0;X.SV.ts=1;ev('lay()');
// HUD options render
X.brief(1);X.S='play';step(5);let e=null;try{for(const hs of [0,1,2])for(const hb of [0,1])for(const hv of [0,1]){X.SV.hs=hs;X.SV.hb=hb;X.SV.hv=hv;X.draw()}X.G.B=X.mkB('walker');X.G.lock=1;for(const hs of [0,2]){X.SV.hs=hs;X.draw()}}catch(x){e=x}ok('all HUD size/background/score combos render (incl. boss)',!e,e&&e.message);X.SV.hs=1;X.SV.hb=1;X.SV.hv=1;
// menus reachable
X.S='title';ev("mn(TI())");ev("sub(CHI())");ok('Controls & HUD menu opens',X.S=='sub'&&X.M.it.length==4);ev("sub(KBI())");ok('key binding menu lists all actions',X.M.it.length==10);ev("sub(TLI())");ev("sub(HUI())");
// music scheduler w/ fake clock
const clock={t:0},notes=[];sb.AudioContext=class{get currentTime(){return clock.t}constructor(){this.state='running';this.destination={}}createOscillator(){return{type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}}createGain(){return{gain:{setValueAtTime:v=>notes.push(v),exponentialRampToValueAtTime(){}},connect(){}}}resume(){}};
ev('au()');X.SV.mute=0;X.SV.m=1;X.SV.mu=1;
const count=(boss)=>{notes.length=0;X.brief(1);X.S='play';if(boss){X.G.B=X.mkB('walker');X.G.lock=1}ev('mT=0');clock.t=10;for(let i=0;i<120;i++){clock.t+=1/60;X.upd(1/60);for(const k in X.pr)delete X.pr[k]}return notes.length};
const n1=count(false),n2=count(true);ok('music scheduler emits layered notes',n1>20,n1);ok('boss fight music is faster/denser',n2>n1,[n1,n2]);
X.SV.mute=1;notes.length=0;clock.t+=5;X.upd(1/60);ok('mute silences music',notes.length==0);X.SV.mute=0;
// every sfx runs without error and respects mute
let ee=null;try{for(const k of ['f0','f1','f2','f3','boom','kill','hurt','die','pick','jump','cp','surge','warn','open'])ev(`sfx('${k}')`)}catch(x){ee=x}ok('all 14 sound effects play',!ee,ee&&ee.message);
console.log(`RESULT ${p} passed, ${f} failed`);
