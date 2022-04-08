const notes =require('../Models/Notes');
const express= require('express');
const Router = express.Router();
const asyncvalidator =require('../Middleware/Async');

Router.get('/',asyncvalidator(async (req,res)=>{
    const note = await notes.find();
    res.send(note);
}));

Router.post('/',asyncvalidator(async (req,res)=>{
    const note =new notes({
        text:req.body.text
    });
    await note.save();
    res.send("notes added");
}));

Router.put('/:id',asyncvalidator(async (req,res)=>{
    const note = await notes.findByIdAndUpdate(req.params.id,{text:req.body.text});
    if(!note) return res.status(400).send("no notes with current  id");
    res.send("Updated notes")
}));

Router.delete('/:id',asyncvalidator(async (req,res)=>{
    const note = await notes.findByIdAndDelete(req.params.id);
    if(!note) return res.status(400).send("no note with current id");
    res.send(" notes deleted");
}));

module.exports=Router;
