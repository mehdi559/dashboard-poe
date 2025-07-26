const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync('ma-cle-secrete-tres-longue', 'sel', 32);
const iv = Buffer.alloc(16, 0); // IV fixe pour la démo

function encryptAndSaveJSON(obj, filePath) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const json = JSON.stringify(obj);
  let encrypted = cipher.update(json, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  fs.writeFileSync(filePath, encrypted, 'utf8');
}

function decryptAndLoadJSON(filePath) {
  const encrypted = fs.readFileSync(filePath, 'utf8');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

module.exports = { encryptAndSaveJSON, decryptAndLoadJSON }; 