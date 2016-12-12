const {ObjectID} = require('mongodb');

module.exports = function(db) {
  function getProfileOfUser(userId) {
    return db.collection('profiles').find({}).toArray().then((profiles) => { // TODO
      return profiles.find((p) => ('' + p.userId) === ('' + userId));
    });
  }

  function getSessionOfUser(userId) {
    return db.collection('sessions').find({}).toArray().then((sessions) => { // TODO
      return sessions.find((s) => s.userId === userId);
    });
  }

  function switchBotAgent(_id, botMuted) {
    console.log('switchBotAgent(userId, botMuted)', _id, botMuted);
    return db.collection('users').update({ _id: new ObjectID(_id) }, { $set: { botMuted } });
  }

  function updateStripeDetails(_id, stripe) {
    console.log('updateStripeDetails(userId, stripe)', _id, stripe);
    return db.collection('users').update({ _id: new ObjectID(_id) }, { $set: { stripe } });
  }

  async function getMessagesForUser(_idUser) {
    const sessions = await db.collection('sessions').find({}).toArray();
    const session = sessions.find((s) => s.userId === _idUser);
    if (!session || !session.userId) {
      console.error('no session found for user with id', _idUser);
      return [];
    }
    const allMessages = await db.collection('messages').find({}).sort({$natural: 1}).toArray();
    return allMessages.filter((m) => m.sessionId === session._id);
  }

  async function getTripsForUser(_idUser) {
    const allTrips = await db.trips.find({});
    return allTrips.filter((m) => m.userId === _idUser);
  }

  return {
    getProfileOfUser,
    getSessionOfUser,
    switchBotAgent,
    updateStripeDetails,
    getMessagesForUser,
    getTripsForUser,
  };
};
