const Card = require("../models/card");

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: "Внутренняя ошибка сервера" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
        return;
      }
      res.status(500).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.deleteCard = (req, res) => {
  if (!Card[req.params.id]) {
    res.status(404).send({ message: "Карточка с указанным _id не найдена." });
    return;
  }
  Card.findByIdAndRemove({ _id: req.params.id }).then((card) =>
    res.send({ data: card })
  );
};

module.exports.likeCard = (req, res) => {
  if (!Card[req.params.id]) {
    res.status(404).send({ message: "Карточка с указанным _id не найдена." });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).catch((err) => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при создании карточки.",
      });
      return;
    }
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  });
};

module.exports.dislikeCard = (req, res) => {
  if (!Card[req.params.id]) {
    res.status(404).send({ message: "Карточка с указанным _id не найдена." });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).catch((err) => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при создании карточки.",
      });
      return;
    }
    res.status(500).send({ message: "Внутренняя ошибка сервера" });
  });
};
