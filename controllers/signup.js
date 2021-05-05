const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');

exports.get_signup = (req,res,next) => {

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

    try{
        if (role=="customer"){
            customer = new Customer(name, email, dob, phone, address, passwd);
            await customer.add_user();
            res.send('<script>alert("User registered! You can login now"); window.location.href = "/user/login";</script>');
        }else{
            // fill later
        }
    }catch(e){
        if(e.code==23505){
            res.send('<script>alert("User already registered! Please login"); window.location.href = "/user/login";</script>');
        }
        throw (e);
    }

}