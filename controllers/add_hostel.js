const Owner = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_add_hostel = async (req, res, next) => {
    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
            }
            person = new Person(decoded.email);
            const user = await person.get_user();
            if (user.rowCount == 0) {
                return res.send('<script>alert("Details not found"); window.location.href = "/user/login";</script>');
            } else {
                res.render('add_hostel', {
                    pageTitle: 'Add Hostel',
                    path: '/owner/add_hostel',
                    services: []
                });
            }
        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
        }
    } catch (e) {
        throw (e);
    }

}

exports.post_add_hostel = async (req, res, next) => {
    const name = req.body.name;
    const city = req.body.city;
    const services = req.body.services;
}