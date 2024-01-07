import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import {
  createPoll,
  getPollById,
  getPollsByMeetId,
  voteForPollById,
} from "./controllers/pollController";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("new-user", async (meetId: string, cb: any) => {
    for (var room in socket.rooms) {
      if (room != socket.id) {
        // don't leave the default room (socket.id)
        socket.leave(room);
      }
    }
    socket.join(meetId);
    const polls = await getPollsByMeetId(meetId);
    cb(polls);
  });
  socket.on(
    "new-poll",
    async ({
      meetId,
      title,
      options,
    }: {
      meetId: string;
      title: string;
      options: string[];
    }) => {
      const poll = await createPoll(meetId, title, options);
      socket.to(meetId).emit("new-poll", poll);
    },
  );
  socket.on("vote", async ({ meetId, pollId, option }) => {
    await voteForPollById(pollId, option);
    const poll = await getPollById(pollId);
    socket.to(meetId).emit("vote", poll);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
