const {X,store,sb}=require('./h.js');let p=0,f=0;const ok=(n,c,i='')=>{c?p++:f++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const fresh=n=>{X.brief(n);X.S='play';return X.G};const step=(n=1)=>{for(let i=0;i<n;i++){X.upd(1/60);for(const k in X.pr)delete X.pr[k]}};
for(const n of [1,2,3]){let G=fresh(n),P=G.P,L=G.L;const lv=G.ix.find(o=>o.k=='l'),tm=G.ix.find(o=>o.k=='t');
 // E with nothing near is not consumed / does nothing
 P.x=300+n*3;step(30);const np=G.pl.length;X.pr.KeyE=1;step();ok('L'+n+' E away from objects does nothing',G.pl.length==np&&G.sc==0&&!lv.u);
 // terminal
 P.x=tm.x;P.y=138;step(20);ok('L'+n+' prompt shows near log',G.pr0=='E: READ LOG');X.pr.KeyE=1;step();ok('L'+n+' log read once +100',G.sc==100&&tm.u);X.pr.KeyE=1;step();ok('L'+n+' log not re-scorable',G.sc==100);
 // secret room hidden until lever
 const hidden=G.pl.length;ok('L'+n+' secret core absent before lever',!G.pk.some(k=>k.k=='d'&&k.x==L.sk[0]));
 P.x=lv.x;P.y=138;step(20);ok('L'+n+' lever prompt',G.pr0=='E: PULL LEVER');X.pr.KeyE=1;step();
 ok('L'+n+' lever opens secret platforms + core',lv.u&&G.pl.length==hidden+3&&G.pk.some(k=>k.k=='d'&&k.x==L.sk[0]));
 X.pr.KeyE=1;step();ok('L'+n+' lever cannot be pulled twice',G.pl.length==hidden+3&&G.pk.filter(k=>k.x==L.sk[0]).length==1);
 // reachable: walk bot jumps up the stairs
 const sc=L.sc;let reach=true,prev=null;for(const [x,y,w] of sc){const below=G.pl.filter(q=>q!==prev&&q.y>y&&q.x-8<x+w&&q.x+q.w+8>x&&q.y-y<=60);const gap=prev?Math.max(x-(prev.x+prev.w),prev.x-(x+w)):0;if(prev&&(prev.y-y>60||gap>60))reach=false;prev={x,y,w}}
 const first=sc[0];const baseOk=G.pl.some(q=>q.g&&q.y-first[1]<=60&&first[0]<q.x+q.w+60&&first[0]+first[2]>q.x-60);ok('L'+n+' secret stairs reachable from ground by jump geometry',reach&&baseOk);
 // collect core once
 const kx=L.sk[0];P.x=kx;P.y=sc[2][1]-12;P.vy=0;step(2);ok('L'+n+' secret core collectible',G.cores==1);step(5);ok('L'+n+' core not collectible twice',G.cores==1);
 // respawn keeps lever state (no duplicate platforms)
 X.hurt(99,'t');X.pr.Enter=1;step();ok('L'+n+' secret state persists across respawn',G.pl.length==hidden+3&&lv.u);
}
// secret-room real traversal: player physically jumps the L1 stairs
{let G=fresh(1),P=G.P;G.ix[1].u=1;G.L.sc.forEach(([x,y,w])=>G.pl.push({x,y,w,r:0,x0:x,dx:0}));P.x=940;P.y=138;step(10);let top=false;const jumps=[975,1040,1095];let ji=0;
 for(let f2=0;f2<400;f2++){P.hp=99;X.K.KeyD=1;if(P.gr&&ji<3&&P.x>=jumps[ji]){X.pr.Space=1;ji++}step();if(P.gr&&P.y<=20&&P.x>1140){top=true;break}}X.K.KeyD=0;ok('L1 secret ledge physically reachable by jumping',top,P.x.toFixed(0)+','+P.y.toFixed(0))}
// ground roots
{let G=fresh(2);G.P.x=G.W-200;G.B=X.mkB('harv');G.lock=1;const B=G.B;B.ph=2;B.i=6;B.tm=1;P=G.P;P.hp=99;step(3);
 let seen=[];for(let f2=0;f2<400&&!G.zn.some(z=>z.wa>0&&z.h==30);f2++){step()}ok('roots warning zones appear in phase 2',G.zn.filter(z=>z.wa>0&&z.h==30).length==3);
 const z=G.zn.find(z=>z.wa>0&&z.h==30);P.x=z.x+4;P.y=138;P.hp=99;const h0=P.hp;for(let f2=0;f2<30;f2++){P.x=z.x+4;step();}ok('no damage during warning',P.hp==h0);
 for(let f2=0;f2<90&&P.hp==h0;f2++){P.x=z.x+4;P.y=138;step()}ok('standing in root after warning is hit',P.hp<h0);
 const safe=G.zn.find(q=>q.h==30&&q!=z);P.inv=0;P.hp=99;const h1=P.hp;P.x=G.W-310;P.y=138;step(40);ok('standing clear takes no root damage',P.hp==h1);}
// touch auto-fire
{X.SV.af=1;X.TOUCH=true;let G=fresh(1);step(40);ok('auto-fire shoots with no input (touch)',G.shots>0);X.S='pause';const s0=G.shots;step(60);ok('no auto-fire while paused',G.shots==s0);X.S='play';X.hurt(99,'t');const s1=G.shots;step(60);ok('no auto-fire while dead',G.shots==s1&&X.S=='dead');
 X.SV.af=0;G=fresh(1);step(60);ok('no auto-fire when setting off',G.shots==0);X.SV.af=1;X.TOUCH=false;G=fresh(1);step(60);ok('no auto-fire on non-touch',G.shots==0);X.SV.af=0}
// audio really scales output
{const rec=[],clock={t:0};sb.AudioContext=class{get currentTime(){return clock.t}constructor(){this.state='running';this.destination={}}createOscillator(){return{type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{setValueAtTime:(v)=>rec.push(v),exponentialRampToValueAtTime(){},value:0},connect(){}}}resume(){}};
 X.pr.x=0;X.upd(0);const sv=X.SV;sb.eval?0:0;
 const fire=()=>{rec.length=0;const G=fresh(1);G.P.cd=0;X.shoot();return rec[0]};
 // need AC created: trigger au via keydown stub not available -> create through vm
 require('vm').runInContext('au()',sb);
 sv.m=1;sv.sf=1;sv.mute=0;const a=fire();sv.sf=.5;const b=fire();sv.m=.5;const c=fire();sv.mute=1;const d=fire();sv.mute=0;sv.m=0;const e=fire();
 ok('sfx volume scales gain',a>0&&Math.abs(b-a/2)<1e-6,[a,b]);ok('master volume scales gain',Math.abs(c-a/4)<1e-6,[a,c]);ok('mute silences output',d===undefined);ok('master 0 ~silent',e<.001,e);
 // music volume independent of sfx
 sv.m=1;sv.sf=0;sv.mu=1;sv.mute=0;X.S='title';rec.length=0;for(let i=0;i<4;i++){clock.t+=.3;X.upd(.3)}const mus1=Math.max(...rec);sv.mu=.25;rec.length=0;for(let i=0;i<4;i++){clock.t+=.3;X.upd(.3)}const mus2=Math.max(...rec);ok('music volume scales music, independent of sfx',mus1>0&&Math.abs(mus2-mus1/4)<1e-6,[mus1,mus2]);}
// settings persistence incl auto-fire
{X.SV.af=1;X.SV.mu=.3;X.save();const L=X.load();ok('settings persist (mu, af)',L.mu==.3&&L.af==1)}
// all boss phases render without exceptions
for(const [k,n,phs] of [['walker',1,2],['harv',2,2],['arch',3,3]]){let G=fresh(n);G.B=X.mkB(k);G.lock=1;let e=null;try{for(let ph=1;ph<=phs;ph++){G.B.ph=ph;for(const c of ['idle','tele','charge','open','roots','beam']){G.B.cur=c;G.B.open=c=='open';X.draw()}}}catch(x){e=x}ok(k+' sprites render in all phases/states',!e,e&&e.message)}
// credits
{X.S='title';X.mn(X.TI());X.S='cred';X.draw();X.pr.Enter=1;step();ok('credits scene draws and exits to title',X.S=='title')}
console.log(`RESULT ${p} passed, ${f} failed`);
