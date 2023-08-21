"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModeratorOrAdmin = exports.isAdmin = void 0;
const handle_errors_middleware_1 = require("./handle-errors.middleware");
const roles_enum_helpers_1 = require("../helpers/roles_enum.helpers");
const isAdmin = (req, res, next) => {
    const { role_code } = req.user;
    if (role_code !== roles_enum_helpers_1.ROLES.Admin)
        return (0, handle_errors_middleware_1.notAuth)('Required role Admin', res);
    next();
};
exports.isAdmin = isAdmin;
const isModeratorOrAdmin = (req, res, next) => {
    const { role_code } = req.user;
    if (role_code !== roles_enum_helpers_1.ROLES.Admin && role_code !== roles_enum_helpers_1.ROLES.Moderator)
        return (0, handle_errors_middleware_1.notAuth)('Required role Admin or Moderator', res);
    next();
};
exports.isModeratorOrAdmin = isModeratorOrAdmin;
