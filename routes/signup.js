const express = require('express');
const router = express.Router();

var pool = require('../config/db');
var crypt = require('../bcrypt.js');
const expressValidator = require('express-validator');
const passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10; // put bycrypt after express validtor 


// @description        Get home page
// @route              GET /api/v1/
// @access             Public
router.get('/home', function(req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated);
    res.render('home', {
        style: 'home.css',
        tittle: 'Home Page'
    });
});
// @description        Get admin page
// @route              GET /api/v1/admin
// @access             Private
router.get('/admin', authenticationMiddleware(), function(req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated);
    res.render('admin');
});
// @description        Post admin page
// @route              POST /api/v1/admin
// @access             Private
router.post('/admin', function(req, res) {
    res.render('admin');

});


// @description        Get login page
// @route              GET /api/v1/ligin
// @access             Public
router.get('/login', (req, res, next) => {
    res.render('login', {
        style: 'login.css',
    });
    
});
// @description        post home page
// @route              POST /api/v1/login
// @access             Public
router.post('/login', passport.authenticate(
    'local', {
        successRedirect: '/api/v1/admin',
        failureRedirect: '/api/v1/login'
    }
));


// @description        Get register page
// @route              GET /api/v1/register
// @access             Public
router.get('/register', authenticationMiddleware(), function(req, res) {
    res.render('register', {
        style: 'register.css'
    });

});

// @description        Get home page
// @route              POST /api/v1/register
// @access             Public
router.post('/register', function(req, res) {
  const username = req.body.username;
  const phoneNumber = req.body.phoneNumber;
  const idNo = req.body.idNo;
  const county= req.body.county;
  const country= req.body.country;
  const propertyName= req.body.propertyName;
  const propertyType= req.body.propertyType;
  const propertyLocation= req.body.propertyLocation;
  const roomTypes= req.body.roomTypes;
  const description= req.body.description;
  const rent= req.body.rent;
  const socialAmenities= req.body.socialAmenities;
  const propertyStatus= req.body.propertyStatus;
  const leaseStart= req.body.leaseStart;
  const leaseEnd= req.body.leaseEnd;
  const created_at = new Date();
  
  pool.query('INSERT INTO properties (username, phoneNumber, idNo, county, country, propertyName, propertyType, propertyLocation, roomTypes, description, rent, socialAmenities, propertyStatus, leaseStart, leaseEnd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, phoneNumber, idNo, county, country, propertyName, propertyType, propertyLocation, roomTypes, description, rent, socialAmenities, propertyStatus, leaseStart, leaseEnd, created_at], function(error, results, fields) {
      if(error) throw error;

      res.render('admin');
  })
});
    
// @description        Get home page
// @route              GET /api/v1/signup
// @access             Public
router.get('/signup', function(req, res) {
    res.render('signup', {
        style: 'login.css'
    });
   
});
// @description        Create signup page
// @route              POST /api/v1/signup
// @access             Public
router.post('/signup', function(req, res) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long, please try again.').len(8, 100);
    //req.checkBody('password', 'Password must include one lowercase character, one uppercasecharacter, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
    req.checkBody('confirmPassword', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('confirmPassword', 'Passwords do not match, please try again.').equals(req.body.password);

    
    const errors = req.validationErrors();

    if(errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);

        res.render('signup', {
            title: 'Sign Up Error', 
            errors: errors
        });
    } else {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        // const dotenv = require('dotenv'); 
        // dotenv.config({ path: './config/config.env' });
        // const pool = require('../config/db');

        bcrypt.hash(password, saltRounds, function(err, hash) {
            pool.query('INSERT INTO landlords (username, email, password) VALUES (?, ?, ?)', [username, email, hash], function(error, results, fields) {
                if(error) throw error;

                pool.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
                      if (error) throw error;

                       const user_id = results[0];

                      console.log(results[0]);
                      req.login(user_id, function(err) {
                          res.redirect('/api/v1/home');
                      });     
                });        
            })
        });   
    }   
});

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
  passport.deserializeUser(function(user_id, done) {
      done(null, user_id);
  });

  function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();
        res.redirect('/api/v1/login')
    }
}
// Add  users(tenants)
router.route('/tenant/signup').post(function (req, res) {
    console.log("In User Signup Post");
    console.log(req.body);
    email = req.body.email.toLowerCase();
    trimemail = email.trim();
    var today = new Date();
    var year = today.getFullYear();
    
    pool.query('SELECT * FROM tenants WHERE email = ?', [trimemail], (err, rows) => {
      if (err){
          console.log(err);
          console.log("unable to read the database");
          res.status(400).json({responseMessage: 'unable to read the users database'});
      } else {
        if (rows.length > 0) {
          console.log("Tenant already exists");
          res.status(400).json({responseMessage: 'Tenant already exists'});
        } else {
          
          crypt.createHash(req.body.password, function (response) {
            encryptedPassword = response;
  
            var userData = {
              "firstname": req.body.firstname,
              "lastname": req.body.lastname,
              "email": trimemail,
              "password": encryptedPassword,
              "phone" : req.body.phone,
              "idno" : req.body.idno,
              "aboutMe" : req.body.aboutMe,
              "city" : req.body.city,
              "country" : req.body.country,
              "gender" : req.body.gender,
            
            }
          
            //Save the user in database
            pool.query('INSERT INTO tenants SET ?',userData, function (err) {
            if (err) {
              console.log("unable to insert into database", err);
              res.status(400).send("unable to insert into database");
            } else {
              console.log("Tenant Added");
              res.cookie('cookie1',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
              res.status(200).json({responseMessage: 'Tenant Added'});
            }});
        }, function (err) {
            console.log(err);
          });
        }
      }
    });
  });
  
  

// Validate tenant login details
router.route('/tenant/login').post(function (req, res) {
  console.log("Inside Tenant Login view ");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  try{

    pool.query('SELECT * FROM tenants WHERE email = ?', [trimemail], (err, rows) => {
      
      if (err) {
        console.log("Tenant does not exist");
        res.status(400).json({responseMessage: 'Tenant does not exist'});
      } else {
        if (rows.length > 0) {
          // Check if password matches
          crypt.compareHash(password, rows[0].password, function (err, isMatch) {
            if (isMatch && !err) {
              res.cookie('cookie1',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
              req.session.user = rows[0].email;
              res.status(200).json({responseMessage: 'Login Successful'});
              console.log("Login Successful");
            } else {
              res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
              console.log("Authentication failed. Passwords did not match.");
            }
          })
        }
        else {
          res.status(402).json({responseMessage: 'Authentication failed. Tenant not found, incorrect email or password.'})
          console.log("Authentication failed. Tenant not found, incorrect email or password.");
          
        }
      }
    });
  }
  catch(err){
    console.log(err.message)
  }
});
// fetch user profile details
router.route('/profile').post(function (req, res) {
  console.log("Inside Profile fetch");
  var input_email = req.body.email;
  console.log(input_email);
  pool.query('SELECT * FROM tenants WHERE email = ?', [input_email], (err, result) => {
    if (err){
      console.log(err);
      res.status(400).json({responseMessage: 'Tenant not found'});
    }else {
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
    }
  })
});


// save user profile details
router.route('/profilesave').post(function (req, res) {
    console.log("In profile save view");
    email = req.body.email.toLowerCase();
    trimemail = email.trim();
    
    var userData = {
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
      "phone" : req.body.phone,
      "idno" : req.body.idno,
      "aboutMe" : req.body.aboutMe,
      "city" : req.body.city,
      "country" : req.body.country,
      "gender" : req.body.gender,
    
    }
  
    console.log(userData);
    pool.query('UPDATE tenants SET ? WHERE email = ?', [userData, trimemail], function (err) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        res.status(400).json({responseMessage: 'unable to update database'});
      } else {
        pool.query('SELECT * FROM tenants WHERE email = ?', [trimemail], (err, result) => {
          if (err){
            console.log(err);
            res.status(400).json({responseMessage: 'Tenant not found'});
          }else {
            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(result));
          }
        })
      }
    })
  });
  
// Add owner(landlord)
router.route('/landlord/signup').post(function (req, res) {
  console.log("In landlord Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();

  pool.query('SELECT * FROM landlords WHERE email = ?', [trimemail], (err, rows) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({responseMessage: 'unable to read the users database'});
    } else {
      if (rows.length > 0) {
        console.log("landlord already exists");
        res.status(400).json({responseMessage: 'landlord already exists'});
      } else {

        crypt.createHash(req.body.password, function (response) {
          encryptedPassword = response;

          var userData = {
            "username": req.body.username ,
            "email": trimemail,
            "password": encryptedPassword,
            "phone" : req.body.phone,
            "idno" : req.body.idno,
            "aboutMe" : req.body.aboutMe,
            "city" : req.body.city,
            "country" : req.body.country,
            "gender" : req.body.gender,

          }

          //Save the user in database
          pool.query('INSERT INTO landlords SET ?',userData, function (err) {
          if (err) {
            console.log("unable to insert into database", err);
            res.status(400).send("unable to insert into database");
          } else {
            console.log("Landlord Added");
            res.cookie('cookie1',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).json({responseMessage: 'Landlord Added'});
          }});
      }, function (err) {
          console.log(err);
        });
      }
    }
  });
});


// Validate owner(landlord) login user details
router.route('/landlord/login').post(function (req, res) {
  console.log("Inside Landlord Login view ");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  try{

    pool.query('SELECT * FROM landlords WHERE email = ?', [trimemail], (err, rows) => {

      if (err) {
        console.log("landlord does not exist");
        res.status(400).json({responseMessage: 'landlord does not exist'});
      } else {
        if (rows.length > 0) {
          // Check if password matches
          crypt.compareHash(password, rows[0].password, function (err, isMatch) {
            if (isMatch && !err) {
              res.cookie('cookie1',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
              req.session.user = rows[0].email;
              res.status(200).json({responseMessage: 'Login Successful'});
              console.log("Login Successful");
            } else {
              res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
              console.log("Authentication failed. Passwords did not match.");
            }
          })
        }
        else {
          res.status(402).json({responseMessage: 'Authentication failed. Tenant not found, incorrect email or password.'})
          console.log("Authentication failed. Tenant not found, incorrect email or password.");
          
        }
      }
    });
  }
  catch(err){
    console.log(err.message)
  }
});


module.exports = router;

//res.render('signup', {title: 'Signed Up Successfully'});  