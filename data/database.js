import pmongo from 'promised-mongo';

let MONGO_URL = 'relaytest';

if (process.env.MONGO_URL) MONGO_URL = process.env.MONGO_URL;

const db = pmongo(MONGO_URL, {
  authMechanism: 'ScramSHA1'
}, ['actionmessages', 'users', 'profiles']);

export function getActionMessagesCursor() {
  const options = {tailable: true, awaitdata: true, numberOfRetries: -1};
  return db.actionmessages.find({}, options).sort({$natural: 1});
}

export function getUser(id) {
  return db.users.findOne({ _id: pmongo.ObjectId(id) });
}

export function getProfile(id) {
  return db.profiles.findOne({ _id: pmongo.ObjectId(id) });
}

export function getProfileOfUser(userId) {
  console.log('prof of user', JSON.stringify({ userId: userId }));
  return db.profiles.findOne({ userId: userId });
}
