const express = require('express');

const hostelMng = require('../controllers/hostel_managed');
const hostelReq = require('../controllers/hostel_requests');

const router = express.Router()

router.get('/hostel_managed', hostelMng.get_hostel_managed);

router.get('/hostel_requests',hostelReq.get_hostel_requests);
router.post('/hostel_requests',hostelReq.post_hostel_requests);

module.exports = router;