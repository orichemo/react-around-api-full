const router = require('express').Router();

const {
  getUser, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser
} = require('../controllers/user');

const { validateUpdateProfile, validateUpdateAvatar } = require('../middleware/validator');

// route definitions
router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
