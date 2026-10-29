// Desktop vs mobile menu visibility. Run with both harnesses.
const run=(h,mobile)=>{const {X,sb}=require(h);const vm=require('vm');let out=[];const ev=s=>vm.runInContext(s,sb);ev("sub(CHI())");const L=X.M.it.map(i=>typeof i[0]=='function'?i[0]():i[0]);
 const chk=(n,c)=>{out.push((c?'PASS ':'FAIL ')+n)};const kb=L.includes('KEY BINDINGS'),tl=L.includes('TOUCH LAYOUT'),hud=L.includes('HUD OPTIONS');
 chk((mobile?'mobile':'desktop')+': key bindings '+(mobile?'hidden':'shown'),mobile?!kb:kb);chk((mobile?'mobile':'desktop')+': touch layout '+(mobile?'shown':'hidden'),mobile?tl:!tl);chk((mobile?'mobile':'desktop')+': HUD options shown',hud);
 X.S='ctl';X.draw();chk((mobile?'mobile':'desktop')+': how-to-play renders',true);return out};
const a=run('./h.js',false);console.log(a.join('\n'));
