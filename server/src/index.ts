import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoutes from "./Routes/AuthRoutes.js";
import connectMongodb from "./Config/connection.js";

dotenv.config();
/* declearing port */
const PORT = process.env.HOST_PORT || 4000;

(async () => {
  const app: Express = express();

  mongoose.set("strictQuery", true);
  // Allow requests from client-side http://localhost:3000
  app.use(
    cors({
      origin: "*",
    })
  );

  /* bodyParser.json() or express.json() is used for add the built-in JSON body parser to properly add the "body" property to the request object. */
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb", extended: true }));

  /* connecting to mongodb */
  await connectMongodb();

  app.get("/hi", (req, res) => {
    res.json({ msg: "hi" });
  });

  app.use("/auth", AuthRoutes);

  // Error handler middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
