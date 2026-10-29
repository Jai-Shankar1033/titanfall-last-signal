// Runs every suite as a child process; exits 1 on any failure.
const { spawnSync } = require('child_process');
const path = require('path');
const suites = ['t.js', 't2.js', 't3.js', 't4.js', 't5.js', 't6.js', 't7.js'];
let pass = 0, fail = 0;
for (const s of suites) {
  const r = spawnSync('node', [path.join(__dirname, s)], { encoding: 'utf8' });
  const lines = (r.stdout || '').split('\n');
  const p = lines.filter(l => l.startsWith('PASS ')).length;
  const f = lines.filter(l => l.startsWith('FAIL ')).length;
  lines.filter(l => l.startsWith('FAIL ')).forEach(l => console.log('  ' + l));
  if (r.status !== 0 && r.stderr) console.log(r.stderr);
  console.log(`${s.padEnd(6)} ${p} passed, ${f} failed${r.status !== 0 ? '  (exit ' + r.status + ')' : ''}`);
  pass += p; fail += f + (r.status !== 0 ? 1 : 0);
}
// Traversal smoke test: a bot that only holds "right" must reach each boss arena.
const b = spawnSync('node', [path.join(__dirname, 'bot.js')], { encoding: 'utf8' });
for (const l of (b.stdout || '').split('\n').filter(l => l.startsWith('god 1'))) {
  const j = JSON.parse(l.slice(6));
  const ok = !!(j.B && j.B.hp > 0);
  console.log(`${ok ? 'PASS' : 'FAIL'} level ${j.n}: bot reached the boss arena`);
  ok ? pass++ : fail++;
}
console.log(`\nTOTAL ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
