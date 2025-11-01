const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, address, phone, answer } = req.body;

    if (!username || !email || !password || !address || !phone || !answer) {
      // 400 Bad Request/Bad Input
      return res.status(400).json({
        success: false,
        message: 'Error in register api.',
      })
    }

    // check user
    const existing = await User.findOne({ email })

    if (existing) {
      // 409 conflict with current state of the server
      return res.status(409).json({
        success: false,
        message: 'Email already exists.',
      })
    }

    const user = await User.create({ username, email, password, address, phone, answer })
    const userObj = user.toObject();
    delete userObj.password;

    // 201 request succeeded and new resource created
    return res.status(201).send({
      success: true,
      message: "User successfully registered",
      user
    })

  } catch (error) {
    console.log(error)
    // 500 server error
    res.status(500).json({
      success: false,
      message: 'Error in register api.',
      error
    })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email, !password) {
      //Bad request
      return res.status(400).json({
        success: false,
        message: "email/password not provided"
      })
    }

    const user = await User.findOne({ email });

    if (!user) {
      // 401: Unauthorized
      return res.status(401).json({
        success: false,
        message: "user does not exist"
      })
    }

    if (!await user.verifyPassword(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      })
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    // 500 server error
    res.status(500).json({
      success: false,
      message: 'Error while login.',
      error
    })
  }
}