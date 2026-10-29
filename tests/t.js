const {X,store}=require('./h.js');let pass=0,fail=0;
const ok=(n,c,i='')=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const fresh=n=>{X.brief(n);X.S='play';return X.G};
const step=(n=1)=>{for(let i=0;i<n;i++){X.upd(1/60);for(const k in X.pr)delete X.pr[k]}};
// combo & score
let G=fresh(1),e=X.se(0,100);G.en=[e];e.hp=1;G.sc=0;X.kill(e,0);ok('first kill x1.0 score 100',G.sc==100&&G.cm.m==1,G.sc);
let e2=X.se(0,100);X.kill(e2,0);ok('2nd kill within 2.5s mult 1.25',G.cm.m==1.25&&G.sc==225,G.cm.m+' '+G.sc);
for(let i=0;i<6;i++)X.kill(X.se(0,100),0);ok('mult caps 2.0',G.cm.m==2,G.cm.m);
G.cm.t=.01;G.P.x=50;step(2);ok('combo resets after window',G.cm.m==1);
// surge meter
G=fresh(1);G.sg=0;G.lw=-1;X.kill(X.se(0,100),0);ok('kill +6',G.sg==6,G.sg);X.kill(X.se(0,100),0);ok('same weapon no bonus',G.sg==12,G.sg);X.kill(X.se(0,100),1);ok('diff weapon +6+4',G.sg==22,G.sg);
G=fresh(1);let en=X.se(0,50);en.x=G.P.x+30;G.en=[en];X.dmg(en,1,0);ok('hit +2',G.sg==2,G.sg);
G.sg=99;X.surge();ok('surge needs full meter',G.sg==99);
G=fresh(1);let en2=X.se(4,0);en2.x=G.P.x+40;en2.y=G.P.y;G.en=[en2];G.sg=100;G.bu=[{x:G.P.x+60,y:G.P.y,vx:0,vy:0,w:4,h:4,p:0,d:1,l:3},{x:G.P.x+200,y:G.P.y,vx:0,vy:0,w:4,h:4,p:0,d:1,l:3}];const h0=en2.hp;X.surge();
ok('surge consumes meter',G.sg<100&&G.sg>=0);ok('surge 3 dmg + stagger',en2.hp==h0-3&&en2.stun>0,en2.hp);ok('surge clears bullets in 110px only',G.bu.length==1&&G.bu[0].x>G.P.x+150,G.bu.length);
G.sg=100;X.S='pause';X.pr.KeyQ=1;step();ok('no surge while paused',G.sg==100);X.S='play';
// death / respawn resets
G=fresh(1);G.sg=80;G.cm={n:3,m:1.5,t:2};X.hurt(99,'test');ok('death resets meter, state dead',G.sg==0&&X.S=='dead'&&G.deaths==1);X.pr.Enter=1;step();ok('respawn: play, full hp, meter 0',X.S=='play'&&G.P.hp==X.mhp()&&G.sg==0&&G.cm.m==1);
// checkpoint
G=fresh(1);G.P.x=700;step();ok('checkpoint 1 set',G.cp==620,G.cp);G.P.y=300;step();ok('pit death',X.S=='dead'&&G.cause=='Fell into a pit');X.pr.Enter=1;step();ok('respawn at checkpoint',Math.abs(G.P.x-620)<3);
// weapons
G=fresh(1);G.P.wu=[1,1,1,1];G.P.wi=3;G.P.am=1;G.P.cd=0;G.bu=[];X.shoot();ok('rocket uses ammo',G.P.am==0&&G.bu.length==1);G.P.cd=0;X.shoot();ok('empty rocket does not fire',G.bu.length==1);
G.P.wi=1;G.P.cd=0;G.bu=[];X.shoot();ok('scatter fires 5 pellets',G.bu.length==5);G.P.wi=2;G.P.cd=0;G.bu=[];X.shoot();ok('rail pierces',G.bu[0].pi==1&&G.bu[0].d==5);
G=fresh(1);step(60);G.en=[];G.P.wi=0;G.P.cd=0;G.bu=[];let tgt=X.se(0,0);tgt.x=G.P.x+60;tgt.y=G.P.y;tgt.hx=tgt.x;tgt.tm=99;G.en=[tgt];X.shoot();for(let i=0;i<30&&G.en.length;i++)step();ok('rifle bullet damages enemy',tgt.hp<3);
// shield blocks front
G=fresh(1);let sh=X.se(1,0);sh.x=G.P.x+50;sh.y=G.P.y;sh.f=-1;sh.st=0;sh.tm=99;G.en=[sh];G.P.cd=0;G.P.f=1;X.shoot();for(let i=0;i<30;i++)step();ok('shield blocks frontal fire',sh.hp==5,sh.hp);
// save recovery
store.tfl1='{bad json';let L=X.load();ok('corrupt JSON -> defaults',L.un==1&&L.m==.7);store.tfl1=JSON.stringify({v:1,un:99,m:'x',cores:5});L=X.load();ok('invalid fields sanitised',L.un==3&&L.m==.7&&typeof L.cores=='object');
X.SV.un=1;store.tfl1=undefined;G=fresh(1);G.B=X.mkB('walker');G.lock=1;G.B.hp=1;G.B.open=1;X.bossHit(5);G.B.dead=.01;step(3);ok('L1 boss death -> results, unlocks L2, saves',X.S=='res'&&X.SV.un==2&&JSON.parse(store.tfl1).un==2,X.S);
// upgrades
X.SV.cores={1:2};ok('cores raise max hp',X.mhp()==7);ok('cores speed fire',X.cdm()<1);X.SV.cores={};
// boss tests
function boss(k,n){G=fresh(n);G.P.x=G.W-318;G.B=X.mkB(k);G.lock=1;const B=G.B;let seen=new Set(),ph=new Set(),closedLeak=0,maxdr=0,f=0,hit0=0;
 for(;f<60*600&&!B.dead&&X.S!='res';f++){G.P.hp=99;G.P.wu=[1,1,1,1];G.P.wi=0;G.P.f=1;X.K.KeyJ=1;X.K.KeyD=0;X.K.KeyW=0;const o=B.hp;seen.add(B.cur);ph.add(B.ph);G.P.x=Math.max(G.W-318,Math.min(B.x-70,G.W-100));
  if(!B.open&&!B.trans&&(B.k=='walker'||B.k=='harv'))G.sg=0; const before=B.hp,op=B.open;X.upd(1/60);for(const q in X.pr)delete X.pr[q];if(!op&&!B.open&&B.hp<before&&!B.trans)closedLeak++;
  maxdr=Math.max(maxdr,G.en.filter(e=>e.bd&&e.hp>0).length);if(B.k=='arch'&&G.sg>=100){X.pr.KeyQ=1}}
 X.K.KeyJ=0;return{k,dead:!!B.dead||X.S=='res',secs:(f/60).toFixed(0),phases:[...ph].join(','),steps:[...seen].join(','),closedLeak,maxdr}}
for(const [k,n] of [['walker',1],['harv',2],['arch',3]]){const r=boss(k,n);console.log(JSON.stringify(r));ok(k+' killable by rifle bot',r.dead);ok(k+' no damage while core closed',r.closedLeak==0,r.closedLeak);}
const A=boss('arch',3);ok('arch uses all 3 phases',A.phases=='1,2,3',A.phases);ok('arch drones <=2',A.maxdr<=2,A.maxdr);const H=boss('harv',2);ok('harv phase2 roots reached',H.steps.includes('roots'),H.steps);const Wk=boss('walker',1);ok('walker phase2 wave reached',Wk.steps.includes('wave'),Wk.steps);
// full ending
G=fresh(3);G.B=X.mkB('arch');G.lock=1;G.B.hp=1;G.B.open=1;X.bossHit(5);G.B.dead=.01;step(3);ok('L3 victory -> results',X.S=='res');X.pr.Enter=1;step();ok('results -> ending',X.S=='end');X.G.P;
console.log(`\nRESULT ${pass} passed, ${fail} failed`);
