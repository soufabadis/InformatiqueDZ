const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'API Documentation',
        description: '',
    },
    tags: [],
    host: process.env.BACKEND_URL,
    schemes: ['http', 'https'],
    basePath: '/api',

};


swaggerAutogen(outputFile, endpointsFiles, config);
