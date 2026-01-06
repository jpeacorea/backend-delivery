/**
 * @file Configuración de Appwrite Storage
 * @module config/appwriteConfig
 * @description Inicializa el cliente de Appwrite para almacenamiento de archivos
 */

require('dotenv').config();
const { Client, Storage, ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');

// Validar que las variables de entorno estén configuradas
if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
    console.warn('⚠️  Variables de Appwrite no configuradas en .env');
}

// Crear cliente de Appwrite
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

// Instancia de Storage
const storage = new Storage(client);

// ID del bucket para imágenes
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || 'images';

/**
 * Sube un archivo a Appwrite Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 * @returns {Promise<{url: string, fileId: string}>}
 */
const uploadFile = async (fileBuffer, fileName, mimeType) => {
    try {
        // Generar ID único
        const fileId = ID.unique();

        // Crear InputFile desde buffer
        const inputFile = InputFile.fromBuffer(fileBuffer, fileName);

        // Subir archivo
        const result = await storage.createFile(
            BUCKET_ID,
            fileId,
            inputFile
        );

        // Construir URL de vista del archivo
        const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

        return {
            url: fileUrl,
            fileId: result.$id
        };
    } catch (error) {
        throw new Error(`Error al subir archivo: ${error.message}`);
    }
};

/**
 * Elimina un archivo de Appwrite Storage
 * @param {string} fileId - ID del archivo
 * @returns {Promise<boolean>}
 */
const deleteFile = async (fileId) => {
    try {
        await storage.deleteFile(BUCKET_ID, fileId);
        return true;
    } catch (error) {
        throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
};

/**
 * Obtiene la URL de preview de una imagen (con transformaciones)
 * @param {string} fileId - ID del archivo
 * @param {number} width - Ancho deseado
 * @param {number} height - Alto deseado
 * @returns {string}
 */
const getPreviewUrl = (fileId, width = 400, height = 400) => {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${process.env.APPWRITE_PROJECT_ID}&width=${width}&height=${height}`;
};

module.exports = {
    client,
    storage,
    uploadFile,
    deleteFile,
    getPreviewUrl,
    BUCKET_ID
};
