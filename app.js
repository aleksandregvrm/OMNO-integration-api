require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUi = require("@fastify/swagger-ui");
const PORT = 5002;

// Cors
fastify.register(require("@fastify/cors"), {
  origin: "*",
});
// Cors End

// Swagger
const { swaggerOptions } = require("./utils/utils");

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);
// Swagger End

// Home Page
fastify.get("/", {
  schema: {
    tags: ["Default"],
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: (req, res) => {
    res.send({
      message: "This is a Payments Integration server to the OMNO API",
    });
  },
});
// Home Page End

// Routes
const authorizationRoutes = require("./routes/authorizationRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");

fastify.register(authenticationRoutes);
fastify.register(authorizationRoutes);
fastify.register(transactionRoutes);
// Routes End

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || PORT, host: "0.0.0.0" });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();
