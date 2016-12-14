const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  pictureUrl: {type: String, required: true},
  fbUserId: {type: String, unique: true, required: true},
});

/**
 * Get the Agent corresponding to the given uid, otherwise create and return it.
 * @return {Promise}
 */
agentSchema.statics.logIn = async function({uid, name, email, pictureUrl}) {
  const existingAgent = await this.findOne({fbUserId: uid});
  if (existingAgent) {
    return existingAgent;
  }

  const newAgent = new this({
    name,
    email,
    pictureUrl,
    fbUserId: uid,
  });

  return await newAgent.save();
};

module.exports = mongoose.model('Agent', agentSchema);
