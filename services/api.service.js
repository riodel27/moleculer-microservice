"use strict";

const ApiGateway = require("moleculer-web");
const E = ApiGateway.Errors;


module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			authorization: true,
			authentication: true,
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			]
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		}
	},
	methods: {
		authorize(ctx, route, req, res) {
			// Read the token from header
			let auth = req.headers["authorization"];
			if (auth && auth.startsWith("jwt")) {
				let token = auth.slice(4);
				return this.Promise.resolve(token)
					.then(token => {
						if (token) {
							// Verify JWT token
							return ctx.call("users.resolveToken", {
									token
								})
								.then(decodedId => {
									this.logger.info("Authenticated via JWT");
									this.logger.info("decoded id: ", decodedId);
									return decodedId
								})
								.catch(err => {
									// Ignored because we continue processing if user is not exist
									this.logger.error('jwt authentication error: ', err.message)
									return null;
								});
						}
					})
					.then(response => {
						if (response) {
							this.logger.info('success resolving token')
						} else {
							this.logger.warn('error resolving token')
							return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
						}
					});
			} else {
				// No token
				return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
			}
		}
	}
};