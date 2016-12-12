const {ObjectID} = require('mongodb');

module.exports = function(db) {
  const updaters = {};
  const models = {
    Agent: 'agents',
    User: 'users',
    Trip: 'trips',
    Profile: 'profiles',
  };

  // generate updaters
  for (const [modelName, collectionName] of Object.entries(models)) {
    updaters['update' + modelName] = function(_id, newValues) {
      return db.collection(collectionName).update(new ObjectID(_id), {$set: newValues});
    };
  }

  return updaters;
};
