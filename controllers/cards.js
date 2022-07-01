const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/badrequest");
const ForbiddenError = require("../errors/forbidden");

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError("Доступ запрещен.");
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при удалении карточки."
          )
        );
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
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
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
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      }
      next(err);
    });
};
