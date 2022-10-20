// models/user.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // every user has a name field, the requirements for which are described below:
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
    minlength: 2, // the minimum length of the name is 2 characters
    maxlength: 30, // the maximum length is 30 characters
  },
  link: {
    type: String,
    required: true,
    validate: { // describe the validate feature
      validator: (v) => { // validator is a data validation feature.
        const reg = /^http[s]?:\/\/(www\.)?(.*)?\/?(.)*/i;
        return (reg.test(v));
      },
      message: 'Sorry. invalid data', // when the validator returns false, this message will be displayed
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  cratedAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
