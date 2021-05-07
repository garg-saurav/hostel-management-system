const express = require('express');

const add_hostel = require('../controllers/add_hostel');
const addRoomCon = require('../controllers/add_room');
const viewHostelCon = require('../controllers/view_hostel');
//const addRoomTypeCon = require('../controllers/add_room_type');

const router = express.Router()

router.get('/add_hostel', add_hostel.get_add_hostel);
router.post('/add_hostel', add_hostel.post_add_hostel);


router.get('/hostel/add_room',addRoomCon.get_add_room);
router.post('/hostel/add_room',addRoomCon.post_add_room);
//router.get('/hostel/add_room_type',addRoomTypeCon.get_add_room_type);
//router.post('/hostel/add_room_type',addRoomTypeCon.post_add_room_type);

router.post('/hostel/make_new_rooms_type', viewHostelCon.new_rooms_type);
router.post('/hostel/view_rooms_type', viewHostelCon.view_rooms_type);

router.get('/hostel', viewHostelCon.get_view_hostel);


module.exports = router;