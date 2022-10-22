const router = require('express').Router();

const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser
} = require('../controllers/user');

const { validateUpdateProfile, validateUpdateAvatar, validateUserId } = require('../middleware/validator');

// route definitions
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
