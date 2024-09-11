function retryWithExponentialBackoff(fn, maxAttempts = 5, baseDelayMs = 1000) {
  let attempt = 1;

  const execute = async () => {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      const delayMs = baseDelayMs * 1.5 ** attempt;
      console.log(`Retry attempt ${attempt} after ${delayMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      attempt++;
      return execute();
    }
  };

  return execute();
}
// This function executes retry with an exponential delay between each try...

// For Creating swagger UI
const swaggerOptions = {
  swagger: {
    info: {
      title: "OMNO integration API",
      description:
      "1) `/google-login` route and `/google/callback` are used for GOOGLE auth to retrieve jwt token \n\n"+
      "2) We need to get the token on the authorization route, then we create a new transaction `/authorization`\n\n" +
      "3) We use the relevant `req.body` and token to create a transaction `/create-transaction`\n\n" +
      "4) We use `paymentId` and the token to get the status of the transaction on the webhook endpoint `/webhook`\n\n" +
      "5) `/callback` endpoint is used for success callbacks from the OMNO API, while `/callbackFail` is used for failure callbacks.\n\n" , 
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};
// For Creating swagger UI End
module.exports = {retryWithExponentialBackoff,swaggerOptions}