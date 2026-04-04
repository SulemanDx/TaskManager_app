
// const router = require('express').Router;
const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    console.log("Rescived req..");
    res.send("Res from API");
});



module.exports = router;
