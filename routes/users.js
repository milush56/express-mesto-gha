const router = require("express").Router();
const {
  getUser,
  getUserId,
  newUser,
  newAvatar,
  getCurrentUser,
} = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");

router.get("/", getUser);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserId
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2),
    }),
  }),
  newUser
);
router.get("/me", getCurrentUser);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-_~:/?#[]@!$&'()*,;=]*)*\/?$/),
    }),
  }),
  newAvatar
);

module.exports = router;
