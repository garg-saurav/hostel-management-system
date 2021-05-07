const verify = require('../private/verify');
const Request = require('../models/requests');

exports.get_cancel_req = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        var email_id = req.query.email_id;
        request = new Request(null, email_id, null, null, null);
        const requ = await request.view_cancel_requests();
        if (requ.rowCount == 0) {
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            if (decoded.role == 'hostel_owner') {
                res.render('view_cancel_req', {
                    pageTitle: 'Cancellation Requests',
                    path: '/view_cancel_req',
                    num_requests: requ.rowCount,
                    requests: requ.rows
                });
            }
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.post_cancel_req = async (req, res, next) => {
    const decoded = verify.authenticate(req);

    if (decoded) {
        const request_id = req.body.request_id;
        const comment = req.body.comment;
        const approval = req.body.approve_or_reject;
        requ = new Request(request_id, null, null, null, comment);
        if (approval=="approve") {
            await requ.accept_cancel_request();
        }
        else if (approval=="reject"){
            await requ.reject_cancel_request();
        }
        res.redirect('/profile');
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/owner/login";</script>');
    }
}

exports.get_modif_req = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        var email_id = req.query.email_id;
        request = new Request(null, email_id, null, null, null);
        const requ = await request.view_modif_requests();
        if (requ.rowCount == 0) {
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            if (decoded.role == 'hostel_owner') {
                res.render('view_modif_req', {
                    pageTitle: 'Modification Requests',
                    path: '/view_modif_req',
                    num_requests: requ.rowCount,
                    requests: requ.rows
                });
            }
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.post_modif_req = async (req, res, next) => {
    const decoded = verify.authenticate(req);

    if (decoded) {
        const request_id = req.body.request_id;
        const comment = req.body.comment;
        const approval = req.body.approve_or_reject;
        requ = new Request(request_id, null, null, null, comment);
        if (approval=="approve") {
            await requ.accept_modif_request();
        }
        else if (approval=="reject"){
            await requ.reject_modif_request();
        }
        res.redirect('/profile');
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/owner/login";</script>');
    }
}