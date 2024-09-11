const {loginGoogle,callbackGoogle} = require("../controllers/authentication");

const googleLoginOpts = {
  handler:loginGoogle
}
const googleCallbackOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          jwt: { type: "string" },
        },
      },
    },
  },
  handler: callbackGoogle,
};

const authenticationRoutes = (fastify, options, done) => {

  fastify.get("/google-login",googleLoginOpts);

  fastify.get("/google/callback",googleCallbackOpts);
  done()
};
module.exports = authenticationRoutes;
