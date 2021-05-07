const express = require('express');

const loginCon = require('../controllers/login');
const signupCon = require('../controllers/signup');
const profileCon = require('../controllers/profile');

const router = express.Router();


router.get('/login',loginCon.get_login);
router.post('/login',loginCon.post_auth);
router.get('/signup',signupCon.get_signup);
router.post('/signup',signupCon.post_reguser);
router.get('/profile',profileCon.get_profile);
router.post('/profile',profileCon.post_booking);
router.post('/reguser',signupCon.post_reg_as_other_type);
router.post('/logout', loginCon.post_logout);
router.post('/analytics', profileCon.post_analytics);

module.exports = router;