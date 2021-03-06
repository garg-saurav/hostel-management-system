const Customer = require('../models/customer');
const Owner = require('../models/owner');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');
const verify = require('../private/verify');
const Manager = require('../models/manager');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_profile = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        person = new Person(decoded.email);
        const user = await person.get_user();
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            if (decoded.role == 'customer') {
                customer = new Customer(null, user.rows[0].email_id, null, null, null, null);
                const user_bookings = await customer.get_bookings();
                const is_an_owner = await customer.is_an_owner();
                res.render('userprofile', {
                    pageTitle: 'Profile',
                    path: '/profile',
                    name: user.rows[0].name,
                    email_id: user.rows[0].email_id,
                    dob: user.rows[0].dob,
                    phone_no: user.rows[0].phone_number,
                    addr: user.rows[0].addr,
                    bookings: user_bookings.rows,
                    numbookings: user_bookings.rowCount,
                    has_ended: user_bookings.has_ended,
                    has_started: user_bookings.has_started,
                    has_other_role: is_an_owner.rowCount>0,
                });
            }else if(decoded.role == 'hostel_owner'){
                owner = new Owner(null, user.rows[0].email_id, null, null, null, null);
                const is_a_customer = await owner.is_a_customer();
                const hostels = await owner.get_hostels_owned();
                res.render('ownerprofile', {
                    pageTitle: 'Profile',
                    path: '/profile',
                    name: user.rows[0].name,
                    email_id: user.rows[0].email_id,
                    dob: user.rows[0].dob,
                    phone_no: user.rows[0].phone_number,
                    addr: user.rows[0].addr,
                    has_other_role: is_a_customer.rowCount > 0,
                    hostels: hostels.rows,
                    num_hostels: hostels.rowCount,
                });
            }else if(decoded.role == 'regional_manager'){
                manager = new Manager(null, user.rows[0].email_id, null, null, null, null);
                const is_a_customer = await manager.is_a_customer();
                const hostels = await manager.view_hostel_managed();
                res.render('managerprofile', {
                    pageTitle: 'Profile',
                    path: '/profile',
                    name: user.rows[0].name,
                    email_id: user.rows[0].email_id,
                    dob: user.rows[0].dob,
                    phone_no: user.rows[0].phone_number,
                    addr: user.rows[0].addr,
                    has_other_role: is_a_customer.rowCount>0,
                    hostels: hostels.rows,
                    num_hostels: hostels.rowCount
                    // bookings: user_bookings.rows,
                //     numbookings: user_bookings.rowCount,
                //     has_ended: user_bookings.has_ended,
                //     has_started: user_bookings.has_started,
                });
            }else{
                // can't reach here
            }
        }
    } else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

exports.post_booking = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        if (decoded.role == 'customer') {
            var string = encodeURIComponent(req.body.booking_id);
            res.redirect('/customer/bookingdetails/?id=' + string);
        }
        else if (decoded.role == 'hostel_owner') {
            var string = encodeURIComponent(req.body.building_id);
            res.redirect('/owner/hostel/?id=' + string);
        }
        else if (decoded.role == 'regional_manager') {
            var string = encodeURIComponent(req.body.building_id);
            res.redirect('/manager/hostel_details/?id=' + string);
        }
        else{
            
        }
    }else{
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.post_analytics = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        if (decoded.role == 'hostel_owner') {
            res.redirect('/owner/analytics');
        }
        else if (decoded.role == 'regional_manager') {
            res.redirect('/manager/analytics');
        }
        else {
            //should not come here
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}