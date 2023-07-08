//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app=express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

                //usual port mongoose listens too/
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true});
                                          // ! database name 


 

                                        
 const userSchema = new mongoose.Schema ({
    email : String,
    password: String 
})
 
 


                        //secret using which we are encrypting 
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
                                            //particular field - require encrypting..


const User = new mongoose.model("User", userSchema) ;




app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})


app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save()
    .then(() => {
      // Render the EJS file (e.g., "post.ejs") and pass the saved data
      res.render('secrets');
    })
    .catch(err => console.error('Error saving post:', err));
});;


app.post("/login",function(req,res){
    const enteredusername = req.body.username;
    const enteredpassword = req.body.password;
    //now were getting the input from the user
    //next is to check these credientials against our database
    User.findOne({username: enteredusername})
    .then(user => {
        if (user.password === enteredpassword) {
          // Render a success page if the credentials match
          res.render('secrets');
        } else {
          // Render an error page if the credentials don't match
          res.render('error');
        }
      })
      .catch(err => {
        console.error('Error finding user:', err);
        // Render an error page if there was an error finding the user
        res.render('error');
      });


    })





















app.listen(3000,function(){
    console.log("server started on port 3000");
});