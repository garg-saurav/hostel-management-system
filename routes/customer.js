const express = require('express');

const viewRoom = require('../controllers/view_room');
const searchCon = require('../controllers/search');
const searchResultCon = require('../controllers/search_results');

const router = express.Router();

router.get('/view_room', viewRoom.view_rooms);
router.get('/', searchCon.get_search);
router.post('/', searchCon.post_search);
router.get('/search_results', searchResultCon.get_results);
router.post('/search_results', searchResultCon.post_results);

module.exports = router;