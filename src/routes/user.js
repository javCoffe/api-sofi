const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();
// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userSchema.findOne({ email, password });

        if (user) {
            // Usuario encontrado, puedes hacer lo que necesites, como generar un token de autenticación
            const { _id, email } = user;
            res.status(200).json({ message: 'Inicio de sesión exitoso', state: 1, userId: _id });
        } else {
            // Usuario no encontrado o contraseña incorrecta
            res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos', state: 0 });
        }
    } catch (error) {
        // Error al buscar en la base de datos
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

//create user
// create user
// create user
router.post("/users", (req, res) => {
    const user = userSchema(req.body);
    user
      .save()
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
  });


// get all users
// get all users
router.get("/users", (req, res) => {
    userSchema
    .find()
    .then((data) => {
        // Usuarios encontrados exitosamente
        res.status(200).json({ message: 'Usuarios encontrados exitosamente', state: 1, users: data });
    })
    .catch((error) => {
        if (error.name === 'CastError') {
            // Error de solicitud incorrecta (por ejemplo, un ID no válido)
            res.status(400).json({ message: 'Solicitud incorrecta al listar usuarios', state: 0, error: error.message });
        } else {
            // Error interno del servidor
            res.status(500).json({ message: "Error al listar los usuarios", error: error.message });
        }
    });
});

// get a user
// get a user
router.get("/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
    .findById(id)
    .then((data) => {
        if (data) {
            // Usuario encontrado exitosamente
            res.status(200).json({ message: 'Usuario encontrado exitosamente', state: 1, user: data });
        } else {
            // Usuario no encontrado
            res.status(400).json({ message: 'Usuario no encontrado', state: 0 });
        }
    })
    .catch((error) => {
        // Error interno del servidor
        res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
    });
});


// update a user
// update a user
router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const {
        name,
        lastname,
        age,
        email,
        studentCode,
        firstQuestion,
        secondQuestion,
        thirdQuestion,
        password
    } = req.body;

    userSchema
    .updateOne({ _id: id }, {
        $set: {
            name,
            lastname,
            age,
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
            res.status(200).json({ message: 'Usuario actualizado exitosamente', state: 1, user: data });
        } else {
            // Usuario no encontrado o no se ha realizado ninguna modificación
            res.status(400).json({ message: 'Usuario no encontrado o no se ha realizado ninguna modificación', state: 0 });
        }
    })
    .catch((error) => {
        // Error interno del servidor
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    });
});


// delete a user
// delete a user
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    userSchema
    .deleteOne({ _id: id })
    .then((data) => {
        if (data.deletedCount > 0) {
            // Usuario eliminado exitosamente
            res.status(200).json({ message: 'Usuario eliminado exitosamente', state: 1, user: data });
        } else {
            // Usuario no encontrado
            res.status(400).json({ message: 'Usuario no encontrado', state: 0 });
        }
    })
    .catch((error) => {
        // Error interno del servidor
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
    });
});


// Ruta para listar los inicios de sesión de un usuario específico
// Ruta para listar los inicios de sesión de un usuario específico
router.get("/users/:id/logins", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userSchema.findById(id);
        if (!user) {
            // Usuario no encontrado (error 404)
            return res.status(400).json({ message: "Usuario no encontrado", state: 0 });
        }
        // Retorna la lista de inicios de sesión del usuario
        res.status(200).json({ message: "Inicios de sesión del usuario encontrados", state: 1, loginTimestamps: user.loginTimestamps });
    } catch (error) {
        // Error interno del servidor (error 500)
        res.status(500).json({ message: "Error al obtener los inicios de sesión del usuario", error: error.message });
    }
});


// Ruta para solicitar un restablecimiento de contraseña
router.post("/users/reset-password-request", async (req, res) => {
    // Lógica para generar un token único y enviar un correo electrónico al usuario
    // con un enlace que incluye el token
});

// Ruta para restablecer la contraseña utilizando el token
router.get("/users/reset-password/:token", async (req, res) => {
    // Lógica para verificar y utilizar el token para restablecer la contraseña
});

//aaaaaa kakaroto ven y sana mi dolooooooooooooooooor
const Event = require("../models/event"); // Importa el modelo de evento

// Ruta para listar todos los eventos
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener un evento específico por ID de mmwbo del usuario
router.get("/events/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sección para los Recursos de Sofía

const Resource = require("../models/resource"); // Asegúrate de importar el modelo Resource correctamente

// Ruta para crear un nuevo recurso
// Ruta para crear un nuevo recurso
router.post("/resources", async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { name, path, category, icon } = req.body;

        // Validar los datos antes de crear el recurso (por ejemplo, asegurarse de que todos los campos requeridos estén presentes)

        if (!name || !path || !category || !icon) {
            // Datos de solicitud incompletos (error 400)
            return res.status(400).json({ message: "Datos de solicitud incompletos", state: 0 });
        }

        // Crear una nueva instancia del modelo Resource
        const newResource = new Resource({ name, path, category, icon });

        // Guardar el nuevo recurso en la base de datos
        const savedResource = await newResource.save();

        // Devolver el recurso creado como respuesta (error 201)
        res.status(200).json({ message: "Recurso creado exitosamente", state: 1, resource: savedResource });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({ message: "Error al crear el recurso", error: error.message });
    }
});


// Ruta para listar todos los recursos
// Ruta para listar todos los recursos
router.get("/resources", async (req, res) => {
    try {
        const resources = await Resource.find();

        if (resources.length === 0) {
            // No se encontraron recursos (error 404)
            return res.status(400).json({ message: "No se encontraron recursos", state: 0 });
        }

        // Recursos encontrados con éxito (error 200)
        res.status(200).json({ message: "Recursos encontrados exitosamente", state: 1, resources });
    } catch (error) {
        // Error interno del servidor (error 500)
        res.status(500).json({ message: "Error al listar los recursos", error: error.message });
    }
});



// Ruta para obtener recursos por categoría
// Ruta para obtener recursos por categoría
// Ruta para listar recursos por categoría
app.get('/resources/:category', (req, res) => {
    const { category } = req.params;
    
    try {
        // Filtra los recursos por la categoría especificada
        const filteredResources = resourcesData.filter(resource => resource.category === category);
        
        if (filteredResources.length === 0) {
            // No se encontraron recursos para la categoría especificada (error 400)
            return res.status(400).json({ message: "No se encontraron recursos para la categoría especificada", state: 0 });
        }
        
        // Recursos encontrados con éxito (error 200)
        res.status(200).json({ message: "Recursos encontrados exitosamente", state: 1, resources: filteredResources });
    } catch (error) {
        // Error interno del servidor (error 500)
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
});



module.exports = router;