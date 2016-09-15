import pmongo from 'promised-mongo';

let MONGO_URL = 'relaytest';

if (process.env.MONGO_URL) MONGO_URL = process.env.MONGO_URL;

const db = pmongo(MONGO_URL, {
  authMechanism: 'ScramSHA1'
}, ['actionmessages', 'users', 'profiles']);

export function getActionMessagesCursor() {
  const options = {tailable: true, awaitdata: true, numberOfRetries: -1};
  return db.actionmessages.find({}, {}, options).sort({$natural: 1});
}

export function getUser(id) {
  return db.users.findOne({ _id: pmongo.ObjectId(id) });
}

export function getProfile(id) {
  return db.profiles.findOne({ _id: pmongo.ObjectId(id) });
}

export function getProfileOfUser(userId) {
  return db.profiles.find({}).then((profiles) => { // TODO
    return profiles.find(p => ('' + p.userId) === ('' + userId));
  });
}

export function getIncomingReqs() {
  return db.actionmessages.find({}).sort({$natural: 1}).toArray();
}

export function getIncomingReq(id) {
  return db.actionmessages.findOne({ _id: pmongo.ObjectId(id) });
}

const notifiers = [];
let startedListening = false;

function notifyChange(topic, data) {
  notifiers.forEach(notifier => notifier({ topic, data }));
}

function startListening() {
  console.log('startListening()');
  getActionMessagesCursor()
    .on('data', function(doc) {
      console.log('notifyChange(\'add_incoming_req\', ' + doc._id + ')');
      notifyChange('add_incoming_req', doc);
    })
    .on('error', function(err) {
      console.error(err);
    });
}

export function addNotifier(cb) {
  notifiers.push(cb);

  if (!startedListening) {
    startListening();
    startedListening = true;
  }

  return () => {
    const index = notifiers.indexOf(cb);
    if (index !== -1) {
      notifiers.splice(index, 1);
    }
  };
}
