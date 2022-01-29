var express = require('express');
var app = express();
var user = require('../model/user.js'); 
//-- pg 21 chapter 6
// import categoryDB from category.js, name as category
var category = require('../model/category.js');
//-- pg 22 chapter 6
// import furnitureDB from furniture.js
var furniture = require('../model/furniture.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());// parse application/json
app.use(urlencodedParser); // parse application/x-www-form-urlencoded

// pg 22 chapter 6. get furniture by category
app.get('/api/category/:catid/furniture', function (req, res) {
    //fill in your code
    // get cat id
    var catid = req.params.catid

    // call the getFurnitureByCat
    furniture.getFurnitureByCat(catid, (err, result)=>{ // arrow function
        if(err){ // if there is error
            // assume return status code 500
            res.status(500).send({"message":"some error"})
        }else{ // no error
            // assume respond status code 200
            // just respond with the result
            res.status(200).send(result)
        }
    })
 
 });
 

// pg 21 chapter 6. get the category
app.get('/api/category', function (req, res) {
    // use the object categoryDB in category.js
    // call getCategory function or method in object
    category.getCategory( function (err, result) { //-- callback function
        if (!err) {
            res.send(result);
        }
        else{
            console.log(err);
            res.status(500).send("Some error");
         }
    });
});


// add the DELETE api
app.delete('/api/user/:userid', function (req, res) {
    
    var userid = req.params.userid;
    
    user.deleteUser(userid, function (err, result) {
        if (!err) {
        
            res.send(result + ' record deleted');
        }else{
            console.log(err);
         
            res.status(500).send("Some error");
 
        }
    });
 
});


// add the PUT api here
app.put('/api/user/:userid', function (req, res) {
    // get the info from body
    var email = req.body.email
    var password = req.body.password
    var userid = req.params.userid
    
    //implement your code    
    user.updateUser(email, password, userid, 
        (err, result)=>{
            if(!err){
                // no error. shiok!
                console.log(result);
                //res.send(result)
                //res.send(result + ' record updated');
                // MST demo 13/1
                // if else 
                // if affected rows > 0 send one message 
                // else send another type of msg
                if(result.affectedRows>0){
                    res.send({"message":"success"})
                }else{
                    res.send({"message":"no such user"})
                }
            }else{
                // got error !!! 
                console.log(err)
                res.send(err.statusCode);
            }
        })
    
});


// POST
app.post('/api/user',  function (req, res) {
    // get the info posted from postman
    var username = req.body.username;
    var email = req.body.email; 
    var role = req.body.role;
    var password = req.body.password;
    // add user into database
    user.addUser(username, email, role, password, 
        function (err, result) {
        if (!err) {
            console.log(result);
            //res.send(result + ' record inserted');
            // MST demo
            // return the first item in array
            res.send(result[0])
        } else{
            res.send(err.statusCode);

        }
    });

});


// add get users api
app.get('/api/user', function (req, res) {

    user.getUsers( function (err, result) {
        if (!err) {
            res.send(result);
        }
        else{
            console.log(err);

            res.status(500).send("Some error");
        }
    });

});


app.get('/api/user/:userid', function (req, res) {
    var id = req.params.userid;

    user.getUser(id, function (err, result) {
        if (!err) {
            console.log(result)
            res.send(result);
        }else{
            res.status(500).send("Some error");
        }
    });

});

module.exports = app
