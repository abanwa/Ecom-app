const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/User");

// register
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: `Details must not be empty`
      });
    }

    const checkUser = await UserModel.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: `User already exist with the same email`
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      userName,
      email,
      password: hashPassword
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful"
    });
  } catch (err) {
    console.log("Error in register in auth-controller.js : ", err);
    res.status(500).json({
      success: false,
      message: `Some error occured : ${err?.message}`
    });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Details must not be empty`
      });
    }

    const checkUser = await UserModel.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: `User does not exist. Please register first`
      });
    }

    // console.log("CLIENT_SECRET : ", process.env.CLIENT_SECRET_KEY);

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser?.password
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: `Invalid Credentials`
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: checkUser?._id,
        role: checkUser?.role,
        email: checkUser?.email,
        userName: checkUser?.userName
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60d" }
    );

    res.cookie("ecomToken", token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV !== "DEVELOPMENT",
        sameSite: 'none', // because the frontend and backend are different
        domain: process.env.NODE_ENV !== "DEVELOPMENT" ? ".render.com" : undefined, // Set domain for production '.render.com' // remove it for localhost:5000
      }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser?.role,
          role: checkUser?.role,
          id: checkUser?._id,
          userName: checkUser?.userName
        }
      });
  } catch (err) {
    console.log("Error in login in auth-controller.js : ", err);
    res.status(500).json({
      success: false,
      message: `Some error occured : ${err?.message}`
    });
  }
};

// logout
const logoutUser = (req, res) => {
  res.clearCookie("ecomToken").json({
    success: true,
    message: "Logged out successfully"
  });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.ecomToken;
  console.log("req.cookies : ", req.cookies);
  console.log("ecomToken : ", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!!"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Error in authMiddleware in auth-controller.js : ", err);
    return res.status(401).json({
      success: false,
      message: `Some error occured : ${err?.message}`
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
