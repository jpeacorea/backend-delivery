/**
 * @file Modelo de datos para la entidad User.
 * @module models/user
 * @description Este archivo contiene un objeto `User` con métodos para interactuar
 *              con la tabla `users` en la base de datos.
 */

// Importa la instancia de conexión a la base de datos configurada con pg-promise.
const db = require('../config/config');
const bcrypt = require('bcryptjs');

/**
 * Objeto que agrupa los métodos del modelo User.
 * @type {object}
 */
const User = {};

/**
 * Obtiene todos los registros de la tabla de usuarios.
 * @returns {Promise<Array<object>>} Una promesa que se resuelve con un array de objetos de usuario.
 *                                    Si no se encuentran usuarios, se resuelve con un array vacío.
 *                                    La promesa se rechaza si ocurre un error en la consulta.
 */
User.getAll = () => {
    // Define la consulta SQL para seleccionar todos los usuarios.
    const sql = `
        SELECT email, name, lastname, phone
        FROM users
    `;

    // Ejecuta la consulta usando el método `manyOrNone` de pg-promise.
    // Este método espera recibir cero o más filas como resultado.
    return db.manyOrNone(sql);
}

User.findById = (id, callback) => {
    const sql = `
    SELECT id, email, name, lastname, phone, password, session_token
    FROM users
    WHERE id = $1`;
    return db.manyOrNone(sql, id).then(user => { callback(null, user); });
}

User.findByEmail = (email) => {
    const sql = `
    SELECT id, email, name, lastname, phone, password, session_token
    FROM users
    WHERE email = $1`;
    return db.oneOrNone(sql, email);
}

User.create = (user) => {
    let hash = bcrypt.hashSync(user.password, 10);

    const sql = `
        INSERT INTO users(email, name, lastname, phone, image, password, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        hash,
        new Date(),
        new Date()
    ]);
}

// Exporta el objeto User para que pueda ser utilizado en otras partes de la aplicación (ej. controladores).
module.exports = User;