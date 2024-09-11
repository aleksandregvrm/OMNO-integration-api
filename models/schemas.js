// Create transaction Schema
const createTransactionSchema = {
  body: {
    type: "object",
    required: [
      "billing",
      "amount",
      "currency",
      "hookUrl",
      "orderId",
      "cardToken",
      "payment3dsType",
      "cardData",
      "merchantInformation",
    ],
    properties: {
      billing: {
        type: "object",
        required: [
          "firstName",
          "lastName",
          "address1",
          "city",
          "state",
          "country",
          "postalCode",
          "phone",
          "email",
          "externalUserId",
        ],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          address1: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
          postalCode: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          externalUserId: { type: "string" },
          dateOfBirth: { type: "string", format: "date" },
        },
      },
      amount: { type: "number" },
      currency: { type: "string" },
      hookUrl: { type: "string", format: "uri" },
      callback: { type: "string", format: "uri" },
      callbackFail: { type: "string", format: "uri" },
      lang: { type: "string" },
      orderId: { type: "string" },
      cardToken: { type: "string" },
      payment3dsType: { type: "string" },
      kycVerified: { type: "boolean" },
      previousPaymentCount: { type: "integer" },
      cardData: {
        type: "object",
        required: [
          "cardNumber",
          "cardHolderName",
          "cardExpiryDate",
          "cardExpiryDate2",
          "cardCvv",
          "browser",
        ],
        properties: {
          cardNumber: { type: "string" },
          cardHolderName: { type: "string" },
          cardExpiryDate: { type: "string" },
          cardExpiryDate2: { type: "string" },
          cardCvv: { type: "string" },
          browser: {
            type: "object",
            required: [
              "colorDepth",
              "userAgent",
              "language",
              "timeZone",
              "screenWidth",
              "javaEnabled",
              "customerIp",
              "screenHeight",
              "windowHeight",
              "timeZoneOffset",
              "windowWidth",
            ],
            properties: {
              colorDepth: { type: "integer" },
              userAgent: { type: "string" },
              language: { type: "string" },
              timeZone: { type: "string" },
              screenWidth: { type: "integer" },
              javaEnabled: { type: "boolean" },
              customerIp: { type: "string", format: "ipv4" },
              screenHeight: { type: "integer" },
              windowHeight: { type: "integer" },
              timeZoneOffset: { type: "integer" },
              windowWidth: { type: "integer" },
            },
          },
        },
      },
      saveCard: { type: "boolean" },
      merchantInformation: {
        type: "object",
        required: [
          "name",
          "merchantName",
          "country",
          "address1",
          "administrativeArea",
          "locality",
          "postalCode",
          "url",
          "customerServicePhoneNumber",
          "categoryCode",
          "noteToBuyer",
        ],
        properties: {
          name: { type: "string" },
          merchantName: { type: "string" },
          country: { type: "string" },
          address1: { type: "string" },
          administrativeArea: { type: "string" },
          locality: { type: "string" },
          postalCode: { type: "string" },
          url: { type: "string", format: "uri" },
          customerServicePhoneNumber: { type: "string" },
          categoryCode: { type: "string" },
          noteToBuyer: { type: "string" },
        },
      },
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
  response: {
    200: {
      type: "object",
      properties: {
        paymentId: { type: "string" },
        paymentUrl: { type: "string" },
        paymentUrlIframeApm: { type: "string" },
      },
    },
  },
};
// Create transaction Schema End

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

module.exports = { createTransactionSchema, webHookSchema };
