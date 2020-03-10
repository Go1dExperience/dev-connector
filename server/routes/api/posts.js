const express = require('express');
const router = express.Router();

// GET - /api/posts
// Des - Test route
// Access - Public 
router.get('/', (req, res) => {
    res.json({msg: 'Posts Works'})
});


module.exports = router;