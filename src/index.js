const express = require("express");
const mongoose = require("mongoose");
require ("dotenv").config();

require('newrelic')
const fs = require('node:fs');

const userService = require("./services/userService");
const communicationService = require("./services/communicationService");
const comprehensionService = require("./services/comprehensionService");
const expressionService = require("./services/expressionService");
const resourceService = require("./services/resourceService");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 9000;
//cors
app.use(cors());

//middleware
app.use(express.json());

//services
app.use('/api', userService);
app.use('/api', communicationService);
app.use('/api', comprehensionService);
app.use('/api', expressionService);
app.use('/api', resourceService);


//routes
app.get("/",(req, res) => {
    res.send("Bienvenido a la Api de Sofi")
});

// mongodb connect
mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: 'TesisDB',
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error(error));

app.listen(port, () => console.log('Server onfire owo', port));

