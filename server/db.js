/**
 *  This will contain:
 *   - The pool connection with the DataBase -> TaskDB
 *   - Config info using the .env file
 *   - Them export the pool
 */

// load .env file
const { loadEnvFile } = require('node:process');
loadEnvFile('../.env');

const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('error', (error) => {
    console.error("Error while to connecting DB: ", error);
});

pool.on('connect', (client) => {
    console.log("DB connected successfuly..");
    console.log("DB -> On");
});

// test the connection
async function testConnection() {
    try{
        const res = await pool.query("SELECT * FROM tasks");
        console.log(res.rowCount);
        pool.end();
    }catch (e){
        console.error(e);
    }
    
}
//testConnection();


// Export Pool
module.exports = pool;
