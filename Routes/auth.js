const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.secret
const fetchuser = require('../middleware/fetchuser');
router.use(express.json());
router.use(cors());

router.post('/create-user', [
  check('name', "Enter valid name").isLength({ min: 3 }),
  check("email", "Enter valid email").isEmail(),
  check("userid", "Username must be 3 characters").isLength({min:3}),
  check("password", "Enter valid password with minimum 5 characters").isLength({ min: 5 })
], async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  let id = await User.findOne({ userid: req.body.userid })
  if (user) {
    return res.status(400).json({ error: "User already exists" })
  }
  if (id) {
    return res.status(400).json({ error: "Username taken" })
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() })
  }
  const salt = await bcrypt.genSalt(10)
  if (req.body.password !== req.body.cpassword) {
    return res.status(400).json({ error: "Both passwords do not match" })
  }
  const secPassword = await bcrypt.hash(req.body.password, salt)
  
  user = await User.create(
    {
      name: req.body.name,
      email: req.body.email,
      userid: req.body.userid,
      password: secPassword,
      cpassword: secPassword
    }
  )
  await user.save()
  return res.json({ status: "success", user })
})


router.post('/forgot-pass', [
  check("email", "Enter valid email").isEmail(),
  check("password", "Enter valid password with minimum 5 characters").isLength({ min: 5 })
], async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(404).json({ error: "User Not Found" })
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() })
  }
  const salt = await bcrypt.genSalt(10)
  if (req.body.password !== req.body.cpassword) {
    return res.status(400).json({ error: "Both passwords do not match" })
  }
  const secPassword = await bcrypt.hash(req.body.password, salt);
   user.password=secPassword;
  await user.save()
  return res.json({ status: "success", user })
})



router.post('/login', [
  check("email", "enter valid email").isEmail(),
  check("password", "enter valid password").isLength({ min: 5 })
], async (req, res) => {
  try {

    let user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ error: "Wrong Credentials!!!" })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong Credentials!!!" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, jwtSecret)
    res.json({ status: "success", name:user.name ,authToken,userid:user.userid })
  }
  catch (error) {
    res.status(500).send("Internal Server Error")
  }
})


router.post('/getuser', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})
module.exports = router;
