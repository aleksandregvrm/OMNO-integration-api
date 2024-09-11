const { retryWithExponentialBackoff } = require("../utils/utils");

// Creating Transactions
const createTransaction = async (req, reply) => {
  const transactionInformation = req.body;
  const token = req.headers.authorization;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transactionInformation),
  };

  // Function to make the API request
  const createTransactionRequest = async () => {
    const response = await fetch(
      `${process.env.CREATE_TRANSACTION_URL}`,
      options
    );
    if(response.status === 401){
      return reply.status(response.status).send({
        error: response.status,
        message: response.statusText,
      });
    }
    // In case we have unauthorized error it will be thrown immediately
    if (!response.ok) {
      const error = new Error(
        response.statusText
      );
      error.status = response.status;
      throw error;
    }
    return response.json();
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
    // We handle the error instance in here
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
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(
      `${process.env.PAYMENT_INFO_URL}/${paymentId}`,
      options
    );
    if (response.status !== 200) {
      reply.status(response.status).send({
        error: response.status,
        message: response.statusText,
      });
    }
    const data = await response.json();
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
