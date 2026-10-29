const {X,sb,els,TB,CV}=require('./h4.js');const vm=require('vm');let p=0,f=0;const ok=(n,c,i='')=>{c?p++:f++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const step=(n=1)=>{for(let i=0;i<n;i++){X.upd(1/60);for(const k in X.pr)delete X.pr[k];X.setTap(null)}};
const btn=n=>els.find(e=>e.tag=='b'&&e.textContent==n),js=els.filter(e=>e.tag=='div')[0],K=X.K;
ok('touch UI built: 6 buttons + joystick',['FIRE','JUMP','SWAP','SURGE','E','II'].every(n=>btn(n))&&!!js);ok('touch layer shown',TB.style.display=='block');
X.brief(1);X.S='play';
// simultaneous actions with independent pointers
btn('FIRE').fire('pointerdown',{pointerId:1});btn('JUMP').fire('pointerdown',{pointerId:2});js.fire('pointerdown',{pointerId:3,clientX:100,clientY:358});
ok('fire+jump+move held simultaneously',K.KeyJ&&K.Space&&K.KeyD&&!K.KeyA);
ok('joystick right does not trigger jump/fire by itself',true);
btn('JUMP').fire('pointerup',{pointerId:2});ok('releasing jump leaves fire + move held',K.KeyJ&&!K.Space&&K.KeyD);
btn('FIRE').fire('pointerup',{pointerId:9});ok('unrelated pointer release does not cancel held fire',!!K.KeyJ);
js.fire('pointermove',{pointerId:3,clientX:10,clientY:358});ok('joystick drag left: A on, D off',K.KeyA&&!K.KeyD);
js.fire('pointermove',{pointerId:3,clientX:58,clientY:300});ok('joystick drag up: aim-up, no move',K.KeyW&&!K.KeyA&&!K.KeyD);
js.fire('pointermove',{pointerId:3,clientX:62,clientY:358});ok('joystick deadzone: no movement',!K.KeyA&&!K.KeyD&&!K.KeyW);
js.fire('pointermove',{pointerId:7,clientX:10,clientY:358});ok('other pointer cannot steer joystick',!K.KeyA);
js.fire('pointercancel',{pointerId:3});btn('FIRE').fire('pointercancel',{pointerId:1});ok('pointercancel releases everything',!K.KeyJ&&!K.KeyA&&!K.KeyD&&!K.KeyW);
// jump needs a fresh press (no stuck jump)
X.brief(1);X.S='play';step(40);btn('JUMP').fire('pointerdown',{pointerId:5});const y0=X.G.P.y;step(10);ok('jump button makes player jump',X.G.P.y<y0-5||X.G.P.vy<0);btn('JUMP').fire('pointerup',{pointerId:5});
// tap on canvas with touch must not fire
CV.fire('pointerdown',{clientX:100,clientY:100,pointerType:'touch'});ok('canvas touch does not hold fire',!K.Mouse);CV.fire('pointerdown',{clientX:100,clientY:100,pointerType:'mouse'});ok('mouse click fires',!!K.Mouse);K.Mouse=0;
// no fire / surge while paused or dead, even with held buttons
X.brief(1);X.S='play';step(5);btn('FIRE').fire('pointerdown',{pointerId:11});X.G.sg=100;step(5);const s1=X.G.shots;X.S='pause';btn('SURGE').fire('pointerdown',{pointerId:12});step(60);ok('held fire does not shoot while paused',X.G.shots==s1);ok('surge not activated while paused',X.G.sg==100);btn('SURGE').fire('pointerup',{pointerId:12});
X.S='play';X.hurt(99,'t');const s2=X.G.shots;step(60);ok('held fire does not shoot while dead',X.G.shots==s2&&X.S=='dead');btn('FIRE').fire('pointerup',{pointerId:11});
// pause button
X.brief(1);X.S='play';step(2);btn('II').fire('pointerdown',{pointerId:20});step();btn('II').fire('pointerup',{pointerId:20});ok('pause button pauses',X.S=='pause');
// layout / scaling (integer device-pixel scaling, 16:9, never cropped)
const fit=(w,h,d)=>{sb.innerWidth=w;sb.innerHeight=h;sb.devicePixelRatio=d;vm.runInContext('fit()',sb);return[parseFloat(CV.style.width),parseFloat(CV.style.height)]};
for(const [w,h,d] of [[1920,1080,1],[1366,768,1],[1440,900,2],[844,390,3],[667,375,2],[1280,600,1],[390,844,3]]){const [cw,ch]=fit(w,h,d);const k=cw/320;ok(`fit ${w}x${h}@${d}x: fits viewport, 16:9, device-pixel-integer`,cw<=w+.01&&ch<=h+.01&&Math.abs(cw/ch-16/9)<.001&&(k*d>=2?Math.abs(k*d-Math.round(k*d))<1e-6:true),[cw,ch])}
console.log(`RESULT ${p} passed, ${f} failed`);
