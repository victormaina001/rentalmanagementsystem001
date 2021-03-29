const express = require('express');
const router = express.Router();
var pool = require('../config/db');
var crypt = require('../bcrypt.js');
const expressValidator = require('express-validator');
const passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10; // put bycrypt after express validtor 


// @description        Get all properties
// @route              GET /api/v1/properties
// @access             Public
router.get('/properties', (req, res) => {
  pool.query('SELECT * FROM properties', (err, rows) => {
    if(!err) {
      res.render('admin', { rows: rows});  
    } else {
        console.log(err);
    }
     // console.log('Data: \n', rows);
  });

});
router.get('/edit/:id', (req, res) => {
  pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, rows) => {
    if(!err) {
      res.render('editproperty', { 
        rows: rows,
        style: 'register.css'
      });  
    } else {
        console.log(err);
    }
  });
});

// @description        Get single property
// @route              GET /api/v1/properties/:id
// @access             Public
router.post('/edit/:id', (req, res) => {
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
  pool.query('UPDATE properties SET username = ?, phoneNumber = ?, idNo = ?, county = ?, country = ?, propertyName = ?, propertyType = ?, propertyLocation = ?, roomTypes = ?, description = ?,  rent = ?, socialAmenities = ?, propertyStatus = ?, leaseStart = ?, leaseEnd = ?, created_at = ?, WHERE id = ?', [username, phoneNumber, idNo, county, country, propertyName, propertyType, propertyLocation, roomTypes, description, rent, socialAmenities, propertyStatus, leaseStart, leaseEnd, created_at, req.params.id], (err, rows) => {
    if(!err) {
      pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, rows) => {
        if(!err) {
          res.render('admin', { 
            rows: rows,
            style: 'register.css',
            alert: 'Property updated successfuly'
          });  
        } else {
            console.log(err);
        }
      });
      
     
    } else {
        console.log(err);
    }
  });
});
router.get('/delete/:id', (req, res) => {
  pool.query('DELETE FROM properties WHERE id = ?', [req.params.id], (err, rows) => {
    if(!err) {
      res.status(301).redirect('/api/v1/admin') 
    } else {
        console.log(err);
    }
  });


});
router.post('/find', (req, res) => {
  let searchTerm = req.body.search;

  pool.query('SELECT * FROM properties WHERE username LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
    if(!err) {
      res.render('admin', { rows: rows});  
    } else {
        console.log(err);
    }
     // console.log('Data: \n', rows);
  });
});
// Add Property
router.route('/landlord/listproperty').post( function (req, res) {
  console.log("In Landlord  Property Post");
 
   var userData = {
     listedBy: req.body.listedBy,
     propertyName:req.body.propertyName,
     county: req.body.county.toLowerCase(),
     country: req.body.country.toLowerCase(),
     description: req.body.description,
     propertyType: req.body.propertyType,
     bedrooms: req.body.bedrooms,
     bathrooms: req.body.bathrooms,
     rent: req.body.rent,
     socialAmenities: req.body.socialAmenities,
   }
 
   console.log(userData.image1);
   pool.query('INSERT INTO properties SET ?',userData, function (error,result) {
     if (error) {
       console.log(error);
       console.log("unable to insert into database");
       res.status(400).json({responseMessage: 'unable to insert into database'});
     } else {
       console.log(result);
       console.log("Property Added");
       res.status(200).json({responseMessage: 'Property Added'});
     }
   });    
 });
//route for update data
router.route('/landlord/update').post(function (req, res) {
    console.log("In Property Update View");
    email = req.body.email.toLowerCase();
    trimemail = email.trim();
    
    var userData = {
      listedBy: req.body.listedBy,
      propertyName:req.body.propertyName,
      county: req.body.county.toLowerCase(),
      country: req.body.country.toLowerCase(),
      description: req.body.description,
      propertyType: req.body.propertyType,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      rent: req.body.rent,
      socialAmenities: req.body.socialAmenities,
    }
    console.log(userData);
    pool.query('UPDATE properties SET ? WHERE propertyName= ?', [userData, trimemail], function (err) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        res.status(400).json({responseMessage: 'unable to update database'});
      } else {
        pool.query('SELECT * FROM properties WHERE propertyName = ?', [trimemail], (err, result) => {
          if (err){
            console.log(err);
            res.status(400).json({responseMessage: 'Property  not found'});
          }else {
            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(result));
          }
        })
      }
    })
  });
  //route for deleting data
  router.route('/landlord/delete').post(function (req, res) {
    console.log("Inside delete property route");
    var userData={
      propertyName:req.body.propertyName,
     }
     pool.query("DELETE FROM properties WHERE propertyName =?", [userData] , function (err){
       if(err){
         console.log("Unable to delete property ");
         res.status(400).json({responseMessage: 'Unable to delete property'});
       }
       else{
         console.log("Deleted property Successfully")
       }
      })
      });
  


module.exports = router;