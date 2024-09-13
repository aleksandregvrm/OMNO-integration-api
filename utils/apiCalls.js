// General API call
const fetchCall = async (url, method, contentType, body, reply, token) => {
  try {
    let response;
    // We define if the method is not get we use request body
    if(method !== "GET"){
      response = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": contentType,
          authorization:`Bearer ${token}`
        },
        body: body,
      });
    } else {
      response = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": contentType,
          authorization:`Bearer ${token}`
        },
      });
    }
    // in case we have 401 we throw error right away
    if (response.status === 401) {
      return reply.status(response.status).send({
        error: response.status,
        message: response.statusText,
      });
    }
    // Here we handle the error instance for exponential backoff
    if (response.status !== 200) {
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error; 
  }
};
// General API call End
module.exports = fetchCall
