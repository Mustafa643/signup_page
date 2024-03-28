var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/catdb', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in Connecting to Database"));
db.once('open', function() {
    console.log("Connected to Database");
});

// Define a schema for user collection
var userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    phno: String,
    gender: String,
    password: String
});

// Define the User model
var User = mongoose.model('User', userSchema);

// Login route
app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    // Find user by email and password
    User.findOne({ email: email, password: password }, function(err, user) {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard'); // Redirect to failed log in dashboard
        }
        if (user) {
            return res.redirect('login_successful.html'); // Redirect to dashboard if login is successful
        } else {
            return res.redirect('/dashboard'); // Redirect to login failed page if email/password do not match
        }
    });
});

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var phno = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;

    var newUser = new User({
        name: name,
        age: age,
        email: email,
        phno: phno,
        gender: gender,
        password: password
    });

    newUser.save(function(err, user) {
        if (err) {
            console.error(err);
            return res.redirect('/signup_failed.html'); // Redirect to signup failed page on error
        }
        console.log("Record Inserted Successfully");
        return res.redirect('/registration_successful.html');
    });
});

app.get("/dashboard", (req, res) => {
    //  dashboard page
    res.send("No exiting user");
});
app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});