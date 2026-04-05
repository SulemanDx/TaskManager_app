// 127.0.0.1:5000/TaskManager.app -> web site
// 127.0.0.1:5000/taskManager/api/ -> api

const { loadEnvFile } = require('node:process');
loadEnvFile('../.env');

const PORT = process.env.API_PORT || 3000;

const express = require("express");
const app = express();

app.use(express.json());

// Tasks Endpoints
const taskRoutes = require('./modules/task/taskRoutes');
app.use(process.env.API_URL, taskRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

