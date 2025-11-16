/**
 * @file Configuración y conexión a la base de datos PostgreSQL.
 * @module config/database
 * @description Este archivo inicializa y configura la librería pg-promise para establecer
 *              una conexión con la base de datos PostgreSQL. También personaliza el
 *              manejo de tipos de datos y exporta la instancia de conexión.
 */

// Se importa la librería 'bluebird' para ser utilizada como la implementación de promesas,
// lo cual puede ofrecer un mejor rendimiento y características adicionales sobre las promesas nativas.
const promise = require('bluebird');

// Opciones de inicialización para pg-promise.
const options = {
    // Se especifica que 'bluebird' será la librería de promesas.
    promiseLib: promise,

    // Evento que se dispara para cada consulta ejecutada.
    // Actualmente está vacío, pero es un buen lugar para añadir logging de consultas.
    // Ejemplo: console.log('QUERY:', e.query);
    query: (e) => {
    }
};

// Objeto de configuración con los detalles de la conexión a la base de datos.
require('dotenv').config(); // Carga las variables de .env a process.env

// Se inicializa pg-promise con las opciones definidas.
const pgp = require('pg-promise')(options);

// Se accede a la API de tipos de 'node-postgres' a través de pg-promise.
const types = pgp.pg.types;

// Se anula el parser por defecto para el tipo de dato con OID 1114.
// El OID 1114 corresponde al tipo 'timestamp without time zone' en PostgreSQL.
// Por defecto, se convertiría a un objeto Date de JavaScript.
// Con esta configuración, se devuelve como una cadena de texto (string) tal como llega de la base de datos.
// Esto otorga un control manual completo sobre el formato y la zona horaria.
types.setTypeParser(1114, function (stringValue) {
    return stringValue;
});

const databaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

// Se crea la instancia de conexión a la base de datos utilizando la configuración.
const db = pgp(databaseConfig);

// Se exporta la instancia de la base de datos para que pueda ser utilizada en otros módulos de la aplicación.
module.exports = db;