
const PORT = 5000;
const baseURL = "/taskManager/api";
const dbURL = "./dbTasks.json";
// 127.0.0.1:5000/taskManager/api/

const express = require("express");
const cors = require("cors");

const fs = require("fs").promises;
const app = express();
app.use(express.json()); 
app.use(cors()); // Abilita CORS per tutte le richieste

 

// Req. DB TaskManager
async function reqDB() {
    try{
        const dbJson = await fs.readFile(dbURL, "utf-8");
        const objDB = JSON.parse(dbJson);
        return objDB;
    }catch(e){
        console.error("Error DB: ", e);
        return [];
    }
}

// Write DB TaskManager with new task(obj)
async function writeDb(objDB) {
    try {
        await fs.writeFile(dbURL, JSON.stringify(objDB, null, 2));
    } catch (e) {
        console.error("Error DB: ", e);
    }
}

// Funzione per calcolare l'ID (più sicura della lunghezza)
async function getNextId() {
    const objDB = await reqDB();
    if (objDB.length === 0) return 1;
    
    // Trova l'ID più alto tra i task esistenti
    const maxId = Math.max(...objDB.map(t => t.id));
    return maxId + 1;
}

// add new task to the db
async function addTask(task) {
    try{
        // read db => obj   
        const objDB = await reqDB();

        // add task to the list tasks in obj DB
        task.id = await getNextId();
        objDB.push(task);

        // update db
        await writeDb(objDB);
        return 0;
        // test debug
        //console.log(await reqDB());
    }catch(e){
        return 1;
    }
    
}

// GET endpoint to retrieve all tasks
app.get(`${baseURL}/tasks`, async (req, res) => {
    console.log("Received request for all tasks.");
    const tasks = await reqDB();
    console.log("Sending db: ", tasks);
    res.status(200).json(tasks);
});

// API endpoint to add a new task
app.post(`${baseURL}/addTask`, async (req, res) => {
    const reqTask = req.body;
    console.log("Received task:", reqTask);
    // Validation
    
    console.log("Task is valid.");
    // add task
    let newTask = {
        id: await getNextId(),
        taskName: reqTask.taskName,
        isChecked: reqTask.isChecked
    };

    if (await addTask(newTask) === 1){
        return res.status(500).json({ error: "Failed to add task to db" });
    }

    console.log("Task added successfully with ID:", newTask.id);

    // send response
    console.log("Sending response with task:", newTask);
    res.status(201).json(newTask);
});

// API endpoint to modify a task
app.put(`${baseURL}/editTask`, async (req, res) => {
    const reqTask = req.body;
    console.log("Received a task to modify in db", reqTask);
    
    // Recupero i task attuali
    const dbTasks = await reqDB();

    // 1. Trovo l'INDICE del task da modificare
    const taskIndex = dbTasks.findIndex(task => task.id === reqTask.id);

    // Se l'indice è -1, significa che il task non esiste
    if (taskIndex === -1) {
        return res.status(404).json({error:"Task not found"});
    }

    // 2. Aggiorno il task REALE dentro l'array
    // Usa lo spread operator per unire i vecchi dati con i nuovi
    dbTasks[taskIndex] = { ...dbTasks[taskIndex], ...reqTask };

    // 3. Salvo il file in modo sincrono gestendo l'errore con try...catch
    try {
        // Aggiungo null e 2 per formattare il file JSON in modo leggibile
        writeDb(dbTasks);
        
        // 4. Rispondo con successo e interrompo l'esecuzione
        return res.status(200).json(dbTasks[taskIndex]);
        
    } catch (err) {
        console.error("Error writing to db:", err);
        return res.status(500).send("Errore durante il salvataggio sul database");
    }
});

// API endpoint to delete a task by ID
app.delete(`${baseURL}/deleteTask/:id`, async (req, res) => {
    const taskId = parseInt(req.params.id);
    console.log("Received request to delete task with ID:", taskId);

    // vlaidation
    if (isNaN(taskId) || (taskId <= 0 && taskId > await getNextId())) {
        console.error("Validation failed: Invalid task ID.");
        return res.status(400).send({ error: "Invalid task ID" });
    }
    
    let dbtasks = await reqDB();
    const taskIndex = dbtasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        console.error("Task not found with ID:", taskId);
        return res.status(404).send({ error: "Task not found" });
    }

    // Remove the task from the array
    dbtasks.splice(taskIndex, 1);

    // Write the updated array back to the file
    try{
        await writeDb(dbtasks);
    }catch(e){
        console.error("Error writing to db:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }

    console.log("Task deleted successfully with ID:", taskId);
    res.status(200).send({ message: "Task deleted successfully" });

});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

