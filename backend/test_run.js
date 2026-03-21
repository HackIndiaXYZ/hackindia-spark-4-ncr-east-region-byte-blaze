import fs from 'fs';
import('./server.js').catch(e => {
  fs.writeFileSync('err.txt', e.stack || String(e));
});
