module.exports = function(db) {
  async function getUsersForAgent(/* _idAgent */) {
    return await db.collection('users').find({}).toArray();
  }

  async function signUpInAgent(fbResp) {
    const existingAgent = await db.collection('agents').findOne({ fbUserId: fbResp.userID });
    if (existingAgent) {
      return existingAgent;
    }

    const newAgentDoc = await db.collection('agents').insert({
      name: fbResp.name,
      email: fbResp.email,
      pictureUrl: fbResp.picture.data.url,
      fbAccessToken: fbResp.accessToken,
      fbUserId: fbResp.userID,
    });

    return newAgentDoc;
  }

  return {
    getUsersForAgent,
    signUpInAgent,
  };
};
