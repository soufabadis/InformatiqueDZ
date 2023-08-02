const jwt  = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config(); 
const fs = require('fs');


const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');



const refreshTokenGenerator = function(id) {
    const expiresIn = '4d'; // 4 days
    let token = jwt.sign({_id :id} , privateKey, { algorithm: 'RS256', expiresIn });
    return token;
  };
  
  module.exports = refreshTokenGenerator;