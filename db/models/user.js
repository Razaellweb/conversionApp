module.exports = (mongoose) => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        emailAddress: {
          type: String,
          unique: true, // Make emailAddress field unique
        },
        userId: {
          type: Number,
          unique: true, // Make Id field unique
        },
        password: String,
        firstName: String,
        lastName: String,
        gender: String,
        country: String,
        phoneNumber: {
          type: Number,
          unique: true, // Make phoneNumber field unique
        },
      },
      { timestamps: true }
    )
  );

  return User;
};
