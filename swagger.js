const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

swaggerDocument.servers = [
    { url: `${process.env.BACKEND_URL}/api` } 
  ];
  

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = swaggerSetup;