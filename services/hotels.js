
const fs = require('fs');
const ObjectId = require("mongodb").ObjectId
const setHotel = async (model, hotel, context) => {
    const log = context.logger.start("services:hotels:setStore");

    if (model.name !== "string" && model.name !== undefined) {
        hotel.name = model.name;
    }
    if (model.description !== "string" && model.description !== undefined) {
        hotel.description = model.description;
    }

    if (model.discount !== "string" && model.discount !== undefined) {
        hotel.discount = model.discount;
    }

    if (model.price !== "string" && model.price !== undefined) {
        hotel.price = model.price;
    }
    if (model.rooms !== "string" && model.rooms !== undefined) {
        hotel.rooms = model.rooms;
    }
    if (model.tax !== "string" && model.tax !== undefined) {
        hotel.tax = model.tax;
    }
    if (model.isParkingAvailable && model.isParkingAvailable !== undefined) {
        hotel.isParkingAvailable = model.isParkingAvailable;
    }
    if (model.isFreeCancellation && model.isFreeCancellation !== undefined) {
        hotel.isFreeCancellation = model.isFreeCancellation;
    }
    if (model.isMealAvailable && model.isMealAvailable !== undefined) {
        hotel.isMealAvailable = model.isMealAvailable;
    }
    if (model.isWifiAvailable && model.isWifiAvailable !== undefined) {
        hotel.isWifiAvailable = model.isWifiAvailable;
    }
    if (model.isPetAllow && model.isPetAllow !== undefined) {
        hotel.isPetAllow = model.isPetAllow;
    }
    if (model.paymentMode !== "string" && model.paymentMode !== undefined) {
        hotel.paymentMode = model.paymentMode;
    }
    if (model.location !== "string" && model.location !== undefined) {
        hotel.location = model.location;
    }
    if (model.isOnDiscount && model.location !== undefined) {
        hotel.isOnDiscount = model.isOnDiscount;
    }

    hotel.updatedAt = Date.now()
    await hotel.save();
    log.end();
    return hotel;
};

//add hotel

const buildHotel = async (model, context) => {
    const { name, description, rooms, paymentMode, isMealAvailable, isPetAllow, tax, isWifiAvailable, isParkingAvailable, isFreeCancellation, price, isOnDiscount, location, discount, feature, } = model;
    const log = context.logger.start(`services:hotels:buildHotel${model}`);
    const hotel = await new db.hotel({
        name: name,
        description: description,
        price: price,
        feature: feature,
        location: location,
        tax: tax,
        isOnDiscount: isOnDiscount,
        discount: discount,
        paymentMode: paymentMode,
        isFreeCancellation: isFreeCancellation,
        isParkingAvailable: isParkingAvailable,
        isMealAvailable: isMealAvailable,
        isWifiAvailable: isWifiAvailable,
        isPetAllow: isPetAllow,
        rooms: rooms
    }).save();
    log.end();
    return hotel;
};

const add = async (model, context) => {
    const log = context.logger.start("services:hotels:add");
    let hotel = await db.hotel.findOne({ name: model.name, description: model.description });
    if (hotel) {
        throw new Error("hotel already exists");
    }
    hotel = buildHotel(model, context);
    log.end();
    return hotel;
};


const getHotelById = async (id, context) => {
    const log = context.logger.start(`services:hotels:getHotelById`);
    if (!id) {
        throw new Error("hotel id is required");
    }
    let hotel = await db.hotel.findById(id)
    if (!hotel) {
        throw new Error("hotel not found");
    }
    log.end();
    return hotel;
};
// const getSimilarHotel = async (categoryId, context) => {
//     const log = context.logger.start(`services:hotels:getSimilarHotel`);
//     if (!categoryId) {
//         throw new Error("categoryId  is required");
//     }
//     let hotel = await db.hotel.find({ category: categoryId })
//     if (!hotel) {
//         throw new Error("hotel not found");
//     }
//     log.end();
//     return hotel;
// };

const getHotels = async (context) => {
    const log = context.logger.start(`services:hotels:getHotels`);
    let hotels = await db.hotel.find()
    // if (!hotel) {
    //     throw new Error("hotel not found");
    // }
    log.end();
    return hotels;
};
const hotelsByFilter = async (context, query) => {
    const log = context.logger.start(`services:hotels:hotelsByFilter`);
    // let pageNo = Number(query.pageNo) || 1;
    // let pageSize = Number(query.pageSize) || 10;
    // let skipCount = pageSize * (pageNo - 1);
    let filter = {}
    filter["$and"] = [];
    //   use or opreater for if all filter is not required 
    if (query.priceFrom !== undefined && query.priceTo !== undefined) {
        filter["$and"].push({ $and: [{ price: { $gte: query.priceFrom } }, { price: { $lte: query.priceTo } }] });
    }
    else if (query.isMealAvailable) {
        filter["$and"].push({ isMealAvailable: query.isMealAvailable });
    }
    else if (query.isWifiAvailable) {
        filter["$and"].push({ isWifiAvailable: query.isWifiAvailable });
    }
    else if (query.isParkingAvailable) {
        filter["$and"].push({ isParkingAvailable: query.isParkingAvailable });
    }
    else if (query.isPetAllow) {
        filter["$and"].push({ isPetAllow: query.isPetAllow });
    }
    else if (query.isFreeCancellation) {
        filter["$and"].push({ isFreeCancellation: query.isFreeCancellation });
    }
    else if (query.paymentMode) {
        filter["$and"].push({ paymentMode: query.paymentMode });
    }
    else if (query.rating !== undefined) {
        filter["$and"].push({ overAllRating: { $lte: query.rating } });
    }

    else if (query.lat & query.long) {
        filter["$and"].push({
            "location": {
                $near: {
                    $geometry:
                        { type: "Point", coordinates: [Number(query.lat), Number(query.long)] }, $maxDistance: 1000 * query.distance // 10 kilometer
                }
            }

        })
    }


    else {
        throw new Error('At least one filter is required')
    }
    const hotels = await db.hotel.find(filter)
    // if (!hotel) {
    //     throw new Error("hotel not found");
    // }
    log.end();
    return hotels;
};

const update = async (id, model, context) => {
    const log = context.logger.start(`services:hotels:update`);
    let entity = await db.hotel.findById(id)
    if (!entity) {
        throw new Error("invalid hotel");
    }
    const hotel = await setHotel(model, entity, context);
    log.end();
    return hotel
};

const search = async (name, context) => {
    const log = context.logger.start(`services:hotels:search`);
    if (!name) {
        throw new Error("name is required");
    }

    let filter = {}
    filter["$and"] = [];
    //   use or opreater for if all filter is not required 
    if (query.priceFrom !== undefined && query.priceTo !== undefined) {
        filter["$and"].push({ $and: [{ price: { $gte: query.priceFrom } }, { price: { $lte: query.priceTo } }] });
    }
    else if (query.isMealAvailable) {
        filter["$and"].push({ isMealAvailable: query.isMealAvailable });
    }
    else if (query.isWifiAvailable) {
        filter["$and"].push({ isWifiAvailable: query.isWifiAvailable });
    }
    else if (query.isParkingAvailable) {
        filter["$and"].push({ isParkingAvailable: query.isParkingAvailable });
    }
    else if (query.isPetAllow) {
        filter["$and"].push({ isPetAllow: query.isPetAllow });
    }
    else if (query.isFreeCancellation) {
        filter["$and"].push({ isFreeCancellation: query.isFreeCancellation });
    }
    else if (query.paymentMode) {
        filter["$and"].push({ paymentMode: query.paymentMode });
    }
    else if (query.rating !== undefined) {
        filter["$and"].push({ overAllRating: { $lte: query.rating } });
    }
    const hotels = await db.hotel.find({ name: { "$regex": '.*' + name + '.*', "$options": 'i' } }).limit(5);
    return hotels
};

const imageUpload = async (id, type, files, context) => {
    const log = context.logger.start(`services:hotels:imageUpload`);
    if (!id) {
        throw new Error("hotel id is required");
    }
    let hotel = await db.hotel.findById(id)
    if (!hotel) {
        throw new Error("hotel not found");
    }
    if (type === 'gallery') {
        if (files == undefined && files.length < 0) throw new Error("image is required");
        for (const file of files) {
            let fileName = file.filename.replace(/ /g, '')
            hotel.gallery.push({ name: fileName })
        }
        await hotel.save()
    }
    else if (type === 'banner') {
        let fileName = files[0].filename.replace(/ /g, '')
        if (files == undefined && files.length < 0) throw new Error("image is required");
        if (hotel.banner != "") {
            const path = files[0].destination + '/' + hotel.banner
            try {
                fs.unlinkSync(path);
                console.log(`image successfully removed from ${path}`);
            } catch (error) {
                console.error('there was an error to remove image:', error.message);
            }
        }
        hotel.banner = fileName
        await hotel.save()

    }
    else {
        throw new Error("type is required");
    }
    log.end();
    return 'image uploaded successfully'
};
// const buildFav = async (model, context) => {
//     const { userId, hotelId } = model;
//     const log = context.logger.start(`services:hotels:buildFav${model}`);
//     const favourite = await new db.favourite({
//         user: userId,
//         hotel: hotelId,
//     }).save();
//     log.end();
//     return favourite;
// };

// const makeFavOrUnFav = async (model, context) => {
//     const log = context.logger.start("services:hotels:makeFavOrUnFav");

//     if (model.userId == "" || model.hotelId == "" || model.userId == undefined || model.hotelId == undefined) {
//         throw new Error('hotel id and user id is required')
//     }
//     let favourite = await db.favourite.findOne({ $and: [{ user: model.userId }, { hotel: model.hotelId }] })
//     if (favourite) {
//         favourite = await db.favourite.deleteOne({ _id: favourite.id })
//         if (favourite.deletedCount == 0) {
//             throw new Error('something went wrong')
//         }
//         log.end();
//         return 'unfav successfully';
//     } else {
//         favourite = buildFav(model, context);
//         log.end();
//         return 'fav successfully';
//     }

// };
// const getFavHotels = async (id, context) => {
//     const log = context.logger.start("services:hotels:makeFavOrUnFav");
//     if (!id) {
//         throw new Error(' user id is required')
//     }
//     let favourites = await db.favourite.find({ user: id }).populate('hotel')
//     log.end();
//     return favourites;

// };
// const getHotelByStoreId = async (id, context) => {
//     const log = context.logger.start("services:hotels:getHotelByStoreId");
//     if (!id) {
//         throw new Error(' store id is required')
//     }
//     let hotels = await db.hotel.find({ store: id }).populate('store')
//     log.end();
//     return hotels;

// };
const ratingReview = async (model, context) => {
    const log = context.logger.start("services:hotels:ratingReview");
    if (!model.hotelId) {
        throw new Error(' hotelId  is required')
    }
    const filter = {
        _id: model.hotelId,
        "rating.userId": { $eq: model.userId }
    }

    let ratingReview = await db.hotel.findOne(filter)

    if (ratingReview != null || ratingReview != undefined) {

        const update = {
            $pull: { rating: { userId: model.userId, } }
        }
        ratingReview = await db.hotel.findOneAndUpdate(filter, update)

        //     $push: { rating: { userId: model.userId, rating: model.rating, customerName: model.customerName, review: model.review } }
        // }
        // ratingReview = await db.hotel.findOneAndUpdate(filter, updated)

    }
    const query = {
        _id: model.hotelId,
    }
    const updated = {
        $push: { rating: { userId: model.userId, rating: model.rating, customerName: model.customerName, review: model.review } }
    }
    ratingReview = await db.hotel.findOneAndUpdate(query, updated)

    let rating = await db.hotel.aggregate([
        { $match: { _id: ObjectId(model.hotelId) } },
        {
            $set: {
                overAllRating: { $avg: "$rating.rating" },
            }
        }
    ])
    if (rating && rating.length > 0) {
        let hotel = await db.hotel.findById(model.hotelId)
        hotel.overAllRating = Math.round(rating[0].overAllRating)
        await hotel.save()
    }

    return ratingReview;

};

exports.add = add;
exports.search = search;
exports.getHotelById = getHotelById;
exports.getHotels = getHotels;
exports.update = update;
exports.imageUpload = imageUpload;
exports.hotelsByFilter = hotelsByFilter;
// exports.makeFavOrUnFav = makeFavOrUnFav;
// exports.getFavHotels = getFavHotels;
// exports.getHotelByStoreId = getHotelByStoreId;
exports.ratingReview = ratingReview;
// exports.getSimilarHotel = getSimilarHotel;