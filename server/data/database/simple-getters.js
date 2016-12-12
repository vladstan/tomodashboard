const {ObjectID} = require('mongodb');

module.exports = function(db) {
  const getters = {};
  const models = {
    Agent: 'agents',
    User: 'users',
    Trip: 'trips',
    Summary: 'summaries',
    Profile: 'profiles',
    Message: 'messages',
    IncomingReq: 'actionmessages', // TODO rename these
  };

  // generate getters
  for (const [modelName, collectionName] of Object.entries(models)) {
    getters['get' + modelName] = function(_id) {
      console.log('trying to create new OID from _id =', _id);
      return db.collection(collectionName).findOne(new ObjectID());
    };
  }

  return getters;
};
