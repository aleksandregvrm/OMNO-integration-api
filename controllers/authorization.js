const authorizeUser = async (req, reply) => {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("client_secret", process.env.CLIENT_SECRET);

    const response = await fetch(`${process.env.AUTH_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    if (response.status !== 200) {
      return reply.status(response.status).send({
        error: response.status,
        message: response.statusText,
      });
    }
    const data = await response.json()
    reply.send(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    reply.status(500).send({
      error: "Internal Server Error",
      message: error.response?.data.error || error.message,
    });
  }
};
module.exports = authorizeUser;
