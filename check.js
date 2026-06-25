const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

// 1. Check HTML structure
console.log('=== HTML STRUCTURE ===');
const tags = ['title','style','head','body','html','main','footer'];
let ok = true;
tags.forEach(t => {
  const open = (html.match(new RegExp('<' + t, 'gi')) || []).length;
  const close = (html.match(new RegExp('</' + t + '>', 'gi')) || []).length;
  if(open !== close) {
    console.log('MISMATCH', t, 'open:', open, 'close:', close);
    ok = false;
  }
});
if(ok) console.log('HTML tags balanced PASS');

// 2. Check JS syntax
console.log('\n=== JS SYNTAX ===');
const re = /<script>([\s\S]*?)<\/script>/g;
let match, i=0, allOk=true;
while(match = re.exec(html)) {
  i++;
  try { new Function(match[1]) }
  catch(e) {
    allOk = false;
    console.log('Script ' + i + ' ERROR:', e.message.substring(0,150));
  }
}
if(allOk) console.log('All scripts valid PASS');

// 3. Check for common problems
console.log('\n=== SANITY ===');
const checks = [
  ['quotes-data.js', 'external ref removed'],
  ['login-screen', 'login removed'],
  ['music-btn', 'music removed'],
  ['toggleMusic', 'toggleMusic removed'],
  ['callDeepSeek', 'callDeepSeek renamed'],
  ['catch(parseErr)', 'JSON fallback present'],
  ['buildChatSystemPrompt', 'chat prompt exists'],
  ['buildSystemPrompt', 'D-mode prompt exists'],
  ['PROVIDERS', 'multi-provider exists'],
  ['switchProvider', 'provider switch exists'],
  ['drawRandom', 'draw feature exists'],
  ['closeWelcome', 'welcome modal exists'],
  ['saveHistory', 'history feature exists'],
  ['handleSwitchThinker', 'switch thinker exists'],
  ['sendChatMessage', 'chat feature exists'],
];
let allGood = true;
checks.forEach(([pattern, desc]) => {
  if(html.includes(pattern)) {
    console.log(desc + ' PASS');
  } else {
    console.log(desc + ' FAIL (pattern not found: ' + pattern + ')');
    allGood = false;
  }
});

// 4. Check no duplicate IDs
console.log('\n=== DUPLICATE IDS ===');
const idRe = /id="([^"]+)"/g;
const ids = {};
let m;
while(m = idRe.exec(html)) {
  ids[m[1]] = (ids[m[1]] || 0) + 1;
}
const dups = Object.entries(ids).filter(([,c]) => c > 1);
if(dups.length === 0) console.log('No duplicate IDs PASS');
else dups.forEach(([id,c]) => console.log('DUPLICATE:', id, 'x' + c));

// 5. Summary
console.log('\n=== SUMMARY ===');
console.log('Total size:', (html.length / 1024).toFixed(1), 'KB');
console.log('PHILOSOPHERS count:', (html.match(/"name":"[^"]+","nameEn"/g) || []).length);
console.log('Script tags:', (html.match(/<script>/g) || []).length);
console.log('All checks done');
