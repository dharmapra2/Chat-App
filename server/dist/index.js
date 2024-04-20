"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const AuthRoutes_js_1 = __importDefault(require("./Routes/AuthRoutes.js"));
const connection_js_1 = __importDefault(require("./Config/connection.js"));
dotenv_1.default.config();
/* declearing port */
const PORT = process.env.HOST_PORT || 4000;
(async () => {
    const app = (0, express_1.default)();
    mongoose_1.default.set("strictQuery", true);
    // Allow requests from client-side http://localhost:3000
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    /* bodyParser.json() or express.json() is used for add the built-in JSON body parser to properly add the "body" property to the request object. */
    app.use(express_1.default.json({ limit: "30mb" }));
    app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
    /* connecting to mongodb */
    await (0, connection_js_1.default)();
    app.get("/hi", (req, res) => {
        res.json({ msg: "hi" });
    });
    app.use("/auth", AuthRoutes_js_1.default);
    // Error handler middleware
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            // If headers are already sent, pass the error to the default Express error handler
            return next(err);
        }
        return res.status(err?.status || 500).json({
            message: err?.message || "Internal Server Error",
        });
    });
    app.listen(PORT, () => {
        console.log("port is running", PORT);
    });
})();
