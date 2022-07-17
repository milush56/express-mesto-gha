const bcrypt = require("bcryptjs");
const express = require("express");
const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corps = require('./middlewares/corps');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(corps);

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use("/", require("./routes/registration"));

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
