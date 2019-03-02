const jwt = require("jsonwebtoken");
let token = jwt.sign({
    name: 'moleculer-microservice'
}, 'jwt-moleculer-microservice-secret-token')
console.log('token: ', token)