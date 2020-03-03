const express = require('express');
const router = express.Router();

// GET - /api/users
// Des - Test route
// Access - Public 
router.get('/', (req, res) => {
    res.json({msg: 'Users Works'})
});

module.exports = router;