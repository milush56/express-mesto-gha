const router = require('express').Router();
const { getUser, getUserId, createUser,newUser,newAvatar } = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', newUser);
router.patch('/me/avatar', newAvatar);


module.exports = router;