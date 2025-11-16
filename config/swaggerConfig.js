const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Delivery',
    version: '1.0.0',
    description: 'Documentación de la API para la aplicación de Delivery',
  },
  servers: [
    {
      url: 'https://192.168.123.36:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Rutas a tus archivos de API para que swagger los documente
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
