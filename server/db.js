
const { loadEnvFile } = require('node:process');
loadEnvFile('.env');

console.log(typeof process.env.DB_PASSWORD);
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

// tests the connection
async function testConnection() {
    try{
        const res = await pool.query("SELECT * FROM tasks");
        console.log(res.rowCount);
        pool.end();
    }catch (e){
        console.error(e);
    }
    
}
testConnection();

module.exports = pool;

