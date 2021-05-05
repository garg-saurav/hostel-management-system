const Hostel = require('../models/hostel');
const Person = require('../models/person');
const verify = require('../private/verify');

exports.get_add_hostel = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
        person = new Person(decoded.email);
        const user = await person.get_user();
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/user/login";</script>');
        } else {
            res.render('add_hostel', {
                pageTitle: 'Add Hostel',
                path: '/owner/add_hostel',
                services: []
            });
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
    }
}

exports.post_add_hostel = async (req, res, next) => {
    const name = req.body.name;
    const city = req.body.city;
    const addr = req.body.address;
    const additional = req.body.additional;
    const services = req.body.services;
    const photos = req.body.photos;

    const decoded = verify.authenticate(req)

    if (decoded) {
        const person = new Person(decoded.email);
        const user = await person.get_user();
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/user/login";</script>');
        } else {
            const hostel = new Hostel(name, city, user.rows[0].id, addr, additional, services, photos);
            await hostel.add_hostel_request();
            res.redirect('/owner/profile');
            // TODO - redirect to /owner/hostel_request
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/owner/login";</script>');
    }
}