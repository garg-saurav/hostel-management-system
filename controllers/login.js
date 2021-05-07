const Customer = require('../models/customer');
const Owner = require('../models/owner');
const Manager = require('../models/manager');
const Keys = require('../private/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_login = (req, res, next) => {

    res.render('login', {
        pageTitle: 'User Login',
        path: '/login'
    });


};

exports.post_auth = async (req, res, next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    const role = req.body.role;

    try {
        if (role == "customer") {
            customer = new Customer(null, email, null, null, null, passwd);
            const user = await customer.find_user();
            if (user.rowCount == 0) {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            } else if (await bcrypt.compare(passwd, user.rows[0].passwd)) {
                const token = jwt.sign({ email: email, role: role }, JWT_SECRET);
                req.session.jwtoken = token;
                res.redirect('/profile');
            } else {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            }
        } else if (role=="hostel_owner"){
            owner = new Owner(null, email, null, null, null, passwd);
            const user = await owner.find_user();
            if (user.rowCount == 0) {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            } else if (await bcrypt.compare(passwd, user.rows[0].passwd)) {
                const token = jwt.sign({ email: email, role: role }, JWT_SECRET);
                req.session.jwtoken = token;
                res.redirect('/profile');
            } else {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            }
        } else if (role=="regional_manager"){
            manager = new Manager(null, email, null, null, null, passwd);
            const user = await manager.find_user();
            if (user.rowCount == 0) {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            } else if (await bcrypt.compare(passwd, user.rows[0].passwd)) {
                const token = jwt.sign({ email: email, role: role }, JWT_SECRET);
                req.session.jwtoken = token;
                res.redirect('/profile');
            } else {
                res.send('<script>alert("Invalid username/password"); window.location.href = "/login";</script>');
            }
        } else {
            // can't reach here
        }
    } catch (e) {
        throw e;
    }
}

exports.post_logout = (req, res, next) => {

    try {
        req.session.destroy();
        res.send('<script>alert("Logged out!"); window.location.href = "/login";</script>');
    } catch (e) {
        throw e;
    }
}