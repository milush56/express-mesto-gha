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
router.get("/me", getCurrentUser);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUserId
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  newUser
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]{2,}#?$/
      ),
    }),
  }),
  newAvatar
);

module.exports = router;
