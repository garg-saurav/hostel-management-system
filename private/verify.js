const jwt = require('jsonwebtoken');
const keys = require('./keys');

/** Returns decoded jwtoken if correct, else null; throwable */
exports.authenticate = (req) => {
    try {
        let decoded = null;
        if (req.session.jwtoken) {
            try {
                decoded = jwt.verify(req.session.jwtoken, keys.JWT_SECRET);
            }
            catch (e) { // token verification failed
                req.session.jwtoken = null;
            }
        }
        return decoded;
    }
    catch (e) {
        throw (e);
    }
}

exports.generate = (email) => {
    return jwt.sign(email, keys.JWT_SECRET);
}