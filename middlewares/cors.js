const allowedCors = [
  "https://api.testo-mesto.nomoredomains.xyz",
  "http://api.testo-mesto.nomoredomains.xyz",
  "https://testo-mesto.nomorepartiesxyz.ru",
  "http://testo-mesto.nomorepartiesxyz.ru",
  "http://localhost:3000",
];

module.exports = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers["access-control-request-headers"];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }

  next();
});
