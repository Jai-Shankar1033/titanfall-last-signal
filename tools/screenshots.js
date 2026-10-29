// Renders real game frames with a headless canvas (not a browser) into assets/screenshots/.
const path = require('path'), fs = require('fs'), vm = require('vm');
const { X, sb, real } = require('../tests/h2.js');
const { createCanvas } = require('@napi-rs/canvas');
const out = path.join(__dirname, '..', 'assets', 'screenshots'); fs.mkdirSync(out, { recursive: true });
const step = (n = 1) => { for (let i = 0; i < n; i++) { X.upd(1 / 60); for (const k in X.pr) delete X.pr[k]; } };
const save = (name, scale = 3, crop) => {
  X.draw();
  const w = crop ? crop[2] : 320, h = crop ? crop[3] : 180;
  const c = createCanvas(w * scale, h * scale), g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.drawImage(real, crop ? crop[0] : 0, crop ? crop[1] : 0, w, h, 0, 0, w * scale, h * scale);
  fs.writeFileSync(path.join(out, name), c.toBuffer('image/png')); console.log('wrote', name);
};
X.S = 'title'; step(50); save('title.png');
const lv = (n, x, name, boss) => {
  X.brief(n); X.S = 'play'; const G = X.G, P = G.P; P.hp = 99; P.x = x; P.y = 100; step(50);
  if (boss) { G.B = X.mkB(G.L.bs); G.lock = 1; P.x = G.W - 250; G.B.ph = boss.ph; G.B.cur = boss.cur; G.B.open = boss.open; G.B.tm = 9999; G.B.dir = -1; step(3); }
  else { P.cd = 0; X.K.KeyJ = 1; step(8); X.K.KeyJ = 0; }
  save(name);
};
lv(1, 300, 'level1-dead-frontier.png'); lv(2, 700, 'level2-iron-jungle.png'); lv(3, 700, 'level3-signal-core.png');
lv(1, 0, 'boss-siege-walker.png', { cur: 'open', open: 1, ph: 2 });
lv(2, 0, 'boss-thornback-harvester.png', { cur: 'charge', open: 0, ph: 2 });
lv(3, 0, 'boss-signal-architect.png', { cur: 'open', open: 1, ph: 3 });
const sheet = createCanvas(960, 240), g = sheet.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#1c2430'; g.fillRect(0, 0, 960, 240);
let x = 10; for (const k of ['s', 'a', 'b', 'j', 'f']) { const im = vm.runInContext('PS.' + k, sb); g.drawImage(im, x, 10, im.width * 8, im.height * 8); x += im.width * 8 + 8; }
for (const n of ['EN2', 'SP.dr', 'SP.tu', 'SP.sh', 'SP.hv']) { const im = vm.runInContext(n, sb); g.drawImage(im, x, 10, im.width * 6, im.height * 6); x += im.width * 6 + 10; }
x = 10; for (const n of ['BS.walker[0]', 'BS.harv[0]', 'BS.arch[0]']) { const im = vm.runInContext(n, sb); g.drawImage(im, x, 140, im.width * 3, im.height * 3); x += im.width * 3 + 40; }
fs.writeFileSync(path.join(out, 'sprites.png'), sheet.toBuffer('image/png')); console.log('wrote sprites.png');
X.S = 'title'; step(60); save('social-preview.png', 4, [0, 10, 320, 160]);
