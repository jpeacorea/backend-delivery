const UsersController = require('../controllers/usersController');

module.exports = (app) => {

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Obtener todos los usuarios
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de todos los usuarios
     *       401:
     *         description: No autorizado
     */
    app.get('/api/users', UsersController.getAll);

    /**
     * @swagger
     * /api/users/create:
     *   post:
     *     summary: Crear un nuevo usuario (Registro)
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               name:
     *                 type: string
     *               lastname:
     *                 type: string
     *               phone:
     *                 type: string
     *               image:
     *                 type: string
     *               password:
     *                 type: string
     *               created_at:
     *                 type: string
     *               updated_at:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *       400:
     *         description: Datos de entrada inválidos
     */
    app.post('/api/users/create', UsersController.register);

    /**
     * @swagger
     * /api/users/login:
     *   post:
     *     summary: Iniciar sesión para obtener un token
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login exitoso, devuelve el token.
     *       401:
     *         description: Credenciales incorrectas.
     */
    //app.post('/api/users/login', UsersController.login);
}
