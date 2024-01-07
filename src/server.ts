import http from "http";
import { Server } from "socket.io";
import app from "./app";
import pollSocket from "./sockets/pollSocket";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  pollSocket(socket, io);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
