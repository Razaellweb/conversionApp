const express = require("express");
const jwt = require("jsonwebtoken");
const {
  ConversionModel,
  AccountModel,
  TransactionModel,
} = require("../db/index");
const CryptoJS = require("crypto-js");
const { convertCurrency } = require("../services/helpers");

let conversionRouter = express.Router();

conversionRouter.post("/convertFiat", async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency, token } = req.body;

    var decodedToken = jwt.verify(token, process.env.secret_key);

    // Check if the token is valid and if the user exists
    const userId = decodedToken.userId;

    const toAmount = await convertCurrency(amount, fromCurrency, toCurrency);

    console.log({ toAmount });

    await ConversionModel.create({
      userId: userId,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: amount,
      toAmount,
    });

    res
      .status(200)
      .json({
        message: " Successful",
        amount,
        fromCurrency,
        toAmount,
        toCurrency,
      });
  } catch (err) {
    res.json({
      err: {
        err,
        message: "err",
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
      userId: userId,
    });
    3;

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

conversionRouter.get("/conversions/getCurrencies", async (req, res) => {
 const allCurrencies = [  "NGN", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"]
  
 res.json({currencies: allCurrencies})
})

module.exports = conversionRouter;
