const bcrypt =require('bcrypt');
const express= require('express');
const Router = express.Router();
const register =require('../Models/Register');
const asyncvalidator =require('../Middleware/Async');
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');

Router.get('/',
    [
        check('email','Email is Required').isEmail(),
        check('name','username should have min. 5 characters').isLength({min:5}),
        check('password',).isLength({min:6}).withMessage('password must be min. 6 characters.')
            .not().isEmpty().withMessage('should not be empty')
    ],asyncvalidator(async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json(errors.array() );
    let user = await register.findOne({email:req.body.email});
    if(!user) return res.status(400).send("invalid email or password");
    const valid= await  bcrypt.compare(req.body.password ,user.password);
    if(!valid) return res.status(400).send("invalid email or password");
    const token =jwt.sign({_id: this._id},process.env.PRIVATEKEY);
        res.header('x-auth',token).send("successful login");
}));
module.exports=Router;
