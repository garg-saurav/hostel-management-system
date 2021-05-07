const express = require('express');
const userRo = require('./user');
const custRo = require('./customer');
const ownerRo = require('./owner');
const managerRo = require('./manager');

const router = express.Router();

router.use('/', userRo);
router.use('/customer', custRo);
router.use('/owner', ownerRo);
router.use('/manager', managerRo);

module.exports = router;