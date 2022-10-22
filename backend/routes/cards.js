const router = require('express').Router();

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard
} = require('../controllers/card');

const { validateCreateCard, validateCardId } = require('../middleware/validator');

// route definitions
router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCardById);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
