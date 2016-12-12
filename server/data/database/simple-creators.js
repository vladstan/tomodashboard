module.exports = function(db) {
  const creators = {};
  const models = {
    Trip: 'trips',
    Charge: 'charges',
    AgentCredit: 'agent_credits',
    Summary: 'summaries',
  };

  // generate creators
  for (const [modelName, collectionName] of Object.entries(models)) {
    creators['create' + modelName] = function(_id, values) {
      return db.collection(collectionName).insert(values);
    };
  }

  return creators;
};
