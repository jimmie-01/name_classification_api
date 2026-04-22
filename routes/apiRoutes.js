const express = require('express')
const router = express.Router();
const Controller = require('../controller/apiController');

router.get('/profiles', Controller.get_all);
router.post('/profiles', Controller.post_one);
router.get('/profiles/:id', Controller.get_one);
router.delete('/profile/:id', Controller.delete_one);

module.exports = router;