
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const Keys = require('./private/keys')

const app = express();
const port = 3000;
const sess_name = 'sid';

const router = require('./routes/');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    name: sess_name,
    resave: false,
    saveUninitialized: false,
    secret: Keys.SESS_SECRET,
    cookie: {
    }
}));

app.get('/', (req, res) => {
    res.redirect("/login");
  });

app.use('/', router);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});


