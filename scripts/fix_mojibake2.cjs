// Patch the remaining handful of \uFFFD characters with the correct Turkish letters.
const fs = require('fs');
const F = '\uFFFD';
const targets = [
  // [path, [from, to], ...]
  ['frontend/src/components/Navigation.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
  ]],
  ['frontend/src/sections/CoffeeSelectionSection.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
    ['SE\uFFFD!KİMİZ', 'SEÇKİMİZ'],
    ['MEN\uFFFD~E', 'MENŞE'],
    ['Tek men\uFFFDxe', 'Tek menşe'],
  ]],
  ['frontend/src/sections/FooterSection.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
    ['yava\uFFFDxça', 'yavaşça'],
    ['dönü\uFFFDx yapaca\uFFFDxız', 'dönüş yapacağız'],
    ['Eri\uFFFDxilebilirlik', 'Erişilebilirlik'],
  ]],
  ['frontend/src/sections/FreshlyRoastedSection.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
    ['demleriz \uFFFD her', 'demleriz — her'],
  ]],
  ['frontend/src/sections/SlowDownSection.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
    ['YAVA\uFFFD~LAYIN', 'YAVAŞLAYIN'],
    ['Do\uFFFDxal ı\uFFFDxık, yapraklı kö\uFFFDxeler', 'Doğal ışık, yapraklı köşeler'],
    ['Yakla\uFFFDxan', 'Yaklaşan'],
  ]],
  ['frontend/src/sections/VisitSection.tsx', [
    [/^\uFEFF?\uFFFD?import/, 'import'],
    ['İstanbul \uFFFD Botanik', 'İstanbul — Botanik'],
    ['Pzt \uFFFD Cum', 'Pzt – Cum'],
    ['Cmt \uFFFD Paz', 'Cmt – Paz'],
    [/(\d{2}:\d{2}) \uFFFD (\d{2}:\d{2})/g, '$1 – $2'],
  ]],
];

for (const [file, pairs] of targets) {
  let txt = fs.readFileSync(file, 'utf8');
  if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
  for (const [from, to] of pairs) {
    if (typeof from === 'string') txt = txt.split(from).join(to);
    else txt = txt.replace(from, to);
  }
  fs.writeFileSync(file, txt, 'utf8');
  const left = (txt.match(/\uFFFD/g) || []).length;
  console.log(file + (left ? '  ⚠ ' + left + ' replacement chars left' : '  ✓ clean'));
}
