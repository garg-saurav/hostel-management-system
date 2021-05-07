const Hostel = require('../models/hostel');
const Person = require('../models/person');
const Manager = require('../models/manager');
const verify = require('../private/verify');

exports.get_add_hostel = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
        person = new Person(decoded.email);
        const user = await person.get_user();
        const cities = (await (new Manager(null, null, null, null, null, null)).get_cities()).rows.map(e => e.city);
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            res.render('add_hostel', {
                pageTitle: 'Add Hostel',
                cities: cities
            });
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.post_add_hostel = async (req, res, next) => {
    const name = req.body.name;
    const city = req.body.city;
    const addr = req.body.address;
    const additional = req.body.additional;
    const services = JSON.parse(req.body.servicenames);
    const images = req.files.map(e => e.path);
    const decoded = verify.authenticate(req);

    if (decoded) {
        const person = new Person(decoded.email);
        const user = await person.get_user();
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            const hostel = new Hostel(null, name, city, user.rows[0].id, addr, additional, services, images);
            await hostel.add_hostel_request();
            res.redirect('/profile');
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}