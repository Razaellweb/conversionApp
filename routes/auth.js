const express = require("express");
const jwt = require("jsonwebtoken");

const { generateUserId, createSettings, convertCurrency } = require("../services/helpers");
const { UserModel, AccountModel } = require("../db/index");
const CryptoJS = require("crypto-js");
const user = require("../db/models/user");

let authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      gender,
      country,
      phoneNumber,
      password,
      pin,
    } = req.body;

    var userId = await generateUserId();

    var hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.secret_key
    ).toString();

    const newUser = await UserModel.create({
      userId,
      firstName,
      lastName,
      emailAddress,
      gender,
      country,
      phoneNumber,
      password: hashedPassword,
    });

    await createSettings(userId, pin);

    var tokenx = jwt.sign(
      { userId, emailAddress: req.body.emailAddress },
      process.env.secret_key
    );

    res.status(200).json({ message: "User Sign Up Successful", token: tokenx });
  } catch (err) {
    console.log(err);
    res.json({
      err: {
        err,
        message: "Phone number or Email has already been used",
      },
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Find the user by username

    if (emailAddress == undefined) {
      return res.status(401).json({ message: "User Does Not Exist" });
    }

    const user = await UserModel.findOne({ emailAddress });

    if (!user) {
      return res.status(401).json({ message: "User Does Not Exist" });
    }

    const userPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.secret_key
    );

    const userPassword = userPass.toString(CryptoJS.enc.Utf8);

    // Compare the provided password with the hashed password

    if (!(userPassword == password)) {
      return res.status(401).json({ message: "Invalid Password For User" });
    }

    // Generate and send a JSON Web Token (JWT)
    var token = jwt.sign(
      { userId: user.userId, emailAddress: req.body.emailAddress },
      process.env.secret_key
    );

    res.json({ message: "Login Successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/edit/:token", async (req, res) => {
  try {
    const token = req.params.token;
    var decodedToken = jwt.verify(token, process.env.secret_key);

    const userId = decodedToken.userId;

    let editedUser = await UserModel.findOneAndUpdate(
      {
        userId,
      },
      { ...req.body }
    );

    res.json({ message: "Edit Successful", token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error, please confirm user exists" });
  }
});

authRouter.post("/editusersettings/:token", async (req, res) => {
  try {
    const token = req.params.token;
    var decodedToken = jwt.verify(token, process.env.secret_key);

    const userId = decodedToken.userId;

    let editedUser = await AccountModel.findOneAndUpdate(
      {
        userId,
      },
      { ...req.body }
    );

    res.json({ message: "Edit Successful", token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error, please confirm user exists" });
  }
});

authRouter.get("/getUser/:token", async (req, res) => {
  try {
    const token = req.params.token;
    var decodedToken = jwt.verify(token, process.env.secret_key);

    const userId = decodedToken.userId;

    let User = await UserModel.findOne({
      userId,
    });

    let UserAccount = await AccountModel.findOne({
      userId,
    });

    let userBalance = convertCurrency(UserAccount.balance, "USD", UserAccount.prefferedCurrency)

    res.json({ User, UserAccount, balanceInUsd: userBalance });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error, please confirm user exists" });
  }
});

module.exports = authRouter;

// 	"deploy": https://api.render.com/deploy/srv-cl1hh9rmgg9c738h89k0?key=-DckA4uNEak
