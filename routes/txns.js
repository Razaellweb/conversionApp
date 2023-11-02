const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, AccountModel, TransactionModel } = require("../db/index");
const CryptoJS = require("crypto-js");
const { convertCurrency } = require("../services/helpers");

let txnRouter = express.Router();

txnRouter.post("/transferFunds", async (req, res) => {
  try {
    const { token, receiverId, amount, currency, pin } = req.body;

    var decodedToken = jwt.verify(token, process.env.secret_key);

    // Check if the token is valid and if the user exists
    const senderUser = await AccountModel.findOne({userId: decodedToken.userId});
    const receiverUser = await AccountModel.findOne({userId: receiverId});

    if (!senderUser || !receiverUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (senderUser.transactionsPin !== pin) {
      return res.status(400).json({ message: "Incorrect Pin" });
    }

    const txnAmount = await convertCurrency(amount, currency, "USD")

    // Check if the sender has enough balance to transfer
    if (senderUser.balance < txnAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update the sender's balance
    senderUser.balance -= txnAmount;
    await senderUser.save();

    // Update the receiver's balance
    receiverUser.balance = ((receiverUser.balance * 1) + (txnAmount * 1));
    await receiverUser.save();

    await TransactionModel.create({
      sender: decodedToken.userId,
      receiver: receiverId,
      amount: amount,
      currency: currency,
    });

    res.status(200).json({ message: "Transfer Successful" });
  } catch (err) {
    res.json({
      err: {
        err,
        message: "Phone number or Email has already been used",
      },
    });
  }
});

txnRouter.get("/getTxns", async (req, res) => {
  try {
    const token = req.body.token;

    var decodedToken = jwt.verify(token, process.env.secret_key);

    // Check if the token is valid and if the user exists
    const userId = decodedToken.userId;

    // Find all transactions where the user is either the sender or receiver
    const userTransactions = await TransactionModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    res.status(200).json(userTransactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = txnRouter;