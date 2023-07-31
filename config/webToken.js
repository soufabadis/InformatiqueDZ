var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 
const fs = require('fs');


const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');




const tokenGenerator = function(id,email) {
     const expiresIn = '3d'; // 3 days
     let token = jwt.sign({ id :id ,email: email  }, privateKey, { algorithm: 'RS256', expiresIn });
     return token;
   };
   
   module.exports = tokenGenerator;