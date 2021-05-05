const Customer = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');
const Booking = require('../models/booking')

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_profile = async (req,res,next) => {

    try{
        if(req.session.jwtoken){
            let decoded;
            try{
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            }catch(e){ // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
            }
            person = new Person(decoded.email);
            const user = await person.get_user();
            if(user.rowCount==0){
                return res.send('<script>alert("Details not found"); window.location.href = "/user/login";</script>');
            }else{
                if(decoded.role=='customer'){
                    customer = new Customer(null, user.rows[0].email_id, null, null, null, null);
                    const user_bookings = await customer.get_bookings();
                    res.render('userprofile', {
                        pageTitle: 'Profile',
                        path: '/profile',
                        name: user.rows[0].name,
                        email_id: user.rows[0].email_id,
                        dob: user.rows[0].dob,
                        phone_no: user.rows[0].phone_number,
                        addr: user.rows[0].addr,
                        bookings: user_bookings.rows,
                        numbookings: user_bookings.rowCount,
                    });
                }
            }
        }else{
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
        }
    }catch(e){
        throw(e);
    }


};

exports.post_booking = async (req, res, next) => {
    
    try{
        if(req.session.jwtoken){
            let decoded;
            try{
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            }catch(e){ // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
            }
            booking = new Booking(req.body.booking_id);
            const details = await booking.get_all_details();
            const pics = await booking.get_photos();
            if(details.rowCount==0){
                // return res.send('<script>alert("Details not found"); window.location.href = "/user/login";</script>');
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
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
        }
    }catch(e){
        throw(e);
    }

}