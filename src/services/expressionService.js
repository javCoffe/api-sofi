const express = require('express')
const expressSchema = require('../models/expression')

const router = express.Router()

/*SERVICIO PARA CREAR LOS EXPRESSION*/
router.post('/expression/create-expression', async (req, res) => {
    const express = expressSchema(req.body);
    express.save().then((data) => {
        // Usuario creado exitosamente
        res.status(200).json({message: 'Registro agregado exitosamente', state: 1, expressionData: data});
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

/*SERVICIO PARA LISTAR EXPRESSION*/
router.get('/expression/list-expression/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const expressions = await expressSchema.find({id_User});
        if (expressions.length === 0) {
            // No se encontraron registros de comprensión para el id_User proporcionado (error 404)
            return res.status(404).json({
                message: 'No se encontraron registros de expression para el id_User proporcionado',
                state: 0
            });
        }
        res.status(200).json({
            message: 'Registros de expression encontrados exitosamente',
            state: 1,
            expressions
        });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar los registros de expression', error: error.message});
    }
});

module.exports = router;
