/**
 * @file Controlador para las operaciones relacionadas con los usuarios.
 * @module controllers/usersController
 * @description Este archivo contiene la lógica para manejar las peticiones HTTP
 *              que llegan a las rutas de usuarios, interactuando con el modelo User.
 */

// Importa el modelo User para acceder a los métodos de la base de datos.
const User = require('../models/user');

/**
 * Objeto controlador que agrupa las funciones de manejo de rutas para usuarios.
 * @type {object}
 */
module.exports = {

    /**
     * Maneja la petición para obtener todos los usuarios.
     * Es una función asíncrona que responde con una lista de usuarios en formato JSON.
     * @param {import('express').Request} req - El objeto de la petición de Express.
     * @param {import('express').Response} res - El objeto de la respuesta de Express.
     * @param {import('express').NextFunction} next - La función middleware `next` de Express.
     */
    async getAll(req, res, next) {
        try {
            // Llama al método del modelo para obtener todos los usuarios.
            const data = await User.getAll();
            console.log(`Usuarios: ${JSON.stringify(data)}`);

            // Envía una respuesta HTTP 200 (OK) con la lista de usuarios en formato JSON.
            return res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: data
            });
        } catch (error) {
            // En caso de un error en la obtención de datos, se captura aquí.
            console.log(`Error: ${error}`);
            // Envía una respuesta HTTP 500 (Internal Server Error) con un mensaje de error.
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios'
            })
        }
    },
    /**
     * Maneja la petición para registrar un nuevo usuario.
     * Recibe los datos del usuario en el cuerpo de la petición y los guarda en la base de datos.
     * @param {import('express').Request} req - El objeto de la petición de Express, esperando los datos del usuario en `req.body`.
     * @param {import('express').Response} res - El objeto de la respuesta de Express.
     * @param {import('express').NextFunction} next - La función middleware `next` de Express.
     * @returns {Promise<void>} Una promesa que resuelve cuando la operación ha sido completada, enviando una respuesta JSON.
     */
    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);

            return res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: {
                    "id": data.id
                }
            })
        } catch (e) {
            console.log(`Error: ${e}`);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: e.message
            })
        }
    }

}