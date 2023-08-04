const User = require('../models/user');

const { MONGO_ID_LENGTH } = require('../consts/consts');

const { ErrorNotFound } = require('../errors/errorNotFound');

const { ErrorBadRequest } = require('../errors/errorBadRequest');

const { ErrorValidation } = require('../errors/errorValidation');

const userBadRequest = new ErrorBadRequest();
const userValidationError = new ErrorValidation();
const userNotFound = new ErrorNotFound();

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserId = (req, res) => {
  if (req.params.userId.length !== MONGO_ID_LENGTH) {
    res
      .status(userBadRequest.statusCode)
      .send({ message: 'Некорректный _id' });
    return;
  }
  if (req.params.userId.length === MONGO_ID_LENGTH) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          res
            .status(userNotFound.statusCode)
            .send({ message: 'Пользователь по указанному _id не найден.' });
          return;
        }
        res.status(200).send(user);
      })
      .catch(() => {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res
      .status(userBadRequest.statusCode)
      .send({ message: 'Переданы некорректные данные при создании пользователя.' });
    return;
  }
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(userValidationError.statusCode)
          .send({ message: err.message });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res
      .status(userBadRequest.statusCode)
      .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    return;
  }
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res
            .status(userValidationError.statusCode)
            .send({ message: err.message });
        } else {
          res
            .status(userNotFound.statusCode)
            .send({ message: 'Пользователь по указанному _id не найден.' });
        }
      });
  } else {
    res
      .status(500)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res
      .status(userBadRequest.statusCode)
      .send({ message: 'Переданы некорректные данные при обновлении Аватара.' });
  }
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res
            .status(userValidationError.statusCode)
            .send({ message: err.message });
        } else {
          res
            .status(userNotFound.statusCode)
            .send({ message: 'Пользователь по указанному _id не найден.' });
        }
      });
  } else res.status(500).send({ message: 'На сервере произошла ошибка' });
};
