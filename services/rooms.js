
const fs = require('fs');
const moment = require('moment');
const ObjectId = require("mongodb").ObjectId

const setRoom = async (model, room, context) => {
    const log = context.logger.start("services:rooms:setStore");

    if (model.number !== "string" && model.number !== undefined) {
        room.number = model.number;
    }

    if (model.maxGuests !== "string" && model.maxGuests !== undefined) {
        room.maxGuests = model.maxGuests;
    }

    if (model.price !== "string" && model.price !== undefined) {
        room.price = model.price;
    }


    room.updatedAt = Date.now()
    await room.save();
    log.end();
    return room;
};

//add room

const buildRoom = async (model, context) => {
    const { hotelId, number, price, maxGuests, } = model;
    const log = context.logger.start(`services:rooms:buildRoom${model}`);
    const room = await new db.room({
        hotel: hotelId,
        number: number,
        price: price,
        maxGuests: maxGuests,
    }).save();
    log.end();
    return room;
};

const add = async (model, context) => {
    const log = context.logger.start("services:rooms:add");
    let room = await db.room.findOne({ hotel: model.hotelId, number: model.number });
    if (room) {
        throw new Error("room already exists");
    }
    room = buildRoom(model, context);
    if (room) {
        let hotel = await db.hotel.findById(model.hotelId)
        if (hotel.rooms && hotel.rooms.length > 1) {
            let isRoomExist = hotel.rooms.some(id => id == room._id); // returns true
            if (!isRoomExist) {
                hotel.rooms.push(room._id)
            }
        }
        else {
            hotel.rooms[room._id]
        }
        await hotel.save()
    }

    log.end();
    return room;
};


const getRoomById = async (id, context) => {
    const log = context.logger.start(`services:rooms:getRoomById`);
    if (!id) {
        throw new Error("room id is required");
    }
    let room = await db.room.findById(id)
    if (!room) {
        throw new Error("room not found");
    }
    log.end();
    return room;
};

const getRooms = async (context) => {
    const log = context.logger.start(`services:rooms:getRooms`);
    let rooms = await db.room.find()
    log.end();
    return rooms;
};

const update = async (id, model, context) => {
    const log = context.logger.start(`services:rooms:update`);
    let entity = await db.room.findById(id)
    if (!entity) {
        throw new Error("invalid room");
    }
    const room = await setRoom(model, entity, context);
    log.end();
    return room
};

const search = async (query, context) => {
    const log = context.logger.start(`services:rooms:search`);
    // if (!name) {
    //     throw new Error("name is required");
    // }

    let start = moment(query.checkIn).endOf('day').format('YYYY-MM-DD')
    let end = moment(query.checkOut).endOf('day').format('YYYY-MM-DD')

    // let d = start + 'T00:00:00.000Z'
    // let e = end + 'T00:00:00.000Z'
    // newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd 
    const rooms = await db.room.find(
        {
            maxGuests: { $gte: Number(query.guests) },
            bookings: {
                $not: {
                    $elemMatch: {
                        bookingStart: { $gte: start, $lt: end }
                    }
                }
            },
        }).populate("hotel")
    return rooms
};

const imageUpload = async (id, type, files, context) => {
    const log = context.logger.start(`services:rooms:imageUpload`);
    if (!id) {
        throw new Error("room id is required");
    }
    let room = await db.room.findById(id)
    if (!room) {
        throw new Error("room not found");
    }
    if (files == undefined && files.length < 0) throw new Error("image is required");
    for (const file of files) {
        let fileName = file.filename.replace(/ /g, '')
        room.gallery.push({ name: fileName })
    }
    await room.save()

    log.end();
    return 'image uploaded successfully'
};

exports.add = add;
exports.search = search;
exports.getRoomById = getRoomById;
exports.getRooms = getRooms;
exports.update = update;
exports.imageUpload = imageUpload;

