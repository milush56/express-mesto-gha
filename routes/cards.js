const router = require("express").Router();
const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { celebrate, Joi } = require("celebrate");

router.get("/", getCard);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2),
    }),
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().min(2).max(30),
    }),
  }),
  deleteCard
);
router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard
);
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
