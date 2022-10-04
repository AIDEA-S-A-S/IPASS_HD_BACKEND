const fs = require('fs');
const path = require('path');

module.exports.qrReloaded = fs.readFileSync(path.join(__dirname, 'qrReloaded.ts'), 'utf8');
module.exports.subGetState = fs.readFileSync(path.join(__dirname, 'subGetState.ts'), 'utf8');
module.exports.subListContact = fs.readFileSync(path.join(__dirname, 'subListContact.ts'), 'utf8');
module.exports.subListEventExpress = fs.readFileSync(path.join(__dirname, 'subListEventExpress.ts'), 'utf8');
module.exports.subSecurityByLocation = fs.readFileSync(path.join(__dirname, 'subSecurityByLocation.ts'), 'utf8');
module.exports.subListLocation = fs.readFileSync(path.join(__dirname, 'subListLocation.ts'), 'utf8');
module.exports.subUser = fs.readFileSync(path.join(__dirname, 'subUser.ts'), 'utf8');
