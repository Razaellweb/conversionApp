const express = require("express");
const jwt = require("jsonwebtoken");
const { ConversionModel, AccountModel, TransactionModel } = require("../db/index");
const CryptoJS = require("crypto-js");
const { convertCurrency } = require("../services/helpers");

let conversionRouter = express.Router();

conversionRouter.post("/convertFiat", async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency, token } = req.body;

    var decodedToken = jwt.verify(token, process.env.secret_key);

    // Check if the token is valid and if the user exists
    const userId = decodedToken.userId;

    const toAmount = await convertCurrency(amount, fromCurrency, toCurrency)

    console.log({toAmount})
   
    await ConversionModel.create({
      userId: userId,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: amount,
      toAmount
    });

    res.status(200).json({ message: " Successful", amount, fromCurrency, toAmount, toCurrency});
  } catch (err) {
    res.json({
      err: {
        err,
        message: "Phone number or Email has already been used",
      },
    });
  }
});

conversionRouter.get("/conversions/:token", async (req, res) => {
    try {
      const token = req.params.token;
  
      var decodedToken = jwt.verify(token, process.env.secret_key);
  
      // Check if the token is valid and if the user exists
      const userId = decodedToken.userId;
  
     const conversions = await ConversionModel.find({
        userId: userId
      });3
  
      res.status(200).json({ conversions: conversions.reverse() });
    } catch (err) {
      res.json({
        err: {
          err,
          message: "Phone number or Email has already been used",
        },
      });
    }
  });

  module.exports = conversionRouter;
