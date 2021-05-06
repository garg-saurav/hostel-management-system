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
                return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
            }

            
            res.render('search', {
                pageTitle: 'Search Room',
                path: '/search',
            });
            
        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        }
    } catch (e) {
        throw (e);
    }


};

exports.post_search = async (req, res, next) => {

    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
            }
            const address = req.body.address;
            const check_in_date = req.body.check_in_date;
            const check_out_date = req.body.check_out_date;
            const num_beds = req.body.num_beds;
            const min_rent = req.body.min_rent;
            const max_rent = req.body.max_rent;
            const air_conditioning = req.body.air_conditioning;
            
            if (air_conditioning) {
                AC = 'true';
            }
            else {
                AC = 'false';
            }
            var addr_st = encodeURIComponent(address);
            var check_in_date_st = encodeURIComponent(check_in_date);
            var check_out_date_st = encodeURIComponent(check_out_date);
            var num_beds_st = encodeURIComponent(num_beds);
            var min_rent_st = encodeURIComponent(min_rent);
            var max_rent_st = encodeURIComponent(max_rent);
            var AC_st = encodeURIComponent(AC);
            res.redirect('/customer/search_results/?address=' +addr_st+'&check_in_date='+check_in_date_st+'&check_out_date='+check_out_date_st+'&num_beds='+num_beds_st+'&min_rent='+min_rent_st+'&max_rent='+max_rent_st+'&AC='+AC_st);
            

        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        }
    } catch (e) {
        throw (e);
    }
}