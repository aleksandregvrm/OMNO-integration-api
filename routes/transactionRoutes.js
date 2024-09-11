const {createTransactionSchema,webHookSchema} = require('../models/schemas');
const {createTransaction,handleWebhook} = require("../controllers/transactions");
const authorizationMiddleware = require("../middlewares/userAuthorization");

const webhookOpts = {
  schema: webHookSchema,
  preHandler: authorizationMiddleware,
  handler: handleWebhook,
};

const createTransactionOpts = {
  schema: createTransactionSchema,
  preHandler: authorizationMiddleware,
  handler: createTransaction,
};
// Needs Server Authorization Token

function transactionRoutes(fastify, options, done) {
  fastify.post("/create-transaction", createTransactionOpts);
  
  fastify.post("/webhook", webhookOpts)

  fastify.get("/callback", async (req, reply) => {
    reply.type("text/html").send(`
      <html>
        <body>
          <p>Transaction has been successful...</p>
          <a href="/" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Go to Home</a>
        </body>
      </html>
    `);
  });

  fastify.get("/callbackFail", async (req, reply) => {
    reply.type("text/html").send(`
      <html>
        <body>
          <p>Transaction has failed. Please try again later...</p>
          <a href="/" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #dc3545; text-decoration: none; border-radius: 5px;">Go to Home</a>
        </body>
      </html>
    `);
  });

  done();
}
module.exports = transactionRoutes;
