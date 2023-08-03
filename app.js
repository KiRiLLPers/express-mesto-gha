const express = require('express');

const bodyParser = require('body-parser');

const routerUsers = require('./routes/users');

const routerCards = require('./routes/cards');

const { ErrorNotFound } = require('./errors/errorNotFound');

const { connect } = require('./database/mongo');

const { PORT = 3000 } = process.env;
const app = express();
const errorNotFound = new ErrorNotFound();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.status(errorNotFound.statusCode).send({ message: new ErrorNotFound('Страница не найдена') });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
