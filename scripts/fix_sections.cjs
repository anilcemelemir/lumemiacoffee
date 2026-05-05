// One-shot fix:
// 1) Repair PowerShell-induced UTF-8 mojibake (latin1 → utf8 round-trip).
// 2) Convert `[var(--name)]/N` slash-opacity (which Tailwind can't apply to arbitrary
//    CSS-variable values) to color-mix(in srgb, var(--name) N%, transparent).
//    Tailwind arbitrary-value syntax requires no spaces → use underscores.
// 3) Re-write each file as UTF-8 (no BOM).

const fs = require('fs');
const path = require('path');

const ROOTS = [
  path.join(__dirname, '..', 'frontend', 'src', 'sections'),
  path.join(__dirname, '..', 'frontend', 'src', 'components'),
];

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(f.name)) out.push(p);
  }
  return out;
}

// Detect mojibake by presence of the typical sequences (UTF-8 bytes interpreted as Win-1252/Latin-1)
function repairMojibake(s) {
  // Heuristic: only repair if it contains the diagnostic mojibake bytes.
  if (!/Ä±|Å|Ã¶|Ã¼|Ã§|ÅŸ|ÄŸ|Ä°|Â©/.test(s)) return s;
  // Treat current string's chars as Latin-1 byte values, re-decode as UTF-8.
  const bytes = Buffer.from(s, 'binary'); // each char.code → 1 byte
  return bytes.toString('utf8');
}

// Replace `[var(--X)]/N` (where /N is 5/10/20/30/40/50/60/70/80/90 etc.)
// with `[color-mix(in_srgb,var(--X)_N%,transparent)]`
function fixOpacityVars(s) {
  return s.replace(
    /\[var\(--([a-z0-9-]+)\)\]\/(\d{1,3})/g,
    (_m, name, pct) => `[color-mix(in_srgb,var(--${name})_${pct}%,transparent)]`,
  );
}

let fixed = 0;
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const buf = fs.readFileSync(file);
    let txt = buf.toString('utf8');
    const before = txt;
    txt = repairMojibake(txt);
    txt = fixOpacityVars(txt);
    if (txt !== before) {
      fs.writeFileSync(file, txt, { encoding: 'utf8' });
      fixed++;
      console.log('  ' + path.relative(process.cwd(), file));
    }
  }
}
console.log(`Fixed ${fixed} file(s).`);
