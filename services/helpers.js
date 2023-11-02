const { UserModel, Settings, AccountModel } = require("../db/index");

async function generateUserId() {
  // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
  const min = 1000000000;
  const max = 9999999999;
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  const codeExists = await UserModel.findOne({ userId: randomCode });
  if (codeExists) {
    return await generateUserId();
  } else {
    return randomCode;
  }
}

async function generateTxnPin() {
  // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
  const min = 1000;
  const max = 9999;
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode;
}

async function createSettings(userId, pin) {
  const newUserSettings = await AccountModel.create({
    userId,
    transactionsPin: pin ? pin : generateTxnPin(),
    prefferedCurrency: "USD",
    balance: 1000000,
  });
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.api_key}/latest/${fromCurrency}`
    );
    const data = await response.json();
    const exchangeRate = data.conversion_rates[toCurrency.toUpperCase()];
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    console.log({convertedAmount})
    return convertedAmount;
  } catch (error) {
    console.error(error);
    throw error; // You can also handle errors in a different way, depending on your use case
  }
}

module.exports = {
  generateUserId,
  createSettings,
  convertCurrency,
};
