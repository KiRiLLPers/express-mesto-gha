const Card = require('../models/card');

const { ErrorNotFound } = require('../errors/errorNotFound');

const { ErrorBadRequest } = require('../errors/errorBadRequest');

const { ErrorValidation } = require('../errors/errorValidation');

const { ErrorForbidden } = require('../errors/errorForbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  if (!name || !link) {
    next(new ErrorBadRequest('Переданы некорректные данные при создании новой карточки.'));
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new ErrorForbidden('Нельзя удалять чужую карточку!'));
      }
      res.status(200).send({ message: 'Карточка удалена!' });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorNotFound('Карточка с указанным _id не найдена.'));
      }

      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка с указанным _id не найдена.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка с указанным _id не найдена.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => next(err));
};
