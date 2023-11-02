module.exports = (mongoose) => {
  const Transaction = mongoose.model(
    "Transaction",
    mongoose.Schema(
      {
        sender: Number,
        receiver: Number,
        amount: Number,
        sendCurrency: String,
      },
      { timestamps: true }
    )
  );

  return Transaction;
};
