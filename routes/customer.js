const express = require('express');

const viewRoomType = require('../controllers/view_room_type');
const searchCon = require('../controllers/search');
const searchResultCon = require('../controllers/search_results');
const bookingDetailsCon = require('../controllers/bookingdetails');

const router = express.Router();

router.get('/:building_id/:rooms_type_id', viewRoomType.view_rooms);
router.get('/', searchCon.get_search);
router.post('/', searchCon.post_search);
// router.get('/search_results', searchResultCon.get_results);
router.post('/search_results', searchResultCon.post_results);
router.get('/bookingdetails', bookingDetailsCon.get_bookingdetails);

module.exports = router;