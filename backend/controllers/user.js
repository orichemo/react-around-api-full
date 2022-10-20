// user controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request-error');

const { errorMassage } = require('../helpers/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

// the login request handler
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      console.log(JWT_SECRET);
      return res.send({ user, token });
    })
    .catch(() => {
      next(new UnauthorizedError('Incorrect email or password'));
    });
};

// the createUser request handler
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'The user with the provided email already exist'
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.massage));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (id, res, next) => {
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('No user with matching ID found');
    })
    .then((users) => res.send(users))
    .catch(next);
};

// the getCurrentUser request handler
module.exports.getCurrentUser = (req, res, next) => {
  getUserInfo(req.user._id, res, next);
};

// the getUser request handler
module.exports.getUser = (req, res, next) => {
  getUserInfo(req.params.id, res, next);
};

// the getUserById request handler
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('No user with this id');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => errorMassage(err, res, next));
};

// the updateUserProfile request handler
module.exports.updateUserProfile = (req, res, next) => {
  const {
    user: { _id },
    body,
  } = req;
  User.findByIdAndUpdate(_id, body, {
    new: true, // the then handler receives the updated entry as input
    runValidators: true, // the data will be validated before the update
  })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// the updateUserAvatar request handler
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.status(200).send(user))
    .catch(next);
};
