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

// exports.post_booking = async (req, res, next) => {
    
    

// }