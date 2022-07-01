"use strict";

const fs = require("fs");
const api = require("../api");
const specs = require("../specs");
const permit = require("../permit")
const validator = require("../validators");
const configure = (app, logger) => {
    const log = logger.start("settings:routes:configure");
    app.get("/specs", function (req, res) {
        fs.readFile("./public/specs.html", function (err, data) {
            if (err) {
                return res.json({
                    isSuccess: false,
                    error: err.toString()
                });
            }
            res.contentType("text/html");
            res.send(data);
        });
    });

    app.get("/api/specs", function (req, res) {
        res.contentType("application/json");
        res.send(specs.get());
    });

    //user api's routes //
    app.post("/api/users/create",
        permit.context.builder,
        validator.users.create,
        api.users.create
    );

    app.post(
        "/api/users/login",
        permit.context.builder,
        validator.users.login,
        api.users.login
    );

    app.post(
        "/api/users/socialLogin",
        permit.context.builder,
        validator.users.socialLogin,
        api.users.socialLogin
    );

    app.put(
        "/api/users/resetPassword/:id",
        permit.context.validateToken,
        validator.users.resetPassword,
        api.users.resetPassword
    );

    app.put(
        "/api/users/update/:id",
        permit.context.validateToken,
        api.users.update
    );

    app.get(
        "/api/users/profile/:id",
        permit.context.validateToken,
        api.users.profile
    );

    app.put(
        "/api/users/profileImageUpload/:id",
        permit.context.builder,
        api.users.uploadProfileImage
    );

    app.put(
        "/api/users/removeProfilePic/:id",
        permit.context.validateToken,
        api.users.removeProfilePic
    );

    app.post("/api/hotels/add",
        permit.context.validateToken,
        validator.hotels.create,
        api.hotels.add
    );

    app.put(
        "/api/hotels/update/:id",
        permit.context.validateToken,
        validator.hotels.update,
        api.hotels.update
    );

    app.get(
        "/api/hotels/getHotelById/:id",
        permit.context.builder,
        api.hotels.getHotelById
    );

    app.get(
        "/api/hotels/getHotels",
        permit.context.builder,
        api.hotels.getHotels
    );

    app.get(
        "/api/hotels/byFilter",
        permit.context.builder,
        api.hotels.hotelsByFilter
    );

    // app.post("/api/hotels/makeFavOrUnfav",
    //     permit.context.builder,
    //     api.hotels.favOrUnFav
    // );

    app.post("/api/hotels/ratingReview",
        permit.context.validateToken,
        api.hotels.ratingReview
    );

    // app.get(
    //     "/api/hotels/favList/:id",
    //     permit.context.builder,
    //     api.hotels.favHotels
    // );

    app.get(
        "/api/hotels/search",
        permit.context.validateToken,
        api.hotels.search
    );

    // app.get(
    //     "/api/hotels/similarHotel",
    //     permit.context.validateToken,
    //     api.hotels.getSimilarHotel
    // );

    app.put(
        "/api/hotels/imageUpload/:hotelId/:type",
        permit.context.builder,
        api.hotels.uploadImage
    );

    app.post("/api/rooms/add",
        permit.context.validateToken,
        validator.rooms.create,
        api.rooms.add
    );

    app.put(
        "/api/rooms/update/:id",
        permit.context.validateToken,
        validator.rooms.update,
        api.rooms.update
    );

    app.get(
        "/api/rooms/getRoomById/:id",
        permit.context.builder,
        api.rooms.getRoomById
    );

    app.get(
        "/api/rooms/getRooms",
        permit.context.builder,
        api.rooms.getRooms
    );

    app.get(
        "/api/rooms/search",
        permit.context.builder,
        api.rooms.search
    );

    app.put(
        "/api/rooms/imageUpload/:id",
        permit.context.builder,
        api.rooms.uploadImage
    );
    app.put(
        "/api/bookings/roomById/:id",
        permit.context.builder,
        api.bookings.book
    );
    log.end();
};


exports.configure = configure;