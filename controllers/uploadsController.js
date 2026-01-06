/**
 * @file Controlador para uploads de archivos
 * @module controllers/uploadsController
 * @description Maneja la subida y eliminación de archivos a Appwrite Storage
 */

const { uploadFile, deleteFile, getPreviewUrl } = require('../config/appwriteConfig');

module.exports = {
    /**
     * Sube una imagen a Appwrite Storage
     */
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó ningún archivo'
                });
            }

            const { buffer, originalname, mimetype } = req.file;
            const result = await uploadFile(buffer, originalname, mimetype);

            return res.status(201).json({
                success: true,
                message: 'Imagen subida correctamente',
                data: {
                    url: result.url,
                    fileId: result.fileId,
                    preview: getPreviewUrl(result.fileId, 200, 200)
                }
            });
        } catch (error) {
            console.error('Error en uploadImage:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al subir la imagen',
                error: error.message
            });
        }
    },

    /**
     * Elimina una imagen de Appwrite Storage
     */
    async deleteImage(req, res) {
        try {
            const { fileId } = req.body;

            if (!fileId) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó el ID del archivo'
                });
            }

            await deleteFile(fileId);

            return res.status(200).json({
                success: true,
                message: 'Imagen eliminada correctamente'
            });
        } catch (error) {
            console.error('Error en deleteImage:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar la imagen',
                error: error.message
            });
        }
    }
};
