const express = require('express');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '64bd459240fd47e06c1f4e95' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(routerUsers);
app.use(routerCards);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

