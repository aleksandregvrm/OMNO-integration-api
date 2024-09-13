const { retryWithExponentialBackoff } = require("../utils/utils");
const fetchCall = require("../utils/apiCalls");

// Creating Transactions
const createTransaction = async (req, reply) => {
  const transactionInformation = req.body;
  const token = req.headers.authorization;
  // const token = '123'

  // we need to pass an uninvoked function this way for retries to work
  const createTransactionRequest = async () => {
      return await fetchCall(
        process.env.CREATE_TRANSACTION_URL,
        "POST",
        "application/json",
        JSON.stringify(transactionInformation),
        reply, token
      );
      // Here we send out the error instance
  };
  try {
    // This function retries the request the amount of times we write in argument
    const data = await retryWithExponentialBackoff(
      createTransactionRequest,
      3,
      1000
    );
    reply.send(data);
  } catch (error) {
    // We catch and handle the error instance in here
    const statusCode = error.status || 500;
    const message =
      statusCode === 500 ? "Internal Server Error" : error.message;
    reply.status(statusCode).send({
      error: statusCode === 500 ? 500 : error.status,
      message,
    });
  }
};
// Creating Transactions End

// Handling Webhooks
const handleWebhook = async (req, reply) => {
  const { paymentId } = req.body;
  const token = req.headers.authorization;
  try {
    const data = await fetchCall(
      `${process.env.PAYMENT_INFO_URL}/${paymentId}`,
      "GET",
      "application/json",
      '',reply,token
    );
    
    const { status: dataStatus } = data;
    if (dataStatus !== "Created") {
      const { "3dsRedirectUrl": redirectUrl } = data;
      return reply.send({ redirectionUrl: redirectUrl });
    }
    reply.send({ data: data, message: "Transaction has been created" });
  } catch (error) {
    reply.status(500).send({
      error: "Internal Server Error",
      message: error.response?.data.error || error.message,
    });
  }
};
// Handling Webhooks End
module.exports = { createTransaction, handleWebhook };
