const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(500).send({ message: "Внутренняя ошибка сервера" })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(500).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(500).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.newAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })

    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(500).send({ message: "Внутренняя ошибка сервера" });
    });
  f;
};

module.exports.newUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(500).send({ message: "Внутренняя ошибка сервера" });
    });
};
