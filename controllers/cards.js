const Card = require("../models/card");
const DEFAULT_CODE = 500;
const NOT_FOUND_CODE = 404;
const ERROR_CODE = 400;
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict');
const BadRequestError = require('../errors/badrequest');
const ForbiddenError = require('../errors/forbidden');
const UnAuthError = require('../errors/unauthorized');


module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при удалении карточки."
        });
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при удалении карточки."
        });
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при удалении карточки."
        });
        return;
      }
      next(err);
    });
};
