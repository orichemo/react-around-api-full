const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

require('dotenv').config({ path: './.env' });

const { PORT = 3000 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/user');
const { validateLogin, validateCreateUser } = require('./middleware/validator');
const auth = require('./middleware/auth');
const error = require('./middleware/errors');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/not-found-error');
const { requestLog, errorLog } = require('./middleware/logger');

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// middleware
app.use(auth);
app.use(requestLog);
app.use(errorLog);
app.use(errors());
app.use(error);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('No page found for the specified route'));
});

mongoose.connect('mongodb://localhost:27017/aroundb');

app.listen(PORT);
