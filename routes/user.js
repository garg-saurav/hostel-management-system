const path = require('path');
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

module.exports = router;