// Conmpliet URL:
// 127.0.0.1:5000/taskManager/api/
const PORT = 5000;
const baseURL = "/taskManager/api";
const dbURL = "./dbTasks.json";

// 
const express = require("express");
const fs = require("fs").promises;
const app = express();
app.use(express.json()); 

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
        await fs.writeFile(dbURL, JSON.stringify(objDB, null, 2))
    } catch (e) {
        console.error("Error DB: ", e);
    }
}

async function printDB() {
    console.log(await reqDB());
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
    // read db => obj
    const objDB = await reqDB();

    // add task to the list tasks in obj DB
    task.id = await getNextId();
    objDB.push(task);

    // update db
    await writeDb(objDB);

    // test debug
    //console.log(await reqDB());
}


