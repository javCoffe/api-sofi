const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();
// user - passs
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            // Usuario encontrado, puedes hacer lo que necesites, como generar un token de autenticación
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            // Usuario no encontrado o contraseña incorrecta
            res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }
    } catch (error) {
        // Error al buscar en la base de datos
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

//create user
router.post("/users", (req, res) => {
    const user = userSchema(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch(() => res.json({ message: error}));
});
// get all users
router.get("/users", (req, res) => {
    userSchema
    .find()
    .then((data) => res.json(data))
    .catch(() => res.json({ message: error}));
});

// get a user
router.get("/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch(() => res.json({ message: error}));
});

// update a user
router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name,
        lastname,
        age,
        email,
        studentCode,
        firstQuestion,
        secondQuestion,
        thirdQuestion } = req.body;
    userSchema
    .updateOne({ _id: id }, { $set: {name,
        lastname,
        age,
        email,
        studentCode,
        firstQuestion,
        secondQuestion,
        thirdQuestion} })
    .then((data) => res.json(data))
    .catch(() => res.json({ message: error}));
});

// delete a user
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch(() => res.json({ message: error}));
});

// Ruta para listar los inicios de sesión de un usuario específico
router.get("/users/:id/logins", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Retorna la lista de inicios de sesión del usuario
        res.json(user.loginTimestamps);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const Resource = require("../models/resource"); // Importa el modelo de recurso

// Ruta para listar todos los recursos
router.get("/resources", async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener un recurso específico por ID
router.get("/resources/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ message: "Recurso no encontrado" });
        }
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;