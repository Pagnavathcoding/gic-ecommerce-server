const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const route = express.Router();

const userModel = require('../models/User.js');


route.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ message: 'Please enter all the details' })
        }


        const userExist = await userModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.json({ message: 'User already exist with the given emailId' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();
        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie({ 'token': token }).json({ success: true, message: 'User registered successfully', data: user })
    } catch (error) {
        return res.json({ error: error });
    }

})

route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: 'Please enter all the details' })
        }

        const userExist = await userModel.findOne({email:req.body.email});
        if(!userExist){
            return res.json({message:'Wrong credentials'})
        }

        const isPasswordMatched = await bcrypt.compare(password,userExist.password);
        if(!isPasswordMatched){
            return res.json({message:'Wrong credentials pass'});
        }
        const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie({"token":token}).json({success:true,message:'LoggedIn Successfully'})
    } catch (error) {
        return res.json({ error: error });
    }

})


route.get('/user', async (req, res) => {
    try {
        const user  = await userModel.find();
        if(!user){
            return res.json({message:'No user found'})
        }
        return res.json({user:user})
    } catch (error) {
        return res.json({ error: error });  
    }
})

module.exports = route;