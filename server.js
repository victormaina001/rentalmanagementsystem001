const express = require('express');
const mysql = require('mysql');
var pool = require('./config/db');
const exphbs  = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
// Reequiring Authentication packages only
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');




// Bringing in Route files
const homeRoutes = require('./routes/signup');
const propertyRoutes = require('./routes/properties');
const loginRoutes = require('./routes/signup')
const signupRoutes = require('./routes/signup');
const registerRoutes = require('./routes/signup');
const adminRoutes = require('./routes/signup');





const app = express();


// Use body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middleware
app.use(cookieParser());

// Session storage in db
var options = {
    connectionLimit : 100,
    host            : process.env.RDS_HOSTNAME,
    port            : process.env.RDS_PORT,
    user            : process.env.RDS_USERNAME,
    password        : process.env.RDS_PASSWORD,
    database        : process.env.RDS_DB_NAME,

};
var sessionStore = new MySQLStore(options); 

app.use(session({
    secret: 'iovJcxzoivJewqn',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    //cookie: { secure: true }
  }));
  app.use(passport.initialize()); // this 2 lines must be immediately after express session middleware
  app.use(passport.session());

 // Routes and Backend Funcionalities
 var login = require('./routes/signup');


// Mount routers
app.use('/api/v1', homeRoutes);
app.use(propertyRoutes);
app.use('/api/v1', loginRoutes);
app.use('/api/v1', registerRoutes);
app.use('/api/v1', adminRoutes);
app.use(login);
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
        const pool = require('./config/db');

        pool.query('SELECT id, password FROM landlords WHERE username = ?', [username], function(err, results, fields) {
            if(err) {done(err)};

            if(results.length === 0) {
                done(null, false);
            } else {
                // console.log(results[0].password.toString())
            const hash = results[0].password.toString();

            bcrypt.compare(password, hash, function(err, response) {
                if(response === true) {
                    return done(null, {user_id: results[0].id});

            } else {
                return done(null, false);
            }

            });

            }   
            
        });
    }
  ));


// Load static files
app.use(express.static('public'));


// Register `hbs.engine` with the Express app.
app.engine('hbs', exphbs( {extname: '.hbs',
defaultLayout: 'main',
partialsDir  : [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
]

}));
app.set('view engine', 'hbs');


 //Connect to DB
 pool.getConnection((err, connection) => {
    if(err) throw err; //not  connected!
    console.log('Connected as ID ' + connection.threadId);
});




const PORT = process.env.PORT || 8081;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

