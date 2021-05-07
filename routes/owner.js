const express = require('express');
const multer = require('multer');

const add_hostel = require('../controllers/add_hostel');
const viewHostelCon = require('../controllers/view_hostel');
const viewRoomType = require('../controllers/view_room_type');
const analyticsCon = require('../controllers/owner_analytics');

//const addRoomTypeCon = require('../controllers/add_room_type');
const path = require('path');
const addRoomTypeCon = require('../controllers/add_room_type');
const viewModifReq = require('../controllers/view_modif_req');

const router = express.Router()

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve('./public/uploads'));
    },
    filename: function(req, file, cb){
        // add timestamp to handle duplicate filenames
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

router.get('/add_hostel', add_hostel.get_add_hostel);

// router.post('/add_hostel', add_hostel.post_add_hostel);

var upload = multer({storage:storage});

router.post('/add_hostel', upload.array('hostelimages'), add_hostel.post_add_hostel);
router.post('/hostel/make_new_rooms_type', viewHostelCon.new_rooms_type);
router.post('/hostel/view_rooms_type', viewHostelCon.view_rooms_type);

router.get('/room_type_details/:building_id/:rooms_type_id', viewRoomType.view_rooms);
router.post('/room_type_details/:building_id/:rooms_type_id', viewRoomType.add_room);
router.post('/hostel/get_add_room_type',addRoomTypeCon.get_add_room_type);
router.post('/hostel/add_room_type',addRoomTypeCon.post_add_room_type);

router.get('/hostel', viewHostelCon.get_view_hostel);
router.get('/analytics', analyticsCon.get_analytics);
router.get('/view_cancel_req', viewModifReq.get_cancel_req);
router.post('/view_cancel_req', viewModifReq.post_cancel_req);
router.get('/view_modif_req', viewModifReq.get_modif_req);
router.post('/view_modif_req', viewModifReq.post_modif_req);

module.exports = router;