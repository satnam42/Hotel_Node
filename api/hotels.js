"use strict";
const service = require("../services/hotels");
const response = require("../exchange/response");
const hotelMapper = require("../mappers/hotel");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:add`);
    try {
        const hotel = await service.add(req.body, req.context);
        const message = "Hotel Added Successfully";
        log.end();
        return response.success(res, message, hotel);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const getHotelById = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:getHotelById`);
    try {
        const hotel = await service.getHotelById(req.params.id, req.context);
        const message = "Current Hotel";
        log.end();
        // return response.success(res, message, storeMapper.toModel(hotel));
        return response.success(res, message, hotelMapper.toModel(hotel));
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
// const getSimilarHotel = async (req, res) => {
//     const log = req.context.logger.start(`api:hotels:getSimilarHotel`);
//     try {
//         const hotel = await service.getSimilarHotel(req.query.id, req.context);
//         const message = "Current Hotel";
//         log.end();
//         // return response.success(res, message, storeMapper.toModel(hotel));
//         return response.success(res, message, hotelMapper.toModel(hotel));
//     } catch (err) {
//         log.error(err);
//         log.end();
//         return response.failure(res, err.message);
//     }
// };
const getHotels = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:getHotels`);
    try {
        const hotels = await service.getHotels(req.context);
        const message = "Hotel fetched successfully ";
        log.end();
        // return response.success(res, message, storeMapper.toModel(hotel));
        return response.success(res, message, hotelMapper.toSearchModel(hotels));
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const hotelsByFilter = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:hotelsByFilter`);
    try {
        const hotels = await service.hotelsByFilter(req.context, req.query);
        const message = "Hotel fetched successfully ";
        log.end();
        // return response.success(res, message, storeMapper.toModel(hotel));
        return response.success(res, message, hotels);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
//update hotel
const update = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:update`);
    try {
        const hotel = await service.update(req.params.id, req.body, req.context);
        log.end();
        // return response.data(res, storeMapper.toModel(hotel));
        return response.data(res, hotel);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
//search api
const search = async (req, res) => {

    const log = req.context.logger.start(`api:hotels:search:${req.query.name}`);
    try {
        const hotels = await service.search(req.query.name, req.context);
        log.end();
        return response.data(res, hotelMapper.toSearchModel(hotels));
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};
const uploadImage = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:uploadImage`);
    try {
        const hotel = await service.imageUpload(req.params.hotelId, req.params.type, req.files, req.context);
        log.end();
        return response.data(res, hotel);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
// const favOrUnFav = async (req, res) => {
//     const log = req.context.logger.start(`api:hotels:favOrUnFav`);
//     try {
//         const fav = await service.makeFavOrUnFav(req.body, req.context);
//         log.end();
//         return response.data(res, fav);
//     } catch (err) {
//         log.error(err);
//         log.end();
//         return response.failure(res, err.message);
//     }
// };
// const favHotels = async (req, res) => {
//     const log = req.context.logger.start(`api:hotels:favHotels`);
//     try {
//         const fav = await service.getFavHotels(req.params.id, req.context);
//         log.end();
//         return response.data(res, fav);
//     } catch (err) {
//         log.error(err);
//         log.end();
//         return response.failure(res, err.message);
//     }
// };


const ratingReview = async (req, res) => {
    const log = req.context.logger.start(`api:hotels:ratingReview`);
    try {
        const hotels = await service.ratingReview(req.body, req.context);
        log.end();
        return response.data(res, hotels);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



exports.add = add;
exports.search = search;
exports.getHotelById = getHotelById;
exports.update = update;
exports.uploadImage = uploadImage;
exports.getHotels = getHotels;
exports.hotelsByFilter = hotelsByFilter;
// exports.favOrUnFav = favOrUnFav;
// exports.favHotels = favHotels;
exports.ratingReview = ratingReview;
// exports.getSimi larHotel = getSimilarHotel;