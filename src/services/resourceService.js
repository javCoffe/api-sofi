const express = require('express');
const resourceSchema = require('../models/resource');
const router = express.Router();

// Ruta para crear un nuevo recurso
router.post("/resources/create-resource", async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {name, path, category, icon, url} = req.body;

        // Validar los datos antes de crear el recurso (por ejemplo, asegurarse de que todos los campos requeridos estén presentes)

        if (!name || !path || !category || !icon || !url) {
            // Datos de solicitud incompletos (error 400)
            return res.status(400).json({message: "Datos de solicitud incompletos", state: 0});
        }

        // Crear una nueva instancia del modelo Resource
        const newResource = new resourceSchema({name, path, category, icon, url});

        // Guardar el nuevo recurso en la base de datos
        const savedResource = await newResource.save();

        // Devolver el recurso creado como respuesta (error 201)
        res.status(200).json({message: "Recurso creado exitosamente", state: 1, resource: savedResource});
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: "Error al crear el recurso", error: error.message});
    }
});

// MICROSERVICIO PARA LISTAR TODOS LOS RECURSOS
router.get("/resources/list-resources", async (req, res) => {
    try {
        const resources = await resourceSchema.find();

        if (resources.length === 0) {
            // No se encontraron recursos (error 404)
            return res.status(400).json({message: "No se encontraron recursos", state: 0});
        }

        // Recursos encontrados con éxito (error 200)
        res.status(200).json({message: "Recursos encontrados exitosamente", state: 1, resources});
    } catch (error) {
        // Error interno del servidor (error 500)
        res.status(500).json({message: "Error al listar los recursos", error: error.message});
    }
});

/*SERVICIO PARA ACTUALIZAR EL ESTADO DEL APRENDIZAJE*/
router.put("/resources/resources-state/:id", async (req, res) => {
    const {id} = req.params;
    const {state} = req.body;

    try {
        const updatedResource = await resourceSchema.findByIdAndUpdate(id, {state}, {new: true});

        if (updatedResource) {
            // Estado de la imagen actualizado exitosamente
            res.status(200).json({
                message: 'Estado de la imagen actualizado exitosamente',
                state: 1,
                resource: updatedResource
            });
        } else {
            // Imagen no encontrada
            res.status(400).json({message: 'Imagen no encontrada', state: 0});
        }
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({message: "Error al actualizar el estado de la imagen", error: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMPREHENSION*/
router.get("/resources/resources-comprehension", async (req, res) => {
    const categories = ["question", "verbs", "adjetives", "utensils"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await resourceSchema.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comprehension", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría comprehension", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE EXPRESSION*/
router.get("/resources/resources-expression", async (req, res) => {
    const categories = ["abc", "numbers", "common-expressions", "colors"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await resourceSchema.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría expression", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría expression", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMUNICATION*/
router.get("/resources/resources-comunication", async (req, res) => {
    const categories = ["adverb", "preposition"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await resourceSchema.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comunication", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría comunication", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Ruta para obtener recursos por categoría
router.get("/resources/list-category/:category", async (req, res) => {
    const {category} = req.params;
    try {
        // Realizar una consulta para buscar recursos por categoría
        const resources = await resourceSchema.find({category});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría especificada", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría especificada", state: 1, resources});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
