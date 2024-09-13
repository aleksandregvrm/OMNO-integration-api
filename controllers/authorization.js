const fetchCall = require("../utils/apiCalls");
const authorizeUser = async (req, reply) => {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("client_secret", process.env.CLIENT_SECRET);
    // Fetch call function is available in apiCalls file
    const data = await fetchCall(
      process.env.AUTH_URL,
      "POST",
      "application/x-www-form-urlencoded",
      formData, reply
    );
    reply.send(data);
  } catch (error) {
    const statusCode = error.status || 500;
    const message =
      statusCode === 500 ? "Internal Server Error" : error.message;
    reply.status(statusCode).send({
      error: statusCode === 500 ? 500 : error.status,
      message,
    });
  }
};
module.exports = authorizeUser;
