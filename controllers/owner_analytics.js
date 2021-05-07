const verify = require('../private/verify');
const Building = require('../models/building');
const Owner = require('../models/owner');
const Analytics = require('../models/analytics');

exports.get_analytics = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded && decoded.role == 'hostel_owner') {
        owner_email = decoded.email;
        owner = new Owner(null, owner_email, null, null, null, null);
        const res = await owner.find_user();
        details = res.rows[0];
        analytics = new Analytics(details.person_id);
        num_booking_data = await analytics.get_owner_bookings();
        num_cancellation_data = await analytics.get_owner_cancellation();
        num_good_ratings_data = await analytics.get_owner_good_ratings();
        // console.log(num_cancellation_data.rows);

        // res.render('owner_analytics', {
        //     pageTitle: 'Analytics',
        //     path: '/analytics',
        //     details: details,
        //     num_booking_data: num_booking_data.rows,
        //     num_cancellation_data: num_cancellation_data.rows,
        //     num_good_ratings_data: num_good_ratings_data.rows,
        // });
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

