import { Client } from "redis-om";
import { getResults, pollSchema, vote } from "../models/Poll";
import redis from "../config/redisConfig";

let client;
(async () => {
  await redis.connect();
  client = await new Client().use(redis);
})();

const getPollRepository = async () => {
  return client.fetchRepository(pollSchema);
};

export const createPoll = async (meetId, title, options) => {
  const pollRepository = await getPollRepository();
  const poll = pollRepository.createEntity({ meetId, title, options });
  await pollRepository.save(poll);
  return poll;
};

export const getPollsByMeetId = async (meetId) => {
  const pollRepository = await getPollRepository();
  await pollRepository.createIndex();
  const polls = await pollRepository
    .search()
    .where("meetId")
    .equals(meetId)
    .return.all();
  const results = await Promise.all(
    polls.map(async (poll) => {
      const result = await getResults(poll.entityId);
      return { ...poll, result };
    })
  );
  console.log(results);
  return results;
};

export const getPollById = async (id) => {
  const pollRepository = await getPollRepository();
  const poll = await pollRepository.fetch(id);
  const results = await getResults(poll.entityId);
  return { ...poll, results };
};

export const voteForPollById = async (id, option) => {
  vote(id, option);
};
