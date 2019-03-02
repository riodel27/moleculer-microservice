"use strict";

const {
    MoleculerClientError
} = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "users",
    mixins: [],

    /**
     * Default settings
     */
    settings: {
        /** Secret for JWT */
        JWT_SECRET: process.env.JWT_SECRET || "jwt-moleculer-microservice-secret-token",

        /** Public fields */
        // fields: ["_id", "username", "email", "bio", "image"],

        /** Validator schema for entity */
        // entityValidator: {
        // 	username: { type: "string", min: 2, pattern: /^[a-zA-Z0-9]+$/ },
        // 	password: { type: "string", min: 6 },
        // 	email: { type: "email" },
        // 	bio: { type: "string", optional: true },
        // 	image: { type: "string", optional: true },
        // }
    },

    /**
     * Actions
     */
    actions: {
        /**
         * Get user by JWT token (for API GW authentication)
         *
         * @actions
         * @param {String} token - JWT token
         *
         * @returns {Object} Resolved user
         */
        resolveToken: {
            params: {
                token: "string"
            },
            handler(ctx) {
                // this.logger.info('resolve token: ', params);
                this.logger.info('resolve token handler function')
                return new this.Promise((resolve, reject) => {
                    this.logger.info('token ', ctx.params.token)
                    this.logger.info('secret ', this.settings.JWT_SECRET)
                    jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
                        if (err)
                            return reject(err);

                        resolve(decoded);
                    });
                })
                // .then(decoded => {
                //     if (decoded.id)
                //     return decoded.id
                // 		// return this.getById(decoded.id);
                // });
            }
        },
    },

    /**
     * Methods
     */
    methods: {
        /**
         * Generate a JWT token from user entity
         *
         * @param {Object} user
         */
        generateJWT(user) {
            const today = new Date();
            const exp = new Date(today);
            exp.setDate(today.getDate() + 60);

            return jwt.sign({
                id: user._id,
                username: user.username,
                exp: Math.floor(exp.getTime() / 1000)
            }, this.settings.JWT_SECRET);
        }
    },

    events: {}
};