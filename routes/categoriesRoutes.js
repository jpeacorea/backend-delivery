const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');
const multer = require('multer');

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
     * /api/categories/create:
     *   post:
     *     summary: Crear una nueva categoría
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               category:
     *                 type: string
     *                 description: JSON string con los datos de la categoría (name, description)
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Imagen de la categoría
     *     responses:
     *       201:
     *         description: Categoría creada exitosamente
     *       501:
     *         description: Error en el servidor
     */
    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.single('image'), CategoriesController.create);
};