const verify = require('../private/verify');
const Booking = require('../models/booking');

exports.get_bookingdetails = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if(decoded){
        var bookingid = req.query.id;
        if(!bookingid){
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        booking = new Booking(bookingid);
        const cust_email = await booking.get_customer_email();
        if(cust_email.rowCount==0 || cust_email.rows[0].email_id!=decoded.email){
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        const details = await booking.get_all_details();
        const pics = await booking.get_photos();
        if(details.rowCount==0){
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        }else{
            if(decoded.role=='customer'){
                res.render('bookingdetails', {
                    pageTitle: 'Booking Details',
                    path: '/bookingdetails',
                    info: details.rows[0],
                    pics: pics.rows,
                });
            }
        }
    }else{
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};


exports.post_add_rating = async (req, res, next) => {
    
    const decoded = verify.authenticate(req);
    if (decoded) {
        const booking_id = req.body.booking_id;
        const rating = req.body.rate;
        booking = new Booking(booking_id);
        await booking.add_rating(rating);
        var string = encodeURIComponent(booking_id);
        res.redirect('/customer/bookingdetails/?id=' + string);
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}

exports.post_add_review = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        const booking_id = req.body.booking_id;
        const review = req.body.review;
        await booking.add_review(review);
        var string = encodeURIComponent(booking_id);
        res.redirect('/customer/bookingdetails/?id=' + string);
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}

exports.post_modify_booking = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        const booking_id = req.body.booking_id;
        console.log(booking_id);
        var string = encodeURIComponent(booking_id);
        res.redirect('/customer/bookingdetails/?id=' + string);
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}

exports.post_cancel_booking = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        
        await booking.enter_cancel_booking();
        return res.send('<script>alert("Booking Cancelled!"); window.location.href = "/profile";</script>');
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}