const express = require('express');
const comprenhensionSchema = require('../models/comprehension')
const resourceSchema = require("../models/resource");
const router = express.Router();


/*SERVICIO PARA CREAR LOS COMPREHENSION*/
router.post('/comprehension/create-comprehension', async (req, res) => {
    const comprehen = comprenhensionSchema(req.body);
    comprehen.save().then((data) => {
        // Usuario creado exitosamente
        res.status(200).json({message: 'Registro agregado exitosamente', state: 1, comprehensionData: data});
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

/*SERVICIO PARA LISTAR COMPREHENSION*/
router.get('/comprehension/list-comprehension-user/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const comprehensions = await comprenhensionSchema.find({id_User});
        if (comprehensions.length === 0) {
            // No se encontraron registros de comprensión para el id_User proporcionado (error 404)
            return res.status(404).json({
                message: 'No se encontraron registros de comprensión para el id_User proporcionado',
                state: 0
            });
        }
        res.status(200).json({
            message: 'Registros de comprensión encontrados exitosamente',
            state: 1,
            response:comprehensions
        });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar los registros de comprehension', error: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMPREHENSION*/
router.get("/comprehension/resources-comprehension", async (req, res) => {
    const categories = ["question", "verbs", "adjetives", "utensils"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await resourceSchema.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comprehension", state: 0});
        }

        res.status(200).json({
            message: "Recursos encontrados para la categoría comprehension",
            state: 1,
            response: resources
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
module.exports = router;
