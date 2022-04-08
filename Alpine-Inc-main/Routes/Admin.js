const notes =require('../Models/Notes');
const express= require('express');
const Router = express.Router();

Router.get('/',async function (req, res) {
    const note = await notes.find();
    res.render('index', { title: 'Hey', message: note })
});

module.exports=Router;
