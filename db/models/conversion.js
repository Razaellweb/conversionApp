module.exports = (mongoose) => {
  const Conversion = mongoose.model(
    "Conversions",
    mongoose.Schema(
      {
        userId: {
          type: Number,
        },
        fromCurrency: String,
        toCurrency: String,
        fromAmount: Number,
        toAmount: Number,
      },
      { timestamps: true }
    )
  );

  return Conversion;
};
