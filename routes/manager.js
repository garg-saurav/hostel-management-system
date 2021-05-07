const express = require('express');

const hostelRequests = require('../controllers/hostel_requests');
const hostelReqDet = require('../controllers/hostel_reqdet');

const router = express.Router()


router.get('/hostel_requests',hostelRequests.get_hostel_requests);
router.post('/hostel_requests',hostelRequests.post_hostel_requests);

router.get('/hostel_reqdet',hostelReqDet.get_hostel_reqdet);
router.post('/hostel_reqdet',hostelReqDet.post_hostel_reqdet);

module.exports = router;