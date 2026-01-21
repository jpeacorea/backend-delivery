const Category = require('../models/category');
const { uploadFile } = require('../config/appwriteConfig');

module.exports = {
    async create(req, res, next) {
        try {
            const category = JSON.parse(req.body.category);
            let image = null;
            if (req.file) {
                const { buffer, originalname, mimetype } = req.file;
                const result = await uploadFile(buffer, originalname, mimetype);
                console.log(`Imagen subida a Appwrite: ${result.url}`);
                image = result.url;
            }

            if (image) {
                category.image = image;
            }

            const data = await Category.create(category);

            return res.status(201).json({
                success: true,
                message: 'La categoría se ha creado correctamente',
                data: {
                    'id': data.id
                }
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoría',
                error: error.message
            });
        }
    }
};