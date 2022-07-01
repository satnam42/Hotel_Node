"use strict";
const service = require("../services/bookings");
const response = require("../exchange/response");

const book = async (req, res) => {
    const log = req.context.logger.start(`api:booking:book`);
    try {
        const book = await service.book(req.params.id, req.body, req.context);
        const message = "Room booked Successfully";
        log.end();
        return response.success(res, message, book);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


exports.book = book;

