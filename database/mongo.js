const mongoose = require('mongoose');

const { DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports.connect = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err.message);
  }
};
