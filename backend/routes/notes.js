const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route1: Get All the notes using GET "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});
//Route2: Add a new  notes using POST    "/api/notes/addnote" login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are error then return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//Route 3: Update an exsiting  note using PUT    "/api/notes/updatenote" login required
router.put(
    "/updatenote/:id",fetchuser, async (req, res) => {
        try{
          const {title,description,tag}=req.body;
        
        //create a newNote object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
        //find the note to be updated
        let note= await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        if(note.user.toString()!== req.user.id){return  res.status(401).send("Not Allowed")}
        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({note});
        }
        catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error");
        }
        
    })
  
  

    //Route 4: Delete an exsiting  note using DELETE    "/api/notes/deletenote" login required
router.delete(
  "/deletenote/:id",fetchuser, async (req, res) => {
      try{
        const {title,description,tag}=req.body;
      //find the note to be updated and delete it 
      let note= await Note.findById(req.params.id);
      if(!note){return res.status(404).send("Not found")}

      // allow deleteion only if user owns this note
      if(note.user.toString()!== req.user.id){return  res.status(401).send("Not Allowed")}

      note=await Note.findByIdAndDelete(req.params.id);
      res.json({"Success": "Note has been deleted",note:note});
  }catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }
  })

module.exports = router;
