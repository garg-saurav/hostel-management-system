const Customer = require('../models/customer');
const Keys = require('../private/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_login = (req,res,next) => {

    res.render('login', {
        pageTitle: 'User Login',
        path: '/login'
    });


};

exports.post_auth = async (req, res, next) => {
    const email = req.body.email;
    const passwd = req.body.password;
    const role = req.body.role;
    
    try{
        if (role=="customer"){
            customer = new Customer(null, email, null, null, null, passwd);    
            const user = await customer.find_user();
            if(user.rowCount==0){
                return res.send('<script>alert("Invalid username/password"); window.location.href = "/user/login";</script>');
            }else if(await bcrypt.compare(passwd, user.rows[0].passwd)){
                const token = jwt.sign({email:email, role:role}, JWT_SECRET);
                req.session.jwtoken = token;
                return res.redirect('/user/profile');
            }else{
                return res.send('<script>alert("Invalid username/password"); window.location.href = "/user/login";</script>');
            }
        }else{
            // fill later
        }
    }catch(e){
        throw e;
    }
}