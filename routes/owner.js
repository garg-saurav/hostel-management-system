const express = require('express');

const add_hostel = require('../controllers/add_hostel');

const router = express.Router()

router.get('/add_hostel', add_hostel.get_add_hostel);
router.post('/add_hostel', add_hostel.post_add_hostel);

module.exports = router;