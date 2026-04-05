console.log("Routs loaded..");



const taskCostroller = require('./TaskCostroller');

// const router = require('express').Router;
const { Router } = require('express');
const router = Router();

router.get('/', taskCostroller.getAllTasks);

module.exports = router;
