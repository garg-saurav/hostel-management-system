const Customer = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');
const Search = require('../models/search');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_results = async (req, res, next) => {

    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
            }
            var address = req.query.address;
            var check_in_date = req.query.check_in_date;
            var check_out_date = req.query.check_out_date;
            var num_beds = req.query.num_beds;
            var min_rent = req.query.min_rent;
            var max_rent = req.query.max_rent;
            var AC = req.query.AC;
            if (!address || !check_in_date || !check_out_date || !num_beds || !min_rent || !max_rent || !AC) {
                return res.send('<script>alert("Details not found"); window.location.href = "/customer";</script>');
            }
            hostel_search = new Search(address, check_in_date, check_out_date, num_beds, min_rent, max_rent, AC);
            hostels_res = await hostel_search.get_hostels(); //row= building_id, building_name, addr, rooms_type_id, num_rooms, additional_info

            res.render('search_result', {
                pageTitle: 'Search Result',
                path: '/search_result',
                hostels: hostels_res.rows,
                num_hostels: hostels_res.rowCount,
                check_in_date: check_in_date,
                check_out_date: check_out_date,
            });

        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        }
    } catch (e) {
        throw (e);
    }


};

exports.post_results = async (req, res, next) => {

    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
            }

            const building_id = encodeURIComponent(req.body.building_id);
            const rooms_type_id = encodeURIComponent(req.body.rooms_type_id);
            const check_in_date = encodeURIComponent(req.body.check_in_date);
            const check_out_date = encodeURIComponent(req.body.check_out_date);
            res.redirect('/customer/book_room/?building_id=' + building_id + '&rooms_type_id=' + rooms_type_id + '&check_in_date=' + check_in_date + '&check_out_date=' + check_out_date);
        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        }
    } catch (e) {
        throw (e);
    }
}