const verify = require('../private/verify');
const Building = require('../models/building');
const Owner = require('../models/owner');
const Analytics = require('../models/analytics');
const { json } = require('body-parser');

exports.get_analytics = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded && decoded.role == 'hostel_owner') {
        owner_email = decoded.email;
        owner = new Owner(null, owner_email, null, null, null, null);
        const result = await owner.find_user();
        details = result.rows[0];
        analytics = new Analytics(details.person_id);
        num_booking_res = (await analytics.get_owner_bookings()).rows;
        num_booking_data = [];
        for (const item in num_booking_res) {
            num_booking_data.push([num_booking_res[item].year, num_booking_res[item].num_bookings])
        }

        num_cancellation_res = (await analytics.get_owner_cancellation()).rows;
        num_cancellation_data = [];
        for (const item in num_cancellation_res) {
            num_cancellation_data.push([num_cancellation_res[item].year, num_cancellation_res[item].num_cancel])
        }
        num_good_ratings_res = (await analytics.get_owner_good_ratings()).rows;
        num_good_ratings_data = [];
        for (const item in num_good_ratings_res) {
            num_good_ratings_data.push([num_good_ratings_res[item].year, num_good_ratings_res[item].num_ratings])
        }
        
        // console.log(num_cancellation_data.rows);
        var d = new Date;
        var year = d.getFullYear();
        res.render('owner_analytics', {
            pageTitle: 'Analytics',
            path: '/analytics',
            details: details,
            cur_year: year,
            num_booking_data: JSON.stringify( num_booking_data),
            num_cancellation_data: JSON.stringify(num_cancellation_data),
            num_good_ratings_data: JSON.stringify(num_good_ratings_data),
        });
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

