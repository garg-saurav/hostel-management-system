const path = require('path');
const express = require('express');

const searchCon = require('../controllers/search');

const router = express.Router();

router.get('/', searchCon.get_search);
router.post('/', searchCon.post_search);

module.exports = router;