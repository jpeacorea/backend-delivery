const UsersController = require('../controllers/usersController');
const multer = require('multer');
const passport = require('passport');

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    },
    fileFilter: (req, file, cb) => {
        // Aceptar solo imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

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
    app.post('/api/users/login', UsersController.login);

    /**
     * @swagger
     * /api/users/update:
     *   put:
     *     summary: Actualizar datos de un usuario (compatible con Android)
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Imagen de perfil del usuario (opcional)
     *               user:
     *                 type: string
     *                 description: JSON string con los datos del usuario (id, name, lastname, phone)
     *     responses:
     *       200:
     *         description: Usuario actualizado exitosamente
     *       400:
     *         description: Datos de entrada inválidos
     *       404:
     *         description: Usuario no encontrado
     */
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.single('image'), UsersController.update);

    app.put('api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }),UsersController.updateWithoutImage);
}
