const router = require('express').Router();

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard
} = require('../controllers/card');

const { validateCreateCard } = require('../middleware/validator');

// route definitions
router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
