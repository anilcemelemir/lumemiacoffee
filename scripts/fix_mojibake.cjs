// Targeted repair of UTF-8 mojibake left from earlier PowerShell pipeline.
const fs = require('fs');
const path = require('path');

function walk(d, o = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, o);
    else if (/\.(tsx|ts)$/.test(f.name)) o.push(p);
  }
  return o;
}

const root = path.join(__dirname, '..', 'frontend', 'src');
const fixes = [
  [/İleti.xim/g, 'İletişim'],
  [/hazırlanmı.x/g, 'hazırlanmış'],
  [/demleriz . her/g, 'demleriz — her'],
  [/.~i.xli/g, 'Şişli'],
  [/.!alı.xma/g, 'Çalışma'],
  [/Pzt . Cum/g, 'Pzt – Cum'],
  [/Cmt . Paz/g, 'Cmt – Paz'],
  [/(\d{2}:\d{2}) . (\d{2}:\d{2})/g, '$1 – $2'],
  [/İstanbul . Botanik/g, 'İstanbul — Botanik'],
  [/Eri.xim/g, 'Erişim'],
  [/Hızlı Eri.xim/g, 'Hızlı Erişim'],
];

let count = 0, total = 0;
for (const f of walk(root)) {
  let txt = fs.readFileSync(f, 'utf8');
  const orig = txt;
  if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
  for (const [re, to] of fixes) txt = txt.replace(re, to);
  if (txt !== orig) {
    fs.writeFileSync(f, txt, 'utf8');
    count++;
    const left = (txt.match(/\uFFFD/g) || []).length;
    console.log('  ' + path.relative(process.cwd(), f) + (left ? ' [⚠ ' + left + ' \\uFFFD left]' : ''));
  }
  total++;
}
console.log('Patched ' + count + '/' + total + ' files');
