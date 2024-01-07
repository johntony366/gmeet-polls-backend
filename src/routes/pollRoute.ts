import { Router } from "express";
import {
  createPoll,
  getPollById,
  voteForPollById,
} from "../controllers/pollController";
const pollRoute = Router();

pollRoute.post("/", createPoll);
pollRoute.get("/:id", getPollById);
pollRoute.patch("/:id/vote", voteForPollById);

export default pollRoute;
