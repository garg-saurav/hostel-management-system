const Customer = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');

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
                res.render('profile', {
                    pageTitle: 'Profile',
                    path: '/profile',
                    name: user.rows[0].name,
                    email_id: user.rows[0].email_id,
                    dob: user.rows[0].dob,
                    phone_no: user.rows[0].phone_number,
                    addr: user.rows[0].addr,
                });
            }
        }else{
            return res.send('<script>alert("Please login first"); window.location.href = "/user/login";</script>');
        }
    }catch(e){
        throw(e);
    }


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
                const token = jwt.sign({email:email}, JWT_SECRET);
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