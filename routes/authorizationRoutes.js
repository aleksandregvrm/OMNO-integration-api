const authorizeUser = require("../controllers/authorization");
const authorizationMiddleware = require("../middlewares/userAuthorization")

const authorizationOpts = {
  schema: {
    headers: {
      type: "object",
      properties: {
        "x-local-authorization": { type: "string" },
      },
      required: ["x-local-authorization"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          expires_in: { type: "integer" },
          token_type: { type: "string" },
          "not-before-policy": { type: "integer" },
          scope: { type: "string" },
        },
      },
    },
  },
  preHandler: authorizationMiddleware,
  handler: authorizeUser,
};
// Needs Server Authorization Token

function authorizationRoutes(fastify, options, done) {
  fastify.post("/authorization", authorizationOpts);
  done();
}

module.exports = authorizationRoutes;
