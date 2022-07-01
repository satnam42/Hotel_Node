"use strict";
const service = require("../services/users");
const response = require("../exchange/response");
const mapper = require("../mappers/user");

//register api
const create = async (req, res) => {
    const log = req.context.logger.start(`api:users:create`);
    try {
        const user = await service.create(req.body, req.context);
        const message = "User Register Successfully";
        log.end();
        return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//login api
const login = async (req, res) => {
    const log = req.context.logger.start("api:users:login");
    try {
        const user = await service.login(req.body, req.context);
        log.end();
        let message = "login successfully"
        return response.authorized(res, message, mapper.toModel(user), user.token);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

// profile user
const profile = async (req, res) => {
    const log = req.context.logger.start(`api:users:currentUser`);
    try {
        const user = await service.profile(req.params.id, req.context);
        const message = "user Profile";
        log.end();
        return response.success(res, message, mapper.toModel(user));
        // return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

// reset password
const resetPassword = async (req, res) => {
    const log = req.context.logger.start("api:users:resetPassword");
    try {
        const message = await service.resetPassword(req.params.id, req.body, req.context);
        log.end();
        return response.success(res, message);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//update user
const update = async (req, res) => {
    const log = req.context.logger.start(`api:users:update`);
    try {
        const user = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(user));
        // return response.data(res, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const uploadProfileImage = async (req, res) => {
    const log = req.context.logger.start(`api:users:uploadProfileImage`);
    try {
        const image = await service.uploadProfilePic(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, image);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const getUsers = async (req, res) => {
    const log = req.context.logger.start(`api:users:currentUser`);
    try {
        const user = await service.getUsers(req.query, req.context);
        const message = "user  list fetched successfully";
        log.end();
        return response.page(res, user, Number(req.query.pageNo), Number(req.query.pageSize), user.count);
        // return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const socialLogin = async (req, res) => {
    const log = req.context.logger.start(`api:users:socialLogin`);
    try {
        const user = await service.socialLogin(req.body, req.context);
        let message = "login successfully"
        log.end();
        return response.authorized(res, message, user, user.token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const removeProfilePic = async (req, res) => {
    const log = req.context.logger.start(`api:users:removeProfilePic`);
    try {
        const product = await service.removeProfilePic(req.params.id, req.context);
        log.end();
        return response.data(res, product);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



const logout = async (req, res) => {
    const log = req.context.logger.start(`api:users:logout`);
    try {
        const message = await service.logout(req.context);
        log.end();
        return response.data(res, message);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


exports.create = create;
exports.login = login;
exports.resetPassword = resetPassword;
exports.update = update;
exports.profile = profile;
exports.uploadProfileImage = uploadProfileImage;
exports.getUsers = getUsers;
exports.socialLogin = socialLogin;
exports.removeProfilePic = removeProfilePic;
exports.logout = logout;

