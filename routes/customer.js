const express = require('express');

const searchCon = require('../controllers/search');
const searchResultCon = require('../controllers/search_results');
const bookingDetailsCon = require('../controllers/bookingdetails');
const modifyBookingCon = require('../controllers/modify_booking')
const bookCon = require('../controllers/book_room');

const router = express.Router();

router.get('/', searchCon.get_search);
router.post('/', searchCon.post_search);
router.get('/search_results', searchResultCon.get_results);
router.post('/search_results', searchResultCon.post_results);
router.get('/book_room', bookCon.get_book_room);
router.post('/book_room', bookCon.post_book_room);
router.get('/bookingdetails', bookingDetailsCon.get_bookingdetails);
router.post('/bookingdetails/add_rating', bookingDetailsCon.post_add_rating);
router.post('/bookingdetails/add_review', bookingDetailsCon.post_add_review);
router.post('/bookingdetails/modify_booking', bookingDetailsCon.post_modify_booking);
router.post('/bookingdetails/cancel_booking', bookingDetailsCon.post_cancel_booking);
router.get('/bookingdetails/modify_booking_request', modifyBookingCon.get_modify_booking);
router.post('/bookingdetails/post_modify_booking', modifyBookingCon.post_modify_booking);
module.exports = router;