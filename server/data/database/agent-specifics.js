module.exports = function(db) {
  async function getUsersForAgent(/* _idAgent */) {
    return await db.collection('users').find({}).toArray();
  }

  async function logInAgent({uid, name, email, pictureUrl}) {
    const existingAgent = await db.collection('agents').findOne({ fbUserId: uid });
    if (existingAgent) {
      return existingAgent;
    }

    const newAgentDoc = await db.collection('agents').insert({
      name,
      email,
      pictureUrl,
      fbUserId: uid,
    });

    return newAgentDoc;
  }

  return {
    getUsersForAgent,
    logInAgent,
  };
};
