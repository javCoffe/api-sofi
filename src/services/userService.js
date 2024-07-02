const express = require('express')
const userSchema = require('../models/user');

const router = express.Router();

// MICROSERVICIO PARA EL LOGIN DEL USUARIO
router.post('/user/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await userSchema.findOne({email, password});

        if (user) {
            // Usuario encontrado
            const {_id} = user;
            res.status(200).json({message: 'Inicio de sesión exitoso', state: 1, userId: _id});
        } else {
            // Usuario no encontrado o contraseña incorrecta
            res.status(400).json({message: 'Correo electrónico o contraseña incorrectos', state: 0});
        }
    } catch (error) {
        res.status(500).json({message: 'Error al iniciar sesión', error: error.message});
    }
});

// MICROSERVICIO PARA CREAR UN USUARIO
router.post("/user/create-user", async (req, res) => {

    const existingUser = await userSchema.findOne({email: req.body.email});
    if (existingUser) {
        // El correo electrónico ya está en uso
        res.status(400).json({message: 'Ya existe una cuenta con ese correo', state: 0});
    } else {
        // El correo electrónico no está en uso, crea el nuevo usuario
        const user = new userSchema(req.body);
        user.save()
            .then((data) => {
                // Usuario creado exitosamente
                res.status(200).json({message: 'Usuario creado exitosamente', state: 1, response: data});
            })
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    // Error de validación de datos (por ejemplo, campos faltantes o inválidos)
                    res.status(400).json({message: 'Error de validación de datos', state: 0, error: error.message});
                } else {
                    // Error interno del servidor
                    res.status(500).json({message: 'Error interno del servidor', error: error.message});
                }
            });
    }
});

// MICROSERVICIO PARA TENER LA LISTA DE USUARIOS
router.get("/user/list-users", (req, res) => {
    userSchema
        .find()
        .then((data) => {
            // Usuarios encontrados exitosamente
            res.status(200).json({message: 'Usuarios encontrados exitosamente', state: 1, response: data});
        })
        .catch((error) => {
            if (error.name === 'CastError') {
                // Error de solicitud incorrecta (por ejemplo, un ID no válido)
                res.status(400).json({
                    message: 'Solicitud incorrecta al listar usuarios',
                    state: 0,
                    error: error.message
                });
            } else {
                // Error interno del servidor
                res.status(500).json({message: "Error al listar los usuarios", error: error.message});
            }
        });
});

//MICROSERVICIO PARA ENCONTRAR UN USUARIO
router.get("/user/find-user/:id", (req, res) => {
    const {id} = req.params;
    userSchema
        .findById(id)
        .then((data) => {
            if (data) {
                // Usuario encontrado exitosamente
                res.status(200).json({message: 'Usuario encontrado exitosamente', state: 1, response: data});
            } else {
                // Usuario no encontrado
                res.status(400).json({message: 'Usuario no encontrado', state: 0});
            }
        })
        .catch((error) => {
            // Error interno del servidor
            res.status(500).json({message: "Error al obtener el usuario", error: error.message});
        });
});

//MICROSERVICIO PARA EDITAR EL USUARIO
router.put("/user/edit-user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userDataToUpdate = req.body;

        // Verifica si el usuario existe
        const existingUser = await userSchema.findById(userId);
        if (!existingUser) {
            return res.status(404).json({message: 'Usuario no encontrado', state: 0});
        }

        // Actualiza los datos del usuario
        const userUpdate = await userSchema.findByIdAndUpdate(userId, userDataToUpdate, {new: true});
        res.status(200).json({message: 'Usuario actualizado correctamente', response: userUpdate, state: 1});
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({message: 'Error de validación de datos', state: 0, error: error.message});
        } else {
            res.status(500).json({message: 'Error interno del servidor', error: error.message, state: 0});
        }
    }
});


// MICROSERVICIO PARA RESTABLECER LA CONTRASEÑA DEL USUARIO
router.post("/user/reset-password", async (req, res) => {
    const {email, newPassword} = req.body;

    try {
        // Busca un usuario por correo electrónico
        const user = await userSchema.findOne({email});

        if (!user) {
            // Usuario no encontrado
            return res.status(400).json({message: 'Usuario no encontrado', state: 0});
        }

        // Actualiza la contraseña del usuario con la nueva contraseña proporcionada
        user.password = newPassword;

        // Guarda los cambios en la base de datos
        await user.save();

        // Respuesta exitosa
        res.status(200).json({message: 'Contraseña restablecida exitosamente', state: 1});
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({message: 'Error al restablecer la contraseña', error: error.message});
    }
});

// Ruta para verificar la existencia de un correo electrónico
router.post('/user/verify-email/:email', async (req, res) => {
    const {email} = req.body;

    try {
        const users = await userSchema.findOne({email});

        if (users) {
            // Correo electrónico encontrado en la base de datos
            res.status(200).json({message: 'Correo electrónico registrado', state: 1});
        } else {
            // Correo electrónico no encontrado en la base de datos
            res.status(400).json({message: 'Correo electrónico no registrado', state: 0});
        }
    } catch (error) {
        // Error al buscar en la base de datos
        res.status(500).json({message: 'Error al verificar el correo electrónico', error: error.message});
    }
});

// MICROSERVICIO PARA VALIDAR LAS PREGUNTAS DE SEGURIDAD
router.post('/user/:email/check-answer', async (req, res) => {
    const {email, firstQuestion, secondQuestion, thirdQuestion} = req.body;

    try {
        // Buscar el usuario por correo electrónico
        const user = await userSchema.findOne({email});

        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado', state: 0});
        }

        // Verificar si la pregunta y respuesta coinciden con alguna de las preguntas de seguridad (ignorar espacios en blanco)
        const securityQuestion1 = user.firstQuestion.trim();
        const securityQuestion2 = user.secondQuestion.trim();
        const securityQuestion3 = user.thirdQuestion.trim();

        if (securityQuestion1.trim() === firstQuestion.trim() && securityQuestion2.trim() === secondQuestion.trim() && securityQuestion3.trim() === thirdQuestion.trim()) {
            res.status(200).json({message: 'Respuestas de seguridad verificada', state: 1});
        } else {
            res.status(400).json({message: 'Respuestas de seguridad incorrecta', state: 0});
        }
    } catch (error) {
        res.status(500).json({message: 'Error al verificar la respuesta de seguridad', error: error.message});
    }
});

/*SERVICIO PARA ACTUALIZAR LOS CAMPOS DE PROGRESO*/
router.put("/user/user-progress/:id", async (req, res) => {
    const {id} = req.params;
    const {campo, valor} = req.body; // Campo y valor a actualizar

    // Verifica que el campo enviado sea uno de los campos permitidos
    const camposPermitidos = ['progressComprehension', 'progressExpression', 'progressComunication'];
    if (!camposPermitidos.includes(campo)) {
        return res.status(400).json({message: 'Campo no permitido', state: 0});
    }

    // Crea un objeto dinámico para actualizar el campo específico
    const camposActualizados = {[campo]: valor};

    try {
        const updatedUser = await userSchema.findByIdAndUpdate(id, camposActualizados, {new: true});

        if (updatedUser) {
            res.status(200).json({
                message: 'Campo del usuario actualizado exitosamente',
                state: 1,
                response: updatedUser
            });
        } else {
            res.status(400).json({message: 'Usuario no encontrado', state: 0});
        }
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({message: "Error al actualizar el campo del usuario", error: error.message});
    }
});

module.exports = router;
