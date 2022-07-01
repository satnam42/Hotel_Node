const encrypt = require("../permit/crypto.js");
const auth = require("../permit/auth");
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongodb").ObjectId

const buildUser = async (model, context) => {
    const { name, email, phoneNo, password, status, role, platform, socialLoginId, deviceToken } = model;
    const log = context.logger.start(`services:users:buildUser${model}`);
    const user = await new db.user({
        name: name,
        email: email,
        phoneNo: phoneNo,
        status: status,
        role: role,
        socialLoginId: socialLoginId,
        platform: platform,
        deviceToken: deviceToken,
        password: password
    }).save();
    log.end();
    return user;
};

const setUser = async (model, user, context) => {
    const log = context.logger.start("services:users:setUser");
    if (model.name !== "string" && model.name !== undefined) {
        user.name = model.name;
    }
    if (model.dob !== "string" && model.dob !== undefined) {
        user.dob = model.dob;
    }
    if (model.phoneNo !== "string" && model.phoneNo !== undefined) {
        user.phoneNo = model.phoneNo;
    }
    if (model.language !== "string" && model.language !== undefined) {
        user.language = model.language;
    }
    if (model.status !== "string" && model.status !== undefined) {
        user.status = model.status;
    }
    if (model.gender !== "string" && model.gender !== undefined) {
        user.gender = model.gender;
    }
    log.end();
    await user.save();
    return user;
};

const create = async (model, context) => {
    const log = context.logger.start("services:users:create");
    // await utility.verifyFCMToken(model.deviceToken)
    let user = await db.user.findOne({ email: model.email });
    if (user) {
        throw new Error(`${model.username} already taken choose another!`);
    } else {
        model.password = encrypt.getHash(model.password, context);
        user = buildUser(model, context);
        log.end();
        return user;
    }
};

const login = async (model, context) => {
    const log = context.logger.start("services:users:login");
    const user = await db.user.findOne({ email: model.email })
    if (!user) {
        log.end();
        throw new Error("user not found");
    }
    if (user.status === 'inactive') {
        throw new Error("user Is inactive please content with admin");
    }
    const isMatched = encrypt.compareHash(model.password, user.password, context);
    if (!isMatched) {
        log.end();
        throw new Error("password mismatch");
    }
    user.deviceToken = model.deviceToken;
    user.updatedOn = new Date();
    await user.save();
    user.token = auth.getToken(user.id, false, context);


    log.end();
    return user;
};

const resetPassword = async (id, model, context) => {
    const log = context.logger.start(`service:users:resetPassword`);
    if (!id) {
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
        throw new Error("user is not found");
    }
    const isMatched = encrypt.compareHash(
        model.oldPassword,
        user.password,
        context
    );
    if (isMatched) {
        const newPassword = encrypt.getHash(model.newPassword, context);
        user.password = newPassword;
        user.updatedOn = new Date();
        await user.save();
        log.end();
        return "Password Updated Successfully";
    } else {
        log.end();
        throw new Error("Old Password Not Match");
    }

};

const update = async (id, model, context) => {
    const log = context.logger.start(`services: users: update`);
    let entity = await db.user.findById(id)
    if (!entity) {
        log.end();
        throw new Error("invalid user");
    }
    const user = await setUser(model, entity, context);
    log.end();
    return user
};

const profile = async (id, context) => {
    const log = context.logger.start(`services: users: profile`);
    if (!id) {
        log.end();
        throw new Error("user id is required");
    }
    const user = await db.user.findById(id)
    return user
};

const search = async (name, context) => {
    const log = context.logger.start(`services:users:search`);
    if (!name) {
        throw new Error("name is required");
    }
    const users = await db.user.find({ name: { "$regex": '.*' + name + '.*', "$options": 'i' } }).limit(5);
    return users
};

const uploadProfilePic = async (id, files, context) => {
    const log = context.logger.start(`services:users:uploadProfilePic`);
    let fileName = files[0].filename.replace(/ /g, '')
    let file = files[0]
    if (!id) {
        throw new Error("user id is required");
    }
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
        throw new Error("user not found");
    }
    if (file == undefined || file.size == undefined || file.size <= 0) throw new Error("image is required");
    if (user.avatar != "") {
        const path = file.destination + '/' + user.avatar
        try {
            fs.unlinkSync(path);
            console.log(`image successfully removed from ${path}`);
        } catch (error) {
            console.error('there was an error to remove image:', error.message);
        }
    }
    user.avatar = fileName
    await user.save()
    log.end();
    return 'image uploaded successfully'

}

const socialLogin = async (model, context) => {
    const log = context.logger.start(`services:users:socialLogin`);
    let user = await db.user.findOne({ socialLoginId: model.socialLoginId });
    if (!user) {
        user = await buildUser(model, context);
        log.end()
    };
    user.token = auth.getToken(user.id, false, context);
    return user
}

const getUsers = async (query, context) => {
    const log = context.logger.start(`services:users:getUsers`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.user.id || context.user._id
    const users = await db.user.find().skip(skipCount).limit(pageSize)
    users.count = await db.user.find().count();
    log.end()
    return users
};

// const myStatistics = async (id, context) => {
//     const log = context.logger.start(`services:users:myStatistics`);
//     if (!id) {
//         throw new Error('user id is required')
//     }

//     const users = await db.user.aggregate([
//         { $match: { gender: query.gender } },
//         { $sample: { size: pageSize } },
//         { $limit: pageSize },
//         { $skip: skipCount }
//     ])

//     users.count = await db.user.find().count();
//     return users
// };

const removeProfilePic = async (id, context) => {
    const log = context.logger.start(`services:users:removeProfilePic`);
    if (!id) {
        throw new Error("user id is required");
    }
    const destination = path.join(__dirname, '../', 'assets/images')
    // /home/satnam/code/amber_nodejs/assets/images
    let user = await db.user.findById(id)
    if (!user) {
        log.end();
        throw new Error("user not found");
    }
    const picLocation = destination + '/' + user.avatar
    fs.unlinkSync(picLocation);
    const images = user.images.filter(obj => obj.name !== user.avatar)
    user.avatar = null
    await user.save()
    log.end();
    return 'image successfully removed'
}


const logout = async (context) => {
    const log = context.logger.start(`services:users:logout`);
    const user = await db.user.findById(context.user.id)
    user.deviceToken = ""
    await user.save()
    log.end()
    return "logout successfully"
};



exports.create = create;
exports.resetPassword = resetPassword;
exports.update = update;
exports.login = login;
exports.profile = profile;
exports.uploadProfilePic = uploadProfilePic;
exports.search = search;
exports.getUsers = getUsers;
// ============follow==============

exports.socialLogin = socialLogin
exports.removeProfilePic = removeProfilePic
exports.logout = logout

