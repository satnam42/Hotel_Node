"use strict";
const service = require("../services/rooms");
const response = require("../exchange/response");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:rooms:add`);
    try {
        const room = await service.add(req.body, req.context);
        const message = "Room Added Successfully";
        log.end();
        return response.success(res, message, room);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getRoomById = async (req, res) => {
    const log = req.context.logger.start(`api:rooms:getRoomById`);
    try {
        const room = await service.getRoomById(req.params.id, req.context);
        const message = "Current Room";
        log.end();
        return response.success(res, message, room);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getRooms = async (req, res) => {
    const log = req.context.logger.start(`api:rooms:getRooms`);
    try {
        const rooms = await service.getRooms(req.context);
        const message = "Room fetched successfully ";
        log.end();
        return response.success(res, message, rooms);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//update room
const update = async (req, res) => {
    const log = req.context.logger.start(`api:rooms:update`);
    try {
        const room = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, room);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//search api
const search = async (req, res) => {

    const log = req.context.logger.start(`api:rooms:search:${req.query}`);
    try {
        const rooms = await service.search(req.query, req.context);
        log.end();
        return response.data(res, rooms);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const uploadImage = async (req, res) => {
    const log = req.context.logger.start(`api:rooms:uploadImage`);
    try {
        const room = await service.imageUpload(req.params.roomId, req.params.type, req.files, req.context);
        log.end();
        return response.data(res, room);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


exports.add = add;
exports.search = search;
exports.getRoomById = getRoomById;
exports.update = update;
exports.uploadImage = uploadImage;
exports.getRooms = getRooms;
