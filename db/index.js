require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.URI;
mongoose
  .connect(db.url, { connectTimeoutMS: 30000 })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// models
db.UserModel = require("./models/user.js")(mongoose);
db.ConversionModel = require("./models/conversion.js")(mongoose);
db.TransactionModel = require("./models/transaction.js")(mongoose);
db.AccountModel = require("./models/account.js")(mongoose);

module.exports = db;
