const express = require('express');

const { DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const routerUsers = require('./routes/users');

const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connect = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err.message);
  }
};

connect().then(() => {
  console.log('connected');
});
app.use((req, res, next) => {
  req.user = {
    _id: '64bd459240fd47e06c1f4e95',
  };

  next();
});
app.use(routerUsers);
app.use(routerCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
