const verify = require('../private/verify');
const Building = require('../models/building');
const Manager = require('../models/manager');
const Analytics = require('../models/analytics');

exports.get_analytics = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded && decoded.role=='regional_manager') {
        manager_email = decoded.email;
        manager = new Manager(null, manager_email, null, null, null, null);
        const res = await manager.find_user();
        details = res.rows[0];
        analytics = new Analytics(details.person_id);
        num_hostel_data = await analytics.get_manager_hostels(details.city);
        num_booking_data = await analytics.get_manager_bookings(details.city);
        num_cancellation_data = await analytics.get_manager_cancellation(details.city);
        console.log(num_hostel_data.rows[0].num_hostels);
        console.log(num_booking_data.rows);
        console.log(num_cancellation_data.rows);

        // res.render('manager_analytics', {
        //     pageTitle: 'Analytics',
        //     path: '/analytics',
        //     num_hostels: num_hostel_data.rows[0].num_hostels,
        //     num_booking_data: num_booking_data.rows,
        //     num_cancellation_data: num_cancellation_data.rows,
        // });
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

