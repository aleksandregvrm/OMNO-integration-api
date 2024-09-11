const { createJWT } = require("../utils/jwt");
const GOOGLE_OAUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];
let googleCallbackUrl = `${process.env.GOOGLE_CALLBACK_URL}/google/callback`
// This if statement is used if docker container is active the callback url will be changed
if(process.env.DOCKER_CALLBACK){
  googleCallbackUrl = `${process.env.GOOGLE_DOCKER_CALLBACK_URL}/google/callback`
}

const loginGoogle = async (req,reply) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${googleCallbackUrl}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    reply.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
}

const callbackGoogle = async (req,reply) => {
  const { code } = req.query;
    const data = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: googleCallbackUrl,
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error fetching access token: ${response.statusText}`);
      }

      const access_token_data = await response.json();
      const { id_token } = access_token_data;

      const token_info_response = await fetch(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
      );

      if (!token_info_response.ok) {
        throw new Error(
          `Error fetching token info: ${token_info_response.statusText}`
        );
      }

      const token_info_data = await token_info_response.json();
      const { email, name } = token_info_data;

      const jwtToken = createJWT({ payload: { name, email } });
      reply
        .status(201)
        .send({ message: "User logging in with google", jwt: jwtToken });
    } catch (error) {
      console.error("Error fetching access token:", error);
      reply
        .status(500)
        .send({ error: "An error occurred during authentication." });
    }
}
module.exports = {loginGoogle,callbackGoogle}