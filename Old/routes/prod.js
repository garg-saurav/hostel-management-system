const path = require('path');
const express = require('express');

const prodCon = require('../controllers/prod');

const router = express.Router();


router.get('/',prodCon.get_prod);
// router.post('/add-product',adminCon.post_test);



module.exports = router;
