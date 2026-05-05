const fs = require('fs');
function fix(p, re, to) {
  let t = fs.readFileSync(p, 'utf8');
  t = t.replace(re, to);
  fs.writeFileSync(p, t, 'utf8');
}
fix('frontend/src/sections/FreshlyRoastedSection.tsx', /demleriz \uFFFD.\s?her/g, 'demleriz — her');
fix('frontend/src/sections/VisitSection.tsx', /İstanbul \uFFFD.\s?Botanik/g, 'İstanbul — Botanik');
fix('frontend/src/sections/VisitSection.tsx', /Pzt \uFFFD.\s?Cum/g, 'Pzt – Cum');
fix('frontend/src/sections/VisitSection.tsx', /Cmt \uFFFD.\s?Paz/g, 'Cmt – Paz');
fix('frontend/src/sections/VisitSection.tsx', /(\d{2}:\d{2}) \uFFFD.\s?(\d{2}:\d{2})/g, '$1 – $2');
for (const f of [
  'frontend/src/sections/FreshlyRoastedSection.tsx',
  'frontend/src/sections/VisitSection.tsx',
]) {
  const c = (fs.readFileSync(f, 'utf8').match(/\uFFFD/g) || []).length;
  console.log(f + ': ' + c + ' replacement chars left');
}
