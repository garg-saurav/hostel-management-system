const verify = require('../private/verify');
const Building = require('../models/building');
const Manager = require('../models/manager');
const Analytics = require('../models/analytics');

exports.get_analytics = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded && decoded.role=='regional_manager') {
        manager_email = decoded.email;
        manager = new Manager(null, manager_email, null, null, null, null);
        const result = await manager.find_user();
        details = result.rows[0];
        analytics = new Analytics(details.person_id);
        num_hostel_data = await analytics.get_manager_hostels(details.city);
        num_booking_res = (await analytics.get_manager_bookings(details.city)).rows;
        num_booking_data = [];
        for (const item in num_booking_res) {
            num_booking_data.push([num_booking_res[item].year, num_booking_res[item].num_bookings])
        }

        num_cancellation_res = (await analytics.get_manager_cancellation(details.city)).rows;
        num_cancellation_data = [];
        for (const item in num_cancellation_res) {
            num_cancellation_data.push([num_cancellation_res[item].year, num_cancellation_res[item].num_cancel])
        }
        
        var d = new Date;
        var year = d.getFullYear();
        res.render('manager_analytics', {
            pageTitle: 'Analytics',
            path: '/analytics',
            cur_year: year,
            num_hostels: num_hostel_data.rows[0].num_hostels,
            num_booking_data: JSON.stringify(num_booking_data),
            num_cancellation_data: JSON.stringify(num_cancellation_data),
        });
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

