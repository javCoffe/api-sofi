const express = require('express');
const communicationSchema = require('../models/communication');
const router = express.Router();

/*SERVICIO PARA CREAR COMMUNICATION*/
router.post('/communication/create-communication', async (req, res) => {
    const communi = communicationSchema(req.body);
    communi.save().then((data) => {
        // Usuario creado exitosamente
        res.status(200).json({message: 'Registro agregado exitosamente', state: 1, communicationData: data});
    }).catch((error) => {
        if (error.name === 'ValidationError') {
            // Error de validación de datos (por ejemplo, campos faltantes o inválidos)
            res.status(400).json({message: 'Error de validación de datos', state: 0, error: error.message});
        } else {
            // Error interno del servidor
            res.status(500).json({message: 'Error interno del servidor', error: error.message});
        }
    });
});

/*SERVICIO PARA LISTAR COMMUNICATION*/
router.get('/communication/list-communication/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const communications = await communicationSchema.find({id_User});
        if (communications.length === 0) {
            // No se encontraron registros de comprensión para el id_User proporcionado (error 404)
            return res.status(404).json({
                message: 'No se encontraron registros de communication para el id_User proporcionado',
                state: 0
            });
        }
        res.status(200).json({
            message: 'Registros de communication encontrados exitosamente',
            state: 1,
            communications
        });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar los registros de communication', error: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMUNICATION*/
router.get("/communication/resources-comunication", async (req, res) => {
    const categories = ["adverb", "preposition"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await communicationSchema.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comunication", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría comunication", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
module.exports = router;
