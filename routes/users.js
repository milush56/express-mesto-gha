const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserId,
  newUser,
  newAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUserId,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  newUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/,
      ),
    }),
  }),
  newAvatar,
);

module.exports = router;
