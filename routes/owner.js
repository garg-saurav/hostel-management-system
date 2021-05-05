const express = require('express');

const add_hostel = require('../controllers/add_hostel');
const addRoomCon = require('../controllers/add_room');
const addRoomTypeCon = require('../controllers/add_room_type');

const router = express.Router()

router.get('/add_hostel', add_hostel.get_add_hostel);
router.post('/add_hostel', add_hostel.post_add_hostel);


router.get('/hostel/add_room',addRoomCon.get_add_room);
router.post('/hostel/add_room',addRoomCon.post_add_room);
router.get('/hostel/add_room_type',addRoomTypeCon.get_add_room_type);
router.post('/hostel/add_room_type',addRoomTypeCon.post_add_room_type);

module.exports = router;