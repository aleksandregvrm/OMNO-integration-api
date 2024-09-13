const { createJWT } = require("../utils/jwt");
const fetchCall = require("../utils/apiCalls");
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
     const googleData = await fetchCall(
       process.env.GOOGLE_ACCESS_TOKEN_URL,
       "POST",
       "application/json",
       JSON.stringify(data), 
       reply,
       ""
     );

     const { id_token } = googleData;
     const token_info_response = await fetchCall(
       `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`,
       "GET",
       "application/json",
       "",
       reply,
       ""
     );
     const { email, name } = token_info_response;
     const jwtToken = createJWT({ payload: { name, email } });
     reply
       .status(201)
       .send({ message: "User logged in with Google", jwt: jwtToken });
    } catch (error) {
      const statusCode = error.status || 500;
      const message =
        statusCode === 500 ? "Internal Server Error" : error.message;
      reply.status(statusCode).send({
        error: statusCode === 500 ? 500 : error.status,
        message,
      });
    }
}
module.exports = {loginGoogle,callbackGoogle}