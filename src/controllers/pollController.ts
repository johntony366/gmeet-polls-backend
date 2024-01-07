import { Client } from "redis-om";
import { getResults, pollSchema, vote } from "../models/Poll";
import redis from "../config/redisConfig";

const getPollRepository = async () => {
  const client = await new Client().use(redis);
  return client.fetchRepository(pollSchema);
};

export const createPoll = async (req, res) => {
  const { title, options } = req.body;
  const pollRepository = await getPollRepository();
  const poll = pollRepository.createEntity({ title, options });
  const id = await pollRepository.save(poll);
  res.json({ id });
};

export const getPollById = async (req, res) => {
  const { id } = req.params;
  const pollRepository = await getPollRepository();
  const poll = await pollRepository.fetch(id);
  const results = await getResults(poll.entityId);
  res.json({ ...poll, results });
};

export const voteForPollById = async (req, res) => {
  const { id } = req.params;
  const { option } = req.body;
  vote(id, option);
};
