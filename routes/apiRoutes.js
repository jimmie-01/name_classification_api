const express = require('express')
const router = express.Router();
const Controller = require('../controller/apiController');

router.get('/api/profiles', Controller.get_all);
router.post('/api/profiles', Controller.post_one);
router.get('/api/profiles/:id', Controller.get_one);
router.delete('/api/profile/:id', Controller.delete_one);

module.exports = router;