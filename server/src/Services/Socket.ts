import { Redis } from "ioredis";
import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  private pub: Redis;
  private sub: Redis;
  constructor() {
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
    console.log(`Init Socket Service...`);
    const redisOptions = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      username: process.env.REDIS_USER_NAME || "",
      password: process.env.REDIS_USER_PASSWORD || "",
    };
    this.pub = new Redis(redisOptions);
    this.sub = new Redis(redisOptions);

    this.sub.subscribe("MESSAGES");
  }

  get io() {
    return this._io;
  }
  public initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log(`New socket is connected`, socket?.id);

      socket.on("event:message", async ({ message }: { message: String }) => {
        console.log(`New message rec.:-`, message);
        await this.pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    this.sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
}
export default SocketService;
