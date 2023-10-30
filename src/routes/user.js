const express = require("express");
const userSchema = require("../models/user");
const entitySchema = require("../models/entidad");
const comprehension = require("../models/comprehension");
const expression = require("../models/expression");
const communication = require("../models/communication");

const router = express.Router();
// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const {email, password, id_School} = req.body;

    try {
        const user = await userSchema.findOne({email, password});

        if (user) {
            // Usuario encontrado
            if (user.id_School === id_School) {
                // entityId coincide con id_School del usuario
                const {_id} = user;
                res.status(200).json({message: 'Inicio de sesión exitoso', state: 1, userId: _id});
            } else {
                // entityId no coincide con id_School del usuario
                res.status(400).json({
                    message: 'El colegio no coincide con el usuario. Por favor, comunicarse con el área de Soporte',
                    state: 0
                });
            }
        } else {
            // Usuario no encontrado o contraseña incorrecta
            res.status(400).json({message: 'Correo electrónico o contraseña incorrectos', state: 0});
        }
    } catch (error) {
        // Error al buscar en la base de datos
        res.status(500).json({message: 'Error al iniciar sesión', error: error.message});
    }
});

// create user
router.post("/users", async (req, res) => {
    // Verifica si el correo electrónico ya está en uso
    const existingUser = await userSchema.findOne({ email: req.body.email });

    if (existingUser) {
        // El correo electrónico ya está en uso
        res.status(400).json({ message: 'Ya existe una cuenta con ese correo', state: 0 });
    } else {
        // El correo electrónico no está en uso, crea el nuevo usuario
        const user = new User(req.body);

        user.save()
            .then((data) => {
                // Usuario creado exitosamente
                res.status(200).json({ message: 'Usuario creado exitosamente', state: 1, userData: data });
            })
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    // Error de validación de datos (por ejemplo, campos faltantes o inválidos)
                    res.status(400).json({ message: 'Error de validación de datos', state: 0, error: error.message });
                } else {
                    // Error interno del servidor
                    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
                }
            });
    }
});


// get all users
// get all users
router.get("/users", (req, res) => {
    userSchema
        .find()
        .then((data) => {
            // Usuarios encontrados exitosamente
            res.status(200).json({message: 'Usuarios encontrados exitosamente', state: 1, users: data});
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

// get a user
// get a user
router.get("/users/:id", (req, res) => {
    const {id} = req.params;
    userSchema
        .findById(id)
        .then((data) => {
            if (data) {
                // Usuario encontrado exitosamente
                res.status(200).json({message: 'Usuario encontrado exitosamente', state: 1, user: data});
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


// update a user
// update a user
router.put("/users/:id", (req, res) => {
    const {id} = req.params;
    const {
        name,
        lastname,
        age,
        id_School,
        email,
        studentCode,
        firstQuestion,
        secondQuestion,
        thirdQuestion,
        password
    } = req.body;

    userSchema
        .updateOne({_id: id}, {
            $set: {
                name,
                lastname,
                age,
                id_School,
                email,
                studentCode,
                firstQuestion,
                secondQuestion,
                thirdQuestion,
                password
            }
        })
        .then((data) => {
            if (data.nModified > 0) {
                // Usuario actualizado exitosamente
                res.status(200).json({message: 'Usuario actualizado exitosamente', state: 1, user: data});
            } else {
                // Usuario no encontrado o no se ha realizado ninguna modificación
                res.status(400).json({
                    message: 'Usuario no encontrado o no se ha realizado ninguna modificación',
                    state: 0
                });
            }
        })
        .catch((error) => {
            // Error interno del servidor
            res.status(500).json({message: "Error al actualizar el usuario", error: error.message});
        });
});


// delete a user
// delete a user
router.delete("/users/:id", (req, res) => {
    const {id} = req.params;

    userSchema
        .deleteOne({_id: id})
        .then((data) => {
            if (data.deletedCount > 0) {
                // Usuario eliminado exitosamente
                res.status(200).json({message: 'Usuario eliminado exitosamente', state: 1, user: data});
            } else {
                // Usuario no encontrado
                res.status(400).json({message: 'Usuario no encontrado', state: 0});
            }
        })
        .catch((error) => {
            // Error interno del servidor
            res.status(500).json({message: "Error al eliminar el usuario", error: error.message});
        });
});


// Ruta para listar los inicios de sesión de un usuario específico
// Ruta para listar los inicios de sesión de un usuario específico
router.get("/users/:id/logins", async (req, res) => {
    const {id} = req.params;
    try {
        const user = await userSchema.findById(id);
        if (!user) {
            // Usuario no encontrado (error 404)
            return res.status(400).json({message: "Usuario no encontrado", state: 0});
        }
        // Retorna la lista de inicios de sesión del usuario
        res.status(200).json({
            message: "Inicios de sesión del usuario encontrados",
            state: 1,
            loginTimestamps: user.loginTimestamps
        });
    } catch (error) {
        // Error interno del servidor (error 500)
        res.status(500).json({message: "Error al obtener los inicios de sesión del usuario", error: error.message});
    }
});


// Ruta para restablecer la contraseña utilizando el correo electrónico
router.post("/users/reset-password", async (req, res) => {
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

// Sección para los Recursos de Sofía

const Resource = require("../models/resource"); // Asegúrate de importar el modelo Resource correctamente

// Ruta para crear un nuevo recurso
router.post("/resources", async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {name, path, category, icon, url, state} = req.body;

        // Validar los datos antes de crear el recurso (por ejemplo, asegurarse de que todos los campos requeridos estén presentes)

        if (!name || !path || !category || !icon || !url || !state) {
            // Datos de solicitud incompletos (error 400)
            return res.status(400).json({message: "Datos de solicitud incompletos", state: 0});
        }

        // Crear una nueva instancia del modelo Resource
        const newResource = new Resource({name, path, category, icon, url, state});

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


// Ruta para listar todos los recursos
router.get("/resources", async (req, res) => {
    try {
        const resources = await Resource.find();

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


// Ruta para obtener recursos por categoría
router.get("/resources/:category", async (req, res) => {
    const {category} = req.params;
    try {
        // Realizar una consulta para buscar recursos por categoría
        const resources = await Resource.find({category});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría especificada", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría especificada", state: 1, resources});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Ruta para verificar la existencia de un correo electrónico
router.post('/users/:email', async (req, res) => {
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

// Ruta para verificar la existencia de un correo electrónico
router.post('/users/check-answer/:email', async (req, res) => {
    const {email, firstQuestion, secondQuestion, thirdQuestion} = req.body;

    try {
        // Buscar el usuario por correo electrónico
        const user = await userSchema.findOne({email});

        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado', state: 0});
        }

        // Verificar si la pregunta y respuesta coinciden con alguna de las preguntas de seguridad
        const securityQuestion1 = user.firstQuestion;
        const securityQuestion2 = user.secondQuestion;
        const securityQuestion3 = user.thirdQuestion;

        if (securityQuestion1 === firstQuestion && securityQuestion2 === secondQuestion && securityQuestion3 === thirdQuestion) {
            res.status(200).json({message: 'Respuesta de seguridad verificada', state: 1});
        } else {
            res.status(400).json({message: 'Respuesta de seguridad incorrecta', state: 0});
        }
    } catch (error) {
        res.status(500).json({message: 'Error al verificar la respuesta de seguridad', error: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMPREHENSION*/
router.get("/resources-comprehension", async (req, res) => {
    const categories = ["question", "verbs", "adjetives", "utensils"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await Resource.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comprehension", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría comprehension", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE EXPRESSION*/
router.get("/resources-expression", async (req, res) => {
    const categories = ["abc", "numbers", "common-expressions", "colors"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await Resource.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría expression", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría expression", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

/*SERVICIO PARA LISTAR LAS CATEGORÍAS DE COMUNICATION*/
router.get("/resources-comunication", async (req, res) => {
    const categories = ["adverb", "preposition"];

    try {
        // Realizar una consulta para buscar recursos por categorías específicas
        const resources = await Resource.find({category: {$in: categories}});

        if (!resources || resources.length === 0) {
            return res.status(400).json({message: "Recursos no encontrados para la categoría comunication", state: 0});
        }

        res.status(200).json({message: "Recursos encontrados para la categoría comunication", state: 1, resources});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
/*SERVICIO PARA ACTUALIZAR EL ESTADO DEL APRENDIZAJE*/
router.put("/resources-state/:id", async (req, res) => {
    const {id} = req.params;
    const {state} = req.body;

    try {
        const updatedResource = await Resource.findByIdAndUpdate(id, {state}, {new: true});

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

/*SERVICIO PARA CREAR LA ENTIDAD*/
router.post("/entity", async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {id_Entity, nameEntity, imgEntity, stateEntity} = req.body;

        // Validar los datos antes de crear el recurso (por ejemplo, asegurarse de que todos los campos requeridos estén presentes)

        if (!id_Entity || !nameEntity || !imgEntity || !stateEntity) {
            // Datos de solicitud incompletos (error 400)
            return res.status(400).json({message: "Datos de solicitud incompletos", state: 0});
        }

        // Crear una nueva instancia del modelo Resource
        const newEntity = new entitySchema({id_Entity, nameEntity, imgEntity, stateEntity});

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
router.get('/entity-list', async (req, res) => {
    try {
        const entities = await entitySchema.find();

        if (entities.length === 0) {
            // No se encontraron recursos (error 404)
            return res.status(404).json({message: 'No se encontraron entidades', state: 0});
        }

        // Recursos encontrados con éxito (error 200)
        res.status(200).json({message: 'Entidades encontradas exitosamente', state: 1, entities});
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar las entidades', error: error.message});
    }
});

/*SERVICIO PARA ACTUALIZAR EL ESTADO DE LAS ENTIDADES*/
router.put("/entity-state/:id", async (req, res) => {
    const {id} = req.params;
    const {stateEntity} = req.body;

    try {
        const updatedEntity = await entitySchema.findByIdAndUpdate(id, {stateEntity}, {new: true});

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

/*SERVICIO PARA ACTUALIZAR LOS CAMPOS DE PROGRESO*/
router.put("/user-progress/:id", async (req, res) => {
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
                user: updatedUser
            });
        } else {
            res.status(400).json({message: 'Usuario no encontrado', state: 0});
        }
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({message: "Error al actualizar el campo del usuario", error: error.message});
    }
});

/*SERVICIO PARA CREAR LOS COMPREHENSION*/
router.post('/create-comprehension', async (req, res) => {
    const comprehen = comprehension(req.body);
    comprehen
        .save()
        .then((data) => {
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
router.get('/list-comprehension/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const comprehensions = await comprehension.find({id_User});
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
            comprehensions
        });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({message: 'Error al listar los registros de comprehension', error: error.message});
    }
});

/*SERVICIO PARA CREAR LOS EXPRESSION*/
router.post('/create-expression', async (req, res) => {
    const express = expression(req.body);
    express
        .save()
        .then((data) => {
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
router.get('/list-expression/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const expressions = await expression.find({id_User});
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


/*SERVICIO PARA CREAR COMMUNICATION*/
router.post('/create-communication', async (req, res) => {
    const communi = communication(req.body);
    communi
        .save()
        .then((data) => {
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
router.get('/list-communication/:id_User', async (req, res) => {
    try {
        const {id_User} = req.params;
        if (!id_User) {
            // Si no se proporciona el id_User en la URL, devuelve un error 400
            return res.status(400).json({message: 'Se requiere el parámetro id_User en la URL', state: 0});
        }
        const communications = await communication.find({id_User});
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

module.exports = router;
