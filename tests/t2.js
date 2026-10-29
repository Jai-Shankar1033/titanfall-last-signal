const {X,store}=require('./h.js');let p=0,f=0;const ok=(n,c,i='')=>{c?p++:f++;console.log((c?'PASS ':'FAIL ')+n+(c?'':' '+i))};
const fresh=n=>{X.brief(n);X.S='play';return X.G};const step=(n=1)=>{for(let i=0;i<n;i++){X.upd(1/60);for(const k in X.pr)delete X.pr[k]}};
// pause freezes timers
let G=fresh(1);step(30);G.cm={n:1,m:1.5,t:2};const t0=G.time,c0=G.cm.t;X.pr.Escape=1;step();ok('escape pauses',X.S=='pause');step(120);ok('pause freezes time+combo',G.time==t0&&G.cm.t==c0);X.pr.Escape=1;step();ok('escape resumes',X.S=='play');
G=fresh(1);G.B=X.mkB('walker');G.lock=1;G.B.tm=500;X.S='pause';const bt=G.B.tm;step(120);ok('boss timers frozen in pause',G.B.tm==bt);X.S='play';
// death freezes
G=fresh(1);step(10);X.hurt(99,'x');const td=G.time;step(120);ok('timers frozen while dead',G.time==td&&X.S=='dead');
// boss respawn resets boss, drones, bullets
G=fresh(1);G.P.x=G.W-285;step(2);ok('boss spawns on arena entry',!!G.B&&G.lock==1);G.B.hp=40;G.B.ph=2;G.en.push(Object.assign(X.se(3,G.W-100,60),{bd:1}));G.bu.push({x:1,y:1,vx:0,vy:0,w:2,h:2,p:0,d:1,l:9});X.hurt(99,'boss');X.pr.Enter=1;step();
ok('respawn clears boss/lock/drones/bullets',G.B==null&&G.lock==0&&!G.en.some(e=>e.bd)&&G.bu.length==0&&G.cp>=1450,JSON.stringify([G.B,G.lock,G.cp]));G.P.x=G.W-285;step(2);ok('boss re-triggers at full hp',G.B&&G.B.hp==100&&G.B.ph==1);
// surge vs boss
G=fresh(1);G.B=X.mkB('walker');G.lock=1;const B=G.B;G.P.x=B.x-40;G.P.y=B.y;
for(const [o,tr,exp,n] of [[0,0,100,'closed'],[1,1.2,100,'transition'],[1,0,97,'open']]){B.hp=100;B.open=o;B.trans=tr;G.sg=100;X.surge();ok('surge vs boss '+n+' => '+exp,B.hp==exp,B.hp)}
// replay
G=fresh(2);G.sc=999;G.deaths=3;G.sg=50;G.B=X.mkB('harv');G.bu.push({});X.S='res';G.res={gr:'S',acc:1,t:1};X.SV.best[2]={sc:1,gr:'S'};X.pr.KeyR=1;step();const G2=X.G;ok('R replays level with clean state',X.S=='brief'&&G2!==G&&G2.sc==0&&G2.deaths==0&&G2.sg==0&&G2.B==null&&G2.bu.length==0&&G2.n==2);
// upgrades not stacking on replay/win twice
X.SV.cores={};G=fresh(2);G.cores=2;G.B=X.mkB('harv');G.B.dead=.01;G.lock=1;step(3);const m1=X.mhp();G=fresh(2);G.cores=2;G.B=X.mkB('harv');G.B.dead=.01;G.lock=1;step(3);ok('replay does not stack core upgrades',X.mhp()==m1&&m1==7,X.mhp());
// progression: L3 win doesn't overflow unlock; unlock gating
X.SV.un=1;G=fresh(1);G.B=X.mkB('walker');G.B.dead=.01;G.lock=1;step(3);ok('L1 clear unlocks L2 only',X.SV.un==2);
G=fresh(2);G.B=X.mkB('harv');G.B.dead=.01;G.lock=1;step(3);G=fresh(3);G.B=X.mkB('arch');G.B.dead=.01;G.lock=1;step(3);ok('L3 clear keeps un<=3 and ending reachable',X.SV.un==3);X.pr.Enter=1;step();ok('ending scene',X.S=='end');
// level exit not premature
G=fresh(1);G.P.x=G.W-9;step(3);ok('no premature level exit',X.S!='res');
// menu arrows don't trigger items
X.S='set';X.mn([['BACK',()=>{X.S='title'}]]);X.pr.ArrowLeft=1;step();ok('arrow on BACK does nothing',X.S=='set');
// reset progress needs two presses
// core reachability: platform chain check (jump 64 up, 70 across)
for(const n of [1,2,3]){const G=fresh(n);const R=G.pl.filter(q=>q.g);let ch=true,fr=true;while(ch){ch=false;for(const q of G.pl){if(R.includes(q))continue;const lo=q.r?q.x0-q.r:q.x,hi=q.r?q.x0+q.r+q.w:q.x+q.w;if(R.some(s=>s.y-q.y<=60&&s.y-q.y>=-200&&Math.max(lo-(s.x+s.w),s.x-hi)<=60)){R.push(q);ch=true}}}
 for(const k of G.pk.filter(k=>k.k=='d'))ok('L'+n+' core at '+k.x+' on reachable platform',R.some(q=>k.x>=q.x-1&&k.x<=q.x+q.w+1&&Math.abs(q.y-(k.y+8))<=3));
 ok('L'+n+' every platform reachable',R.length==G.pl.length)}
console.log(`RESULT ${p} passed, ${f} failed`);
