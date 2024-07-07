const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/JUBILANT");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase
        trim: true // Remove whitespace from email
    },
    phonenumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    // cpassword: {
    //     type: String,
    //     required: true
    // }

    
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;