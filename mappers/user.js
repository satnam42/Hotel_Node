"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        id: entity._id,
        name: entity.name,
        email: entity.email,
        gender: entity.gender,
        avatar: entity.avatar ? `${imageUrl}${entity.avatar}` : "",
        phoneNo: entity.phoneNo,
        language: entity.location,
        status: entity.status,
        deviceToken: entity.deviceToken,
        token: entity.token
    };
    // if (entity.images && entity.images.length > 0) {
    //     for (let index = 0; index < entity.images.length; index++) {
    //         entity.images[index].name = `${imageUrl}${entity.images[index].name}`;
    //     }
    //     model.images = entity.images
    // }

    // if (entity.videos && entity.videos.length > 0) {
    //     for (let index = 0; index < entity.videos.length; index++) {
    //         entity.videos[index].name = `${videoUrl}${entity.videos[index].name}`;
    //     }
    //     model.videos = entity.videos
    // }
    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};