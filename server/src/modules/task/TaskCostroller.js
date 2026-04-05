/**
 *  This will contain:
 *   - All the logic of an Endpoint 
 *   - Then exports
 */

console.log("Controller loaded..");

// Dependensis
const pool = require('../../../db');
const dbQuerys = require('./taskQuerys');

const getAllTasks = async (req, res) => {
    console.log("Rescived GetAllTasks req..");
    const tasks = await pool.query(dbQuerys.querySelectAllTasks);
    console.log("Sending..  res. ok 200");
    res.status(200).json(tasks.rows);
}

module.exports = {
    getAllTasks
}