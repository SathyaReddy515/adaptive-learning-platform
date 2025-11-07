const bcrypt = require('bcryptjs');

const passwords = ['password123', 'password123', 'password123', 'password123', 'password123'];
const hashedPasswords = [];

const hashPasswords = async () => {
  console.log('Hashing passwords...');
  for (const pw of passwords) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt);
    hashedPasswords.push(hash);
  }
  console.log(hashedPasswords);
  console.log('Copy the array above into your users.js file.');
};

hashPasswords();