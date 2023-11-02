const express = require("express");
const app = express();
const { json } = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const txnRouter = require("./routes/txns");
const conversionRouter = require("./routes/conversion");

app.use(json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/convert", conversionRouter);
app.use("/txn", txnRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
