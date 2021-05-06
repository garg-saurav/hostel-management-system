const Customer = require('../models/customer');
const Owner = require('../models/owner');
const Person = require('../models/person');
const bcrypt = require('bcryptjs');
const e = require('express');
const verify = require('../private/verify');

exports.get_signup = (req, res, next) => {

    res.render('signup', {
        pageTitle: 'User Register',
        path: '/signup'
    });

};

exports.post_reguser = async (req, res, next) => {
    // console.log(req);
    const email = req.body.email;
    const passwd = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name;
    const dob = req.body.dob;
    const phone = req.body.phone;
    const address = req.body.address;
    const role = req.body.role;

    try {
        if (role == "customer") {
            customer = new Customer(name, email, dob, phone, address, passwd);
            await customer.add_user();
            res.send('<script>alert("User registered! You can login now"); window.location.href = "/login";</script>');
        } else if (role == "hostel_owner"){
            owner = new Owner(name, email, dob, phone, address, passwd);
            await owner.add_user();
            res.send('<script>alert("User registered! You can login now"); window.location.href = "/login";</script>');
        } else{
            //can't reach here
        }
    } catch (e) {
        if (e.code == 23505) {
            res.send('<script>alert("User already registered! Please login"); window.location.href = "/login";</script>');
        }
        throw (e);
    }

}

exports.post_reg_as_other_type = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
        const email = decoded.email;
        const role = decoded.role;
        if(role == "customer"){
            // register as hostel owner
            customer = new Customer(null, decoded.email, null, null, null, null);
            await customer.reg_as_hostel_owner();
            res.send('<script>alert("User registered as hostel owner with same password! You can login again as different role"); window.location.href = "/profile";</script>');
        }else if (role == "hostel_owner"){
            // register as customer
            owner = new Owner(null, decoded.email, null, null, null, null);
            await owner.reg_as_customer();
            res.send('<script>alert("User registered as customer with same password! You can login again as different role"); window.location.href = "/profile";</script>');
        } else {
            // can't reach here
        }
    }else{
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}