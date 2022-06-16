const path = require('path');
const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '62a99394dad416f9d4433985'
  };

  next();
});
// подключаем мидлвары, роуты и всё остальное...
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));



app.listen(3000);