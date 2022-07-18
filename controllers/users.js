const bcrypt = require("bcryptjs");
const User = require("../models/user");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const DEFAULT_CODE = 500;
const NOT_FOUND_CODE = 404;
const ERROR_CODE = 400;
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict");
const BadRequestError = require("../errors/badrequest");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при запросе пользователя"
          )
        );
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new NotFoundError("Пользователь не найден.");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при запросе пользователя"
          )
        );
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Введите верный Email или пароль");
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          "Пользователь с указанным email уже существует"
        );
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      next(err);
    });
};

module.exports.newAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )

    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      next(err);
    });
};

module.exports.newUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден.");
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: "7d" }
      );

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: "Неправильные почта или пароль" });
    });
};
