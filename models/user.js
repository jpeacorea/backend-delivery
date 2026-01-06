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
    return db.manyOrNone(sql, id).then(user => {
        callback(null, user);
    });
}

User.findByEmail = (email) => {
    const sql = `
        SELECT U.id,
               U.email,
               U.name,
               U.lastname,
               U.image,
               U.phone,
               U.password,
               U.session_token,
               json_agg(
                       json_build_object(
                               'id', R.id,
                               'name', R.name,
                               'image', R.image,
                               'route', R.route
                       )
               ) AS roles
        FROM users AS U
                 INNER JOIN
             user_has_roles AS UHR
             ON
                 UHR.id_user = U.id
                 INNER JOIN
             roles AS R
             ON
                 R.id = UHR.id_role
        WHERE U.email = $1
        GROUP BY U.id`;
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

/**
 * Actualiza la imagen de perfil de un usuario
 * @param {number} id - ID del usuario
 * @param {string} imageUrl - URL de la nueva imagen
 * @returns {Promise<object>}
 */
User.updateImage = (id, imageUrl) => {
    const sql = `
        UPDATE users
        SET image = $2, updated_at = $3
        WHERE id = $1
        RETURNING id, image
    `;
    return db.oneOrNone(sql, [id, imageUrl, new Date()]);
}

/**
 * Actualiza los datos de un usuario (compatible con Android)
 * @param {object} user - Objeto con los datos del usuario a actualizar
 * @returns {Promise<object>}
 */
User.update = (user) => {
    const sql = `
        UPDATE users
        SET name = $2,
            lastname = $3,
            phone = $4,
            image = $5,
            updated_at = $6
        WHERE id = $1
        RETURNING id, email, name, lastname, phone, image
    `;
    return db.oneOrNone(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateSessionToken = (id_user, session_token) => {
    const sql = `
    UPDATE users
    SET session_token = $2
    WHERE id = $1`
    return db.oneOrNone(sql, [id_user, session_token]);
}

// Exporta el objeto User para que pueda ser utilizado en otras partes de la aplicación (ej. controladores).
module.exports = User;