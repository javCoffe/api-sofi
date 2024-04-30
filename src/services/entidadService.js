const express = require('express');
const entidadSchema = require('../models/entidad')
const router = express.Router();

/*SERVICIO PARA CREAR LA ENTIDAD*/
router.post("/entity/create-entity", async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {id_Entity, nameEntity, imgEntity, stateEntity} = req.body;

        // Validar los datos antes de crear el recurso (por ejemplo, asegurarse de que todos los campos requeridos estén presentes)

        if (!id_Entity || !nameEntity || !imgEntity || !stateEntity) {
            // Datos de solicitud incompletos (error 400)
            return res.status(400).json({message: "Datos de solicitud incompletos", state: 0});
        }

        // Crear una nueva instancia del modelo Resource
        const newEntity = new entidadSchema({id_Entity, nameEntity, imgEntity, stateEntity});

        // Guardar el nuevo recurso en la base de datos
        const savedResource = await newEntity.save();

        // Devolver el recurso creado como respuesta (error 201)
        res.status(200).json({message: "Entidad creada exitosamente", state: 1, resource: savedResource});
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: "Error al crear la entidad", error: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS ENTIDADES*/
router.get('/entity/list-entity', async (req, res) => {
    try {
        const entities = await entidadSchema.find();

        if (entities.length === 0) {
            // No se encontraron recursos (error 404)
            return res.status(404).json({message: 'No se encontraron entidades', state: 0});
        }

        // Recursos encontrados con éxito (error 200)
        res.status(200).json({message: 'Entidades encontradas exitosamente', state: 1, response: entities});
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar las entidades', error: error.message});
    }
});

/*SERVICIO PARA ACTUALIZAR EL ESTADO DE LAS ENTIDADES*/
router.put("/entity/entity-state/:id", async (req, res) => {
    const {id} = req.params;
    const {stateEntity} = req.body;

    try {
        const updatedEntity = await entidadSchema.findByIdAndUpdate(id, {stateEntity}, {new: true});

        if (updatedEntity) {
            res.status(200).json({
                message: 'Estado de la entidad actualizada exitosamente',
                state: 1,
                entity: updatedEntity
            });
        } else {
            res.status(400).json({message: 'Entidad no encontrada', state: 0});
        }
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({message: "Error al actualizar el estado de la entidad", error: error.message});
    }
});

module.exports = router;
