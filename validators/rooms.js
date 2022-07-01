"use strict";
const response = require("../exchange/response");

const create = (req, res, next) => {
    const log = req.context.logger.start("validators:rooms:create");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.number) {
        log.end();
        return response.failure(res, "number is required");
    }
    if (!req.body.maxGuests) {
        log.end();
        return response.failure(res, "maxGuests is required");
    }
    if (!req.body.hotelId) {
        log.end();
        return response.failure(res, "hotelId is required");
    }

    log.end();
    return next();
};


const update = (req, res, next) => {
    const log = req.context.logger.start("validators:rooms:update");

    if (!req.body) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.params.id) {
        log.end();
        return response.failure(res, "room id is required");
    }

    log.end();
    return next();
};



exports.create = create;
exports.update = update;