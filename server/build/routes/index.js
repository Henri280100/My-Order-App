"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const handle_errors_middleware_1 = require("../middleware/handle-errors.middleware");
const initRoutes = (app) => {
    app.use('/api/v1/auth', auth_1.default);
    app.use('/api/v1/user', user_1.default);
    app.use('/', handle_errors_middleware_1.notFound);
};
exports.default = initRoutes;
