const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    let token = bearer[1];

    try {
      let decoded = jwt.verify(token, process.env.SECRET);

        next();
    } catch (err) {
      console.log(err);
      res.status(403);
      res.json({ err: "Nao altenticado" });
      return;
    }
  } else {
    res.status(403);
    res.json({ err: "Nao altenticado" });
  }
};
