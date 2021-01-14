const express = require('express');
let router = express.Router();
const User = require("../models/User")
const { registerValidation, loginValidation} = require("./validation")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
router.get("/", (req, res) => {
    res.send("This is the route");
    res.end();
})



router.post("/register", async (req, res) => {
    //Validate
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    //Check for user 
    const emailExists= await User.findOne({email:req.body.email})
    if(emailExists) return res.status(400).json({error:"Email already exists"})

    // Hasing the password 
    const salt= await bcrypt.genSalt(10)
    const hashPass= await bcrypt.hash(req.body.password,salt);



    //Create a new user 
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPass,
    }) 
    //Saving into database
    try {
        const savedUser=await user.save();
        res.json({user:savedUser._id})
    }
    //Catching any errors
    catch (e) {
        res.status(400).send(e)
    }


})


router.post("/login", async(req,res)=>{
    console.log(req.body);
    //Validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    //Check for user 
    const user= await User.findOne({email:req.body.email})
    if(!user) return res.status(400).json({error:"Email ''or Password ''is wrong"});

    //Password is correct 
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if (!validPass) return res.status(400).json({error:"''Email or'' Password is wrong"});
    
    //Create and asign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header("auth-token",token).json({message:"success",jwt:token});
})

module.exports = router;