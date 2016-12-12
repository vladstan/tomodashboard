module.exports = function(db) {
  function getIncomingReqs() {
    return db.collection('actionmessages').find().toArray();
  }

  return {
    getIncomingReqs,
  };
};
