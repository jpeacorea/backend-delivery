// Importa el módulo 'express' para crear y configurar el servidor web.
const express = require('express');
const app = express();
// Importa el módulo 'https' para crear un servidor HTTPS.
// const https = require('https');
const http = require('http');
// Importa el módulo 'morgan' para el registro de solicitudes HTTP.
const logger = require('morgan');
// Importa el módulo 'cors' para habilitar Cross-Origin Resource Sharing.
const cors = require('cors');
// Importa 'swagger-ui-express' para servir la documentación de la API.
const swaggerUi = require('swagger-ui-express');
// Importa la configuración de Swagger desde un archivo local.
const swaggerSpec = require('./config/swaggerConfig');

const passport = require('passport');

/*
 * RUTAS
 */
// Importa las rutas de usuario desde un archivo local.
const users = require('./routes/usersRoutes');
// Importa las rutas de uploads
const uploads = require('./routes/uploadsRoutes');
// Importa las rutas de categorias
const categories = require('./routes/categoriesRoutes');
// Importa el módulo 'fs' para interactuar con el sistema de archivos.
const fs = require("node:fs");
// Importa el módulo 'path' para trabajar con rutas de archivos y directorios.
const path = require("node:path");

// Define el puerto del servidor, usando la variable de entorno PORT o 3000 por defecto.
const port = process.env.PORT || 3000;

// Usa 'morgan' para registrar las solicitudes en formato 'dev' (conciso y colorido).
app.use(logger('dev'));
// Habilita el middleware para parsear cuerpos de solicitud JSON.
app.use(express.json());
// Habilita el middleware para parsear cuerpos de solicitud URL-encoded.
app.use(express.urlencoded({
    extended: true
}));

// Habilita CORS para permitir solicitudes desde diferentes orígenes.
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Configura la ruta '/api-docs' para servir la interfaz de usuario de Swagger.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Deshabilita el encabezado 'X-Powered-By' para mayor seguridad.
app.disable('x-powered-by');

// Lee los archivos de la clave privada y el certificado SSL.
// let options;
// try {
//     options = {
//         key: fs.readFileSync(path.join(__dirname, 'ssl', '192.168.123.36.key')),
//         cert: fs.readFileSync(path.join(__dirname, 'ssl', '192.168.123.36.crt')),
//         passphrase: process.env.SSL_KEY_PASSPHRASE // Añade la contraseña desde una variable de entorno
//     };
// } catch (error) {
//     console.error('Error al leer los archivos SSL. Asegúrate de que los archivos "private.key" y "certificate.crt" existan en el directorio "ssl".');
//     console.error(error);
//     process.exit(1); // Detiene la ejecución si no se pueden cargar los certificados.
// }

// Establece el puerto en la configuración de la aplicación.
app.set('port', port);

/*
 * LLAMANDO A LA RUTA
 */
// Llama a la función de rutas de usuario, pasándole la instancia de la aplicación Express.
users(app);
// Llama a la función de rutas de uploads
uploads(app);
// Llama a la función de rutas de categorias
categories(app);

// Define el HOST, usando la variable de entorno HOSTNAME o '0.0.0.0' por defecto.
const HOST = process.env.HOSTNAME || '0.0.0.0';

// Crea un servidor HTTPS usando las opciones SSL y la aplicación Express.
// const server = https.createServer(options, app);
const server = http.createServer(app);
// Inicia el servidor HTTPS en el puerto y host especificados.
server.listen(port, HOST, function () {
    // console.log(`Aplicacion de NodeJS iniciada en https://${HOST}:${port}/api-docs`);
    console.log(`Aplicacion de NodeJS iniciada en http://${HOST}:${port}/api-docs`);
});

// Middleware de manejo de errores global.
/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
app.use((err, req, res, _next) => {
    // Loguea el error completo (stack trace) para depuración interna.
    console.error(err.stack);

    // Prepara una respuesta de error genérica para el cliente.
    const errorResponse = {
        success: false,
        message: 'Ocurrió un error inesperado en el servidor.'
    };

    // Si el entorno es de desarrollo, añade detalles adicionales del error a la respuesta.
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = err.message;
        errorResponse.stack = err.stack;
    }

    // Envía una respuesta de estado 500 (Error Interno del Servidor) con el JSON de error.
    res.status(500).json(errorResponse);
});

// Exporta la instancia de la aplicación y el servidor para que puedan ser utilizados en otros módulos (por ejemplo, para pruebas).
module.exports = {
    app: app,
    server: server
}

// Códigos de estado HTTP comunes:
// 200 OK - La solicitud ha tenido éxito.
// 404 Not Found - El recurso solicitado no se encontró.
// 500 Internal Server Error - Un error inesperado ocurrió en el servidor.