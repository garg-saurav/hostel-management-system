const Hostel = require('../models/hostel');
const Person = require('../models/person');
const Request = require('../models/requests');
const verify = require('../private/verify');

exports.get_hostel_requests = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
            requests = new Request(null, decoded.email, null, null, null);
            const rqs = await requests.view_hostel_requests();
            res.render('hostel_requests', {
                pageTitle: 'Hostel Requests',
                path: 'manager/hostel_requests',
                requests: rqs.rows,
                num_requests: rqs.rowCount
            });
    } else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.post_hostel_requests = async (req, res, next) => {
    
    const decoded = verify.authenticate(req);

    if (decoded) {
        var string = encodeURIComponent(req.body.request_id);
        res.redirect('/manager/hostel_reqdet/?id='+string);
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}