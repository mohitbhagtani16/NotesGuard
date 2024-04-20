const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Mohitisasoftwareengineer$$$";

// Route 1:Create a User using:POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a Vlaid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 5 character").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exists " });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //  create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      // res.json(user);
      res.json({ success,authToken });
      //catch a arror
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//  Route 2: authenticate  a User using:POST "/api/auth/createuser". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a  password please").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Try to Login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false
        return res
          .status(400)
          .json({success, error: "Try to Login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
success=true;
      res.send({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get loggedin  User Details using:POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
