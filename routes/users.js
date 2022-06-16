const router = require('express').Router();
const { getUser, getUserId, createUser,newUser,newAvatar } = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/:userId', getUserId);
router.post('/users', createUser);
router.patch('/users/me', newUser);
router.patch('/users/me/avatar', newAvatar);


module.exports = router;