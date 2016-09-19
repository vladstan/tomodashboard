import pmongo from 'promised-mongo';

let MONGO_URL = 'relaytest';

if (process.env.MONGO_URL) MONGO_URL = process.env.MONGO_URL;

const db = pmongo(MONGO_URL, {
  authMechanism: 'ScramSHA1'
}, ['actionmessages', 'users', 'profiles', 'messages']);

export function getActionMessagesCursor() {
  const options = {tailable: true, awaitdata: true, numberOfRetries: -1};
  return db.actionmessages.find({}, {}, options).sort({$natural: 1});
}

export function getUser(_id) {
  return db.users.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getProfile(_id) {
  return db.profiles.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getProfileOfUser(userId) {
  return db.profiles.find({}).then((profiles) => { // TODO
    return profiles.find(p => ('' + p.userId) === ('' + userId));
  });
}

export function getIncomingReqs() {
  return db.actionmessages.find({}).sort({$natural: 1}).toArray();
}

export function getIncomingReq(_id) {
  return db.actionmessages.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getMessagesCursor() {
  const options = {tailable: true, awaitdata: true, numberOfRetries: -1};
  return db.messages.find({}, {}, options).sort({$natural: 1});
}

export function getMessages() {
  return db.messages.find({}).sort({$natural: 1}).toArray();
}

export function getMessage(_id) {
  return db.messages.findOne({ _id: pmongo.ObjectId(_id) });
}

const notifiers = [];
let startedListening = false;

function notifyChange(topic, data) {
  notifiers.forEach(notifier => notifier({ topic, data }));
}

function startListeningActionMessages() {
  console.log('startListeningActionMessages()');
  getActionMessagesCursor()
    .on('data', function(doc) {
      console.log('notifyChange(\'add_incoming_req\', ' + doc._id + ')');
      notifyChange('add_incoming_req', doc);
    })
    .on('error', function(err) {
      console.error(err);
    });
}

function startListeningMessages() {
  console.log('startListeningMessages()');
  getMessagesCursor()
    .on('data', function(doc) {
      console.log('notifyChange(\'add_message\', ' + doc._id + ')');
      notifyChange('add_message', doc);
    })
    .on('error', function(err) {
      console.error(err);
    });
}

export function addNotifier(cb) {
  notifiers.push(cb);

  if (!startedListening) {
    startListeningActionMessages();
    startListeningMessages();
    startedListening = true;
  }

  return () => {
    const index = notifiers.indexOf(cb);
    if (index !== -1) {
      notifiers.splice(index, 1);
    }
  };
}
