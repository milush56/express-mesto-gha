const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const DEFAULT_CODE = 500;
const NOT_FOUND_CODE = 404;
const ERROR_CODE = 400;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при запросе пользователя",
        });
        return;
      }
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при запросе пользователя",
        });
        return;
      }
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.newAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )

    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.newUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }
      res.status(DEFAULT_CODE).send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: 'd285e3dceed844f902650f40' },
        "some-secret-key",
        { expiresIn: '7d' }
      );

      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res.status(401).send({ message: 'Неправильные почта или пароль' });
    });
};
