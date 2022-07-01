const jwt = require("jsonwebtoken");
const UnAuthError = require("../errors/unauthorized");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnAuthError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new UnAuthError("Необходима авторизация"));
  }

  req.user = payload;
  next();
};
