const express = require('express');

const hostelRequests = require('../controllers/hostel_requests');
const hostelReqDet = require('../controllers/hostel_reqdet');
const analyticsCon = require('../controllers/manager_analytics');
const hostelDetails = require('../controllers/hostel_details_manager');

const router = express.Router()


router.get('/hostel_requests',hostelRequests.get_hostel_requests);
router.post('/hostel_requests',hostelRequests.post_hostel_requests);

router.get('/hostel_reqdet',hostelReqDet.get_hostel_reqdet);
router.post('/hostel_reqdet',hostelReqDet.post_hostel_reqdet);

router.get('/analytics', analyticsCon.get_analytics);
router.get('/hostel_details',hostelDetails.get_hostel_details);

module.exports = router;