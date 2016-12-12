const {MongoClient} = require('mongodb');

// database accessors
const simpleGetters = require('./simple-getters');
const simpleUpdaters = require('./simple-updaters');
const simpleCreators = require('./simple-creators');
const userSpecifics = require('./user-specifics');
const agentSpecifics = require('./agent-specifics');
const agentStats = require('./agent-stats');
const misc = require('./misc');

// config
const MONGO_URL = process.env.MONGO_URL || 'test';

// connect to MongoDB
MongoClient.connect(MONGO_URL, (err, database) => {
  if (err) {
    throw err;
  }

  console.log('connected successfully to MongoDB server');
  onConnected(database);
});

// export everything
function onConnected(db) {
  Object.assign(module.exports, simpleGetters(db));
  Object.assign(module.exports, simpleUpdaters(db));
  Object.assign(module.exports, simpleCreators(db));
  Object.assign(module.exports, userSpecifics(db));
  Object.assign(module.exports, agentSpecifics(db));
  Object.assign(module.exports, agentStats(db));
  Object.assign(module.exports, misc(db));
}

module.exports = {};

// const notifiers = [];
// let startedListening = false;
//
// function notifyChange(topic, data) {
//   if (!topic.includes('add_message:')) {
//     console.log('notifying change:', topic);
//   }
//   notifiers.forEach(notifier => notifier({ topic, data }));
// }
//
// function startListeningActionMessages() {
//   console.log('startListeningActionMessages()');
//   let prevAll = null;
//
//   function getNewOnes(newReqs) {
//     if (!Array.isArray(prevAll)) {
//       return newReqs;
//     }
//
//     const newOnes = [];
//     for (let newReq of newReqs) {
//       if (!prevAll.find(prevReq => prevReq.userId == newReq.userId)) {
//         newOnes.push(newReq);
//       }
//     }
//     return newOnes;
//   }
//
//   function getUpdated(allReqs) {
//     if (!Array.isArray(prevAll)) {
//       return [];
//     }
//
//     const updatedOnes = [];
//     for (let req of allReqs) {
//       if (prevAll.find(prevReq => ('' + prevReq.userId) == ('' + req.userId) && ('' + prevReq.messageText) != ('' + req.messageText))) {
//         updatedOnes.push(req);
//       }
//     }
//     return updatedOnes;
//   }
//
//   async function checkAll() {
//     const allReqs = await getIncomingReqs();
//
//     if (allReqs) {
//       const onlyNewReqs = getNewOnes(allReqs);
//       for (let doc of onlyNewReqs) {
//         notifyChange('add_incoming_req', doc);
//       }
//
//       const updatedReqs = getUpdated(allReqs);
//       for (let doc of updatedReqs) {
//         notifyChange('update_incoming_req:' + doc.userId, doc);
//       }
//
//       // console.log('prevAll', prevAll, 'all=', allReqs, 'onlynew=', onlyNewReqs, 'updatedReqs=', updatedReqs);
//     }
//
//     prevAll = allReqs;
//     setTimeout(function() {
//       checkAll().catch(::console.error);
//     }, 1000);
//   }
//
//   checkAll().catch(::console.error);
// }
//
// function startListeningMessages() {
//   console.log('startListeningMessages()');
//   getMessagesCursor()
//     .on('data', function(doc) {
//       const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
//       notifyChange('add_message:' + userId, doc);
//     })
//     .on('error', function(err) {
//       console.error(err);
//     });
// }
//
// export function addNotifier(cb) {
//   notifiers.push(cb);
//
//   if (!startedListening) {
//     startListeningActionMessages();
//     startListeningMessages();
//     startedListening = true;
//   }
//
//   return () => {
//     const index = notifiers.indexOf(cb);
//     if (index > -1) {
//       notifiers.splice(index, 1);
//     }
//   };
// }
//
// const userWatchers = {};
//
// export function startWatchingUser(userId, topic) {
//   console.log('startWatchingUser', userId, topic);
//
//   if (userWatchers[userId]) {
//     // already watching
//     return;
//   }
//
//   userWatchers[userId] = {};
//
//   function watch() {
//     setTimeout(() => {
//       getUser(userId)
//         .then((userDoc) => {
//           if (userWatchers[userId].lastUserDoc && JSON.stringify(userWatchers[userId].lastUserDoc) != JSON.stringify(userDoc)) {
//             notifyChange(topic, userDoc);
//           }
//           userWatchers[userId].lastUserDoc = userDoc;
//
//           if (userWatchers[userId].DELETE_YOURSELF) {
//             delete userWatchers[userId];
//           } else {
//             watch();
//           }
//         })
//         .catch(::console.error);
//     }, 1000);
//   }
//
//   watch();
// }
//
// export function stopWatchingUser(userId) {
//   console.log('stopWatchingUser', userId);
//
//   if (!userWatchers[userId] || userWatchers[userId].DELETE_YOURSELF) {
//     // not watching or already stopping
//     return;
//   }
//
//   userWatchers[userId].DELETE_YOURSELF = true;
// }
