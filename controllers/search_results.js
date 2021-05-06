const Customer = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');
const Search = require('../models/search');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_search = async (req, res, next) => {

    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
            }


            res.render('search', {
                pageTitle: 'Search Room',
                path: '/search',
            });

        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
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
                return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
            }

            const building_id = req.body.building_id;
            const rooms_type_id = req.body.rooms_type_id;
            const check_in_date = req.body.check_in_date;
            const check_out_date = req.body.check_out_date;
           
            hostel_search = new Search(address, check_in_date, check_out_date, num_beds, min_rent, max_rent, AC);
            // console.log(hostel_search);
            hostels_res = await hostel_search.get_hostels(); //row= building_id, building_name, addr, rooms_type_id
            // console.log(hostels);
            // res.render('search_result', {
            //     pageTitle: 'Search Result',
            //     path: '/search_result',
            //     hostels: hostels_res.rows,
            //     check_in_date: check_in_date,
            //     check_out_date: check_out_date,
            //     num_hostels: hostels_res.rowCount,
            // });
            // redirect to search_result ka get function with the data

        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
        }
    } catch (e) {
        throw (e);
    }
}