const {X}=require('./h.js');
function run(n,god){X.brief(n);X.S='play';const dt=1/60;let f=0,maxx=0,stuck=0,lastx=0;
 for(;f<60*240;f++){const G=X.G,P=G.P;
  if(X.S=='dead'){if(X.G.deaths<=3)console.log('  death',n,X.G.cause,X.G.P.x|0,X.G.P.y|0);X.pr.Enter=1;}
  if(X.S=='res')return{n,res:'WIN',f,t:G.time.toFixed(0),deaths:G.deaths,kills:G.kills,cores:G.cores,cause:G.cause};
  if(god){P.hp=99}
  X.K.KeyD=1;X.K.KeyJ=1;X.K.KeyW=0;
  const st=G.pl.filter(q=>q.g&&q.x>P.x+2).sort((a,b)=>a.x-b.x)[0];
  const edge=G.pl.filter(q=>q.g&&q.x<=P.x+4&&q.x+q.w>=P.x).sort((a,b)=>b.x-a.x)[0];
  const mp=G.pl.find(q=>q.r&&q.x<=P.x+12&&q.x+q.w>=P.x-4&&Math.abs(q.y-(P.y+P.h))<4);
  const mpa=G.pl.find(q=>q.r&&q.x<=P.x+20&&q.x+q.w>=P.x+8&&q.y>=P.y+P.h-3);
  if(P.gr&&P.pl&&P.pl.r){ if(!(st&&st.x-(P.x+8)<=36)){X.K.KeyD=0} else X.pr.Space=1 }
  else if(P.gr&&edge&&st&&st.x-(edge.x+edge.w)>100&&P.x+14>edge.x+edge.w&&!(mpa&&mpa.x<=P.x+10)){X.K.KeyD=0}
  // jump if no ground ahead or periodically
  const ax=P.x+11;let gr=G.pl.some(q=>ax>=q.x&&ax<=q.x+q.w&&q.y>=P.y+P.h-3);
  if(P.gr&&!P.pl?.r&&(!gr&&!mpa||(f%200==0&&false)))X.pr.Space=1;
  if(f%7==0){X.pr.KeyK=1}
  if(G.sg>=100)X.pr.KeyQ=1;
  if(G.B&&!G.B.dead){ // in arena: face boss, aim up for arch, keep firing
    X.K.KeyW=G.B.k=='arch'&&0?1:0; if(P.x>G.B.x-80)X.K.KeyD=0; }
  X.upd(dt);X.draw();for(const k in X.pr)delete X.pr[k];
  if(Math.abs(P.x-lastx)<.2)stuck++;else stuck=0;lastx=P.x;maxx=Math.max(maxx,P.x);
  if(stuck>600)return{n,res:'STUCK',x:P.x|0,y:P.y|0,f,deaths:G.deaths,B:G.B&&{hp:G.B.hp,cur:G.B.cur,ph:G.B.ph}};
 }
 return{n,res:'TIMEOUT',x:X.G.P.x|0,B:X.G.B&&{hp:X.G.B.hp,cur:X.G.B.cur,ph:X.G.B.ph},deaths:X.G.deaths};
}
for(const g of [0,1])for(const n of [1,2,3]){try{console.log('god',g,JSON.stringify(run(n,g)))}catch(e){console.log('EXC',n,e.stack.split('\n').slice(0,4).join(' | '))}}
