const verify = require('../private/verify');
const Request = require('../models/requests');
const { request } = require('express');

exports.get_hostel_reqdet = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if(decoded){
        var rid = req.query.id;
        if(!rid){
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        req = new Request(rid, null, null, null, null);
        const details = await req.get_all_details();
        const pics = await req.get_photos();
        if(details.rowCount==0){
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        }else{
            if(decoded.role=='regional_manager'){
                res.render('hostel_reqdet', {
                    pageTitle: 'Request Details',
                    path: '/hostel_reqdet',
                    info: details.rows[0],
                    pics: pics.rows,
                });
            }
        }
    }else{
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

exports.post_hostel_reqdet = async (req, res, next) => {
    const decoded = verify.authenticate(req);

    if (decoded) {
        const request_id = req.body.request_id;
        const comment = req.body.comment;
        const approval = req.body.approve_or_reject;
        req = new Request(request_id, null, null, null, comment);
        if (approval=="approve") {
            await req.accept_hostel_request();
        }
        else if (approval=="reject"){
            await req.reject_hostel_request();
        }
        res.redirect('/manager/hostel_requests');
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/owner/login";</script>');
    }
}