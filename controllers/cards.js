const Card = require('../models/card');

const { MONGO_ID_LENGTH } = require('../consts/consts');

const { ErrorNotFound } = require('../errors/errorNotFound');

const { ErrorBadRequest } = require('../errors/errorBadRequest');

const { ErrorValidation } = require('../errors/errorValidation');

const cardNotFound = new ErrorNotFound();
const cardBadRequest = new ErrorBadRequest();
const cardValidationError = new ErrorValidation();

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    res
      .status(cardBadRequest.statusCode)
      .send({ message: 'Переданы некорректные данные при создании новой карточки.' });
    return;
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(cardValidationError.statusCode)
          .send({ message: err.message });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params.cardId;
  if (cardId.length !== MONGO_ID_LENGTH) {
    res
      .status(cardBadRequest.statusCode)
      .send({ message: 'Некорректный _id' });
    return;
  }
  if (cardId.length === MONGO_ID_LENGTH) {
    Card.findByIdAndRemove(cardId)
      .then((card) => {
        if (!card) {
          res
            .status(cardNotFound.statusCode)
            .send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.status(200).send({ message: 'Карточка удалена!' });
      })
      .catch(() => {
        res
          .status(cardNotFound.statusCode)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      });
  }
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  if (cardId.length !== MONGO_ID_LENGTH) {
    res
      .status(cardBadRequest.statusCode)
      .send({ message: 'Некорректный _id' });
    return;
  }
  if (cardId.length === MONGO_ID_LENGTH) {
    Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res
            .status(cardNotFound.statusCode)
            .send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.status(200).send(card);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  }
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  if (cardId.length !== MONGO_ID_LENGTH) {
    res
      .status(cardBadRequest.statusCode)
      .send({ message: 'Некорректный _id' });
    return;
  }
  if (cardId.length === MONGO_ID_LENGTH) {
    Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res
            .status(cardNotFound.statusCode)
            .send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.status(200).send(card);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  }
};
