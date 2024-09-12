# This is a Payment Integration API built using Node.js framework - Fastify... ####
 The API is built with fastify, and here we will have a walk through on how to use this API...

## ---- Running the application
 1) git clone, -> npm install, -> create .env(with env variables), -> npm run dev

 2) Go to the https://hub.docker.com/r/aleksandregvrm/omno-node-app and set up docker container that runs on PORT:9000, when you pull the application from the docker hub you need to add one env var for google-login to work. set DOCKER_CALLBACK=true, and set host port to be 9000 (docker run -e DOCKER_CALLBACK=true -p 9000:5002 aleksandregvrm/omno-node-app).
## ---- 

## ---- env
 We have a few env vars in the app create them before running the app!!!
## ---- 

## ---- Folder structure 

### controllers
 Following the general pattern we have controllers for authorization and transactions related endpoints separately in the controllers folder

### routes
 In routes we also have two routes one of the authorizationRoutes that we keep separately from the transactions routes 

### models
 In models folder we have schema.js file which handles all the schemas for our request-response cycle

### middlewares
 In middlewares we have a authorization middleware which makes sure that user is logged in through google

### utils
 In utils we have all the helper functions or objects used in this app
## ----

## ---- Schema
 In the Schema for the transactions we have all the necessary parameters set, in case the client sends incorrect req.body the relevant errors will be triggered, You can view the create transaction schema in "/models/schemas.js"
## ---- 


## ---- Instructions

 1) We need to log in and retrieve the jwt token through GOOGLE auth on endpoint /google-login, we use this token to make post requests to OMNO API.

 2) We need to get the proper OMNO Authorization Token For that we have CLIENT_ID and CLIENT_SECRET, we send a POST request to the /authorization Endpoint to retrieve OMNO Authorization token.

 3) We use required properties in request body to create a transaction POST request to /create-transaction endpoint which itself POST requests on https://api.omno.com/transaction/create.

 4) Upon receiving the the urls, to make sure that transaction has been created we listen to the webhooks with a POST request /webhook endpoint which sends GET request on https://api.omno.com/reporting/payments/${paymentId}.

 5) The client navigates to the PaymentUrl from the response body and fills in the card details. client is then navigated to the relevant callback(/callback) or callbackFail(/callbackFail) page on the server.

 6) We listen to the webhooks url (/webhook) to check the status of the transaction again, this time server sends 3dsRedirectUrl if the transaction has been successful or has failed. client navigates to that url to complete the 3DS process.
 
## ----

## ---- Swagger
 Swagger docs is available on the /docs Endpoint
## ----

## ---- Docker
 Docker repo can be viewed on dockerhub -- https://hub.docker.com/r/aleksandregvrm/omno-node-app. Keep in mind that containerized version of server runs on PORT:9000.

 when you pull the application from the docker hub you need to add one env var for google-login to work. set DOCKER_CALLBACK=true, and set host port to be 9000 (docker run -e DOCKER_CALLBACK=true -p 9000:5002 aleksandregvrm/omno-node-app).
## ---- 