module.exports = (mongoose) => {
    const Account = mongoose.model(
      "Account",
      mongoose.Schema(
        {
          userId: Number,
          balance: Number,
          prefferedCurrency: String,
          transactionsPin: Number,
        },
        { timestamps: true }
      )
    );
  
    return Account;
  };



  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1ODI5MzIzNzgsImlhdCI6MTY5ODg4MzgxNH0.Vd5_GKJXWwPT4nPyyYw70AEj5Vz2oa5VMRFODVODwEI"

  