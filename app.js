
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;
const sess_name = 'sid';

const SESS_SECRET = 'fasjkfhjkashfjkh$%@#$%#$DFgdfgd';

const userRo = require('./routes/user');
// // const pool =  require('./utils/database');
// // const prodsRo = require('./routes/prod');
// // const cartRo = require('./routes/cart');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    name: sess_name,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
    }
}));

app.get('/', (req, res) => {
    res.redirect("/user/login");
  });

app.use('/user',userRo);
// // app.use('/prods',prodsRo);
// // app.use('/cart',cartRo);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});


