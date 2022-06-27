const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const { createUser, login } = require('../controllers/users');
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', (req, res) => {
  res.status(404).send({ message: "Страница не найдена"});
});




app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});