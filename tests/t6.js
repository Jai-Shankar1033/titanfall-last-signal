const {X,sb,els,WL}=require('./h4.js');const vm=require('vm');let p=0,f=0;const ok=(n,c,i='')=>{c?p++:f++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const ev=s=>vm.runInContext(s,sb),K=X.K,b=n=>els.find(e=>e.tag=='b'&&e.textContent==n),js=els.filter(e=>e.tag=='div')[0];
const fireWin=(t,e)=>(WL[t]||[]).forEach(fn=>fn(Object.assign({preventDefault(){}},e)));
const num=s=>s&&+((/(-?\d+(\.\d+)?)px/.exec(s)||[])[1]);
function rects(Wd,Hd){const R={};for(const e of els.filter(e=>e.tag=='b'||e.tag=='div')){if(!e.style.cssText&&!e.style.width)continue;let sz=e.tag=='div'?parseFloat(e.style.width):+(/--s:(\d+)px/.exec(e.style.cssText||'')||[])[1]*parseFloat(ev('SV.ts'));if(!sz)continue;const l=num(e.style.left),r=num(e.style.right),t=num(e.style.top),bt=num(e.style.bottom);
 const x=l!=null&&e.style.left?l:Wd-r-sz,y=t!=null&&e.style.top?t:Hd-bt-sz;R[e.textContent||'STICK']={x,y,w:sz,h:sz}}return R}
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
for(const [Wd,Hd] of [[844,390],[667,375],[568,320]])for(const lh of [0,1])for(const ts of [.7,1,1.2,1.4]){ev(`SV.lh=${lh};SV.ts=${ts};lay()`);const R=rects(Wd,Hd),k=Object.keys(R);let bad=[];for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length;j++)if(hit(R[k[i]],R[k[j]]))bad.push(k[i]+'/'+k[j]);const off=k.filter(n=>R[n].x<0||R[n].y<0||R[n].x+R[n].w>Wd||R[n].y+R[n].h>Hd);ok(`no overlap/off-screen ${Wd}x${Hd} lh=${lh} size=${ts*100}%`,!bad.length&&!off.length,bad.concat(off).join(','))}
ev('SV.lh=0;SV.ts=1;lay()');
// lost-release recovery
b('JUMP').fire('pointerdown',{pointerId:2});ok('jump held',K.Space==1);fireWin('pointerup',{pointerId:2});ok('lost button pointerup recovered by window-level release',!K.Space);
b('FIRE').fire('pointerdown',{pointerId:4});b('FIRE').fire('lostpointercapture',{pointerId:4});ok('lost pointer capture releases fire (no stuck fire)',!K.KeyJ);
K.Space=1;X.pr.Space=0;b('JUMP').fire('pointerdown',{pointerId:6});ok('jump registers a fresh press even if state was stale',X.pr.Space==1);b('JUMP').fire('pointerup',{pointerId:6});
// joystick: window-level fallback + combos
js.fire('pointerdown',{pointerId:3,clientX:100,clientY:358});b('FIRE').fire('pointerdown',{pointerId:4});b('JUMP').fire('pointerdown',{pointerId:5});ok('stick + fire + jump together',K.KeyD&&K.KeyJ&&K.Space);
fireWin('pointermove',{pointerId:3,clientX:5,clientY:358});ok('stick drag tracked even if pointermove only reaches window',K.KeyA&&!K.KeyD&&K.KeyJ&&K.Space);
js.fire('pointerup',{pointerId:3});ok('releasing stick keeps fire+jump held',!K.KeyA&&!K.KeyD&&K.KeyJ&&K.Space);
js.fire('pointerdown',{pointerId:8,clientX:100,clientY:358});b('FIRE').fire('pointerup',{pointerId:4});ok('releasing fire keeps stick+jump',K.KeyD&&!K.KeyJ&&K.Space);fireWin('pointercancel',{pointerId:8});fireWin('pointercancel',{pointerId:5});ok('window cancel clears everything',!K.KeyD&&!K.Space);
js.fire('pointerdown',{pointerId:9,clientX:100,clientY:358});js.fire('pointerdown',{pointerId:10,clientX:0,clientY:358});ok('second finger on stick ignored',K.KeyD&&!K.KeyA);fireWin('pointerup',{pointerId:9});ok('stick releases cleanly',!K.KeyD&&!K.KeyA);
console.log(`RESULT ${p} passed, ${f} failed`);
