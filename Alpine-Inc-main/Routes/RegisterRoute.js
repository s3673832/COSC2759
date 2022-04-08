const register =require('../Models/Register');
const bcrypt =require('bcrypt');
const express= require('express');
const Router = express.Router();
const asyncvalidator =require('../Middleware/Async');
const auth =require('../Middleware/Auth');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');

Router.get('/',auth,asyncvalidator(async (req,res)=>{
    const reg = await register.find();
    res.send(reg);
}));

Router.post('/',[
    check('email','Email is Required').isEmail(),
    check('name','username should have min. 5 characters').isLength({min:5}),
    check('password',).isLength({min:6}).withMessage('password must be min. 6 characters.')
        .not().isEmpty().withMessage('should not be empty'),
    check('confirmPassword').isLength({min:6}).withMessage('password must be min. 6 characters.')
        .not().isEmpty().withMessage('should not be empty')
],asyncvalidator(async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json(errors.array() );
    let user = await register.findOne({email:req.body.email});
    if(user) return res.status(400).send("Already have account");

    user= new register({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    });
    if(req.body.password !==req.body.confirmPassword) return res.status(400).send("incorrect confirm password");
    const salt =await bcrypt.genSalt(5);
    user.password =await bcrypt.hash(user.password ,salt);
    const salt1 =await bcrypt.genSalt(5);
    user.confirmPassword =await bcrypt.hash(user.confirmPassword ,salt1);
    await user.save();
    const token = jwt.sign({_id: this._id},process.env.PRIVATEKEY);
    res.header('x-auth',token).status(200).send("successful Sign up");

}));
module.exports=Router;
