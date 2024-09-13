// Web hooks Schema
const webHookSchema = {
  body: {
    type: "object",
    required: ["paymentId"],
    properties: {
      paymentId: { type: "string" },
    },
  },
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string" },
      "x-local-authorization": { type: "string" },
    },
    required: ["authorization", "x-local-authorization"],
  },
};
// Web hooks Schema End

module.exports = webHookSchema;
