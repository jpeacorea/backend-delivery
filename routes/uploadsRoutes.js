/**
 * @file Rutas para uploads de archivos
 * @module routes/uploadsRoutes
 * @description Define las rutas para subida y eliminación de archivos
 */

const multer = require('multer');
const UploadsController = require('../controllers/uploadsController');

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
     * /api/uploads/image:
     *   post:
     *     summary: Subir una imagen general
     *     tags: [Uploads]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Imagen subida exitosamente
     *       400:
     *         description: No se proporcionó archivo o formato inválido
     */
    app.post('/api/uploads/image', upload.single('file'), UploadsController.uploadImage);

    /**
     * @swagger
     * /api/uploads/image:
     *   delete:
     *     summary: Eliminar una imagen
     *     tags: [Uploads]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - fileId
     *             properties:
     *               fileId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Imagen eliminada
     */
    app.delete('/api/uploads/image', UploadsController.deleteImage);
};
