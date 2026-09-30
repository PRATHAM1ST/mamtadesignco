const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, '..', 'public', 'icon-512-transparent.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="512" height="512" />
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'app', 'assets', 'favicon.svg'), svg);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), svg);
console.log('Saved favicon.svg in app/assets and public');
