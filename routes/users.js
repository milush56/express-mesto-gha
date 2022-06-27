const router = require('express').Router();
const { getUser, getUserId,newUser,newAvatar,getCurrentUser } = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.patch('/me', newUser);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', newAvatar);


module.exports = router;