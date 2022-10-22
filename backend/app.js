const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config({ path: './.env' });

const { PORT = 3000 } = process.env;
const { MONGO_URL = 'mongodb://localhost:27017/aroundb' } = process.env;
const app = express();
const router = require('./routes/index');
const error = require('./middleware/errors');
const { requestLog, errorLog } = require('./middleware/logger');
const limiter = require('./middleware/limiter');

app.use(cors());
app.options('*', cors());

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLog);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(router);

app.use(errorLog);
app.use(errors());
app.use(error);

mongoose.connect(MONGO_URL);

app.listen(PORT);
