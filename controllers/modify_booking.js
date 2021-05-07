const verify = require('../private/verify');
const Booking = require('../models/booking');
const Building = require('../models/building');

exports.get_modify_booking = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        // console.log(decoded.email);
        var bookingid = req.query.id;
        var has_started = req.query.started
        if (has_started == 'false') {
            started = false
        }
        else {
            started = true;
        }
        // console.log(has_started);
        if (!bookingid) {
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        booking = new Booking(bookingid);
        const cust_email = await booking.get_customer_email();
        if (cust_email.rowCount == 0 || cust_email.rows[0].email_id != decoded.email) {
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        const details = await booking.get_all_details();
        
        if (details.rowCount == 0) {
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            building = new Building(details.rows[0].building_id);
            const services = await building.get_services();
            if (decoded.role == 'customer') {
                res.render('modify_booking', {
                    pageTitle: 'Modify Booking',
                    path: '/modify_booking_request',
                    info: details.rows[0],
                    services: services.rows,
                    num_services: services.rowCount,
                    has_started: started,
                });
            }
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};


exports.post_modify_booking = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        const booking_id = req.body.booking_id;
        const has_started = req.body.has_started;
        const check_in_date = req.body.check_in_date;
        if (has_started=='true') {
            const details = await booking.get_booking_details();
            starting_date = details.rows[0].start_date;
            // console.log(starting_date);
        }
        else {
            starting_date = check_in_date;
        }
        const chect_out_date = req.body.check_out_date;
        const services = req.body.services;
        
        ser = services;
        if (!Array.isArray(services)) {
            ser = [].concat(services);
        }
        // console.log(ser);
        booking = new Booking(booking_id);
        await booking.enter_modification_request(starting_date, chect_out_date, ser);
        return res.send('<script>alert("Modification request sent!"); window.location.href = "/profile";</script>');
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}