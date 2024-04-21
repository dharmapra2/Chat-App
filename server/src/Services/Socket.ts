import { Server } from "socket.io";
class SocketService {
  private _io: Server;
  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    console.log(`Init Socket Service...`);
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
      });
    });
  }
}
export default SocketService;
