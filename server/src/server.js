// 127.0.0.1:5000/TaskManager.app -> web site
// 127.0.0.1:5000/taskManager/api/ -> api

const { loadEnvFile } = require('node:process');
loadEnvFile('../.env');


const PORT = process.env.API_PORT || 3000;

const express = require("express");

const app = express();

const taskRoutes = require('./modules/task/taskRoutes');

app.use(express.json);
app.use('', taskRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

