const express = require("express");
const path = require("path");
const collection = require("./config"); // Assuming this is your MongoDB connection
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("c-login");
});

app.get("/c-register", (req, res) => {
    res.render("c-register");
});

app.get("/beautician", (req, res) => {
    res.render("beautician");
})

// Register User
app.post("/c-register", async (req, res) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password
    }

    try {
        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ username: data.username });

        if (existingUser) {
            res.send('User already exists. Please choose a different username.');
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed one

            const userdata = await collection.insertMany(data);
            console.log(userdata);
                res.send('Registration Successfull!!!');
              }
    } catch (error) {
        console.error(error);
        res.send('An error occurred during registration.');
    }
});

// Login user 
app.post("/c-login", async (req, res) => {
    try {
        const user = await collection.findOne({ username: req.body.username });
        if (!user) {
            res.send("Username not found");
        } else {
            // Compare the hashed password from the database with the plaintext password
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordMatch) {
                res.send("Wrong Password");
            } else {
                res.render("index");
            }
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred during login.");
    }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
