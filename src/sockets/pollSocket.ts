const pollSocket = (socket, io) => {
  // Listen for 'vote' events
  socket.on("vote", (pollId, optionId) => {
    // Update the poll in database

    // Then emit an event to all clients with the updated poll
    io.emit("pollUpdated", pollId);
  });
};

export default pollSocket;
