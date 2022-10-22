const router = require('express').Router();
const { login, createUser } = require('../controllers/user');
const { validateLogin, validateCreateUser } = require('../middleware/validator');
const auth = require('../middleware/auth');
const userRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

// middleware
router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('No page found for the specified route'));
});

module.exports = router;
