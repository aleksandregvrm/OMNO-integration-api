const {verifyJWT} = require("../utils/jwt");

const authorizationMiddleware = (req,reply,done) => {
  const token = req.headers['x-local-authorization'];
  console.log(token);
  const payload = verifyJWT(token);
  if(!payload){
    return reply.status(401).send({
      error: "Unauthorized Error",
      message: "You are not authorized to access this route",
    });
  }
  req.user = payload;
  done()
}

module.exports = authorizationMiddleware