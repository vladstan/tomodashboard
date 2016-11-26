import pmongo from 'promised-mongo';

let MONGO_URL = 'relaytest';

if (process.env.MONGO_URL) MONGO_URL = process.env.MONGO_URL;

const db = pmongo(MONGO_URL, {
  authMechanism: 'ScramSHA1'
}, [
  'actionmessages',
  'messages',
  'profiles',
  'sessions',
  'users',
  'agents',
  'summaries',
  'charges',
  'agent_credits',
  'trips',
]);

// export function getActionMessagesCursor() {
//   const options = {tailable: true, awaitdata: true, numberOfRetries: -1};
//   return db.actionmessages.find({}, {}, options).sort({$natural: 1});
// }

export function getUser(_id) {
  return db.users.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getAgent(_id) {
  return db.agents.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getTrip(_id) {
  return db.trips.findOne({ _id: pmongo.ObjectId(_id) });
}

export async function getLastCreditForAgent(_id) {
  const credits = await db.agent_credits.find({}).sort({createdAt: -1});
  // console.log('desc order credits', credits);
  for (const credit of credits) {
    if (credit.agentId == _id) {
      // console.log('found credit for agent:', credit);
      return credit;
    }
  }
  return null;
}

export async function getTotalPaidTripsForAgent(_id) {
  const credits = await db.agent_credits.find({ paid: true });
  return credits.filter(c => c.agentId == _id).length;
}

export async function getTotalUnpaidTripsForAgent(_id) {
  const credits = await db.agent_credits.find({ paid: false });
  return credits.filter(c => c.agentId == _id).length;
}

export async function getTotalUnpaidMoneyForAgent(_id) {
  const credits = await db.agent_credits.find({ paid: false });
  return credits.filter(c => c.agentId == _id).reduce((acc, c) => acc + c.amount, 0);
}

export async function getTotalPaidMoneyForAgent(_id) {
  const credits = await db.agent_credits.find({ paid: true });
  return credits.filter(c => c.agentId == _id).reduce((acc, c) => acc + c.amount, 0);
}

export async function getAveragePayPerTripForAgent(_id) {
  const allCredits = await db.agent_credits.find({ paid: true });
  const credits = allCredits.filter(c => c.agentId == _id);
  const trips = credits.length;
  const sum = credits.reduce((acc, c) => acc + c.amount, 0);
  return trips && (sum / trips) || 0;
}

export function getSummary(_id) {
  // console.log(_id, new Error('track'));
  return db.summaries.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getProfile(_id) {
  return db.profiles.findOne({ _id: pmongo.ObjectId(_id) });
}

export function getProfileOfUser(userId) {
  return db.profiles.find({}).then((profiles) => { // TODO
    return profiles.find(p => ('' + p.userId) === ('' + userId));
  });
}

export function getSessionOfUser(userId) {
  return db.sessions.find({}).then((sessions) => { // TODO
    return sessions.find((s) => s.userId == userId);
  });
}

export function switchBotAgent(_id, botMuted) {
  console.log('switchBotAgent(userId, botMuted)', _id, botMuted);
  return db.users.update({ _id: pmongo.ObjectId(_id) }, { $set: { botMuted } });
}

export function updateStripeDetails(_id, stripe) {
  console.log('updateStripeDetails(userId, stripe)', _id, stripe);
  return db.users.update({ _id: pmongo.ObjectId(_id) }, { $set: { stripe } });
}

export function updateAgent(_id, newFields) {
  console.log('updateAgent(userId, newFields)', _id, newFields);
  return db.agents.update({ _id: pmongo.ObjectId(_id) }, { $set: newFields });
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

export async function getMessagesForUser(_idUser) {
  const sessions = await db.sessions.find({});
  const session = sessions.find((s) => s.userId == _idUser);
  if (!session || !session.userId) {
    console.error('no session found for user with id', _idUser);
    return [];
  }
  const allMessages = await db.messages.find({}).sort({$natural: 1});
  return allMessages.filter(m => m.sessionId == session._id);
}

export async function getTripsForUser(_idUser) {
  const allTrips = await db.trips.find({}).sort({$natural: 1});
  return allTrips.filter(m => m.userId == _idUser);
}

export async function getUsersForAgent(/*_idAgent*/) {
  return await db.users.find({});
}

export function getMessage(_id) {
  return db.messages.findOne({ _id: pmongo.ObjectId(_id) });
}

export async function signUpInAgent(fbResp) {
  const existingAgent = await db.agents.findOne({ fbUserId: fbResp.userID });
  if (existingAgent) {
    return existingAgent;
  }

  const newAgentDoc = await db.agents.insert({
    name: fbResp.name,
    email: fbResp.email,
    pictureUrl: fbResp.picture.data.url,
    fbAccessToken: fbResp.accessToken,
    fbUserId: fbResp.userID,
  });

  return newAgentDoc;
}

export async function insertAndGetSummary(summary) {
  // console.log('db insertAndGetSummary', summary);
  const summaryDoc = await db.summaries.insert({
    fields: summary.fields.map(f => ({
      _id: new pmongo.ObjectId(),
      name: f.name,
      price: parseInt(f.price || '0', 10) || 0,
      segments: parseInt(f.segments || '0', 10) || 0,
      segmentPrice: f.segmentPrice,
    })).filter(f => !!f.name),
    agentCutPercent: summary.agentCutPercent,
    agentId: summary.agentId,
    userId: summary.userId,
  });

  return summaryDoc;
}

export async function createTrip(data) {
  // console.log('db createTrip', data);
  const tripDoc = await db.trips.insert(data);
  return tripDoc;
}

export async function addCharge(charge) {
  // console.log('db addCharge', charge);
  const chargeDoc = await db.charges.insert(charge);
  return chargeDoc;
}

export async function addAgentCredit(agentCredit) {
  // console.log('db addAgentCredit', agentCredit);
  const agentCreditDoc = await db.agent_credits.insert(agentCredit);
  return agentCreditDoc;
}

const notifiers = [];
let startedListening = false;

function notifyChange(topic, data) {
  if (!topic.includes('add_message:')) {
    console.log('notifying change:', topic);
  }
  notifiers.forEach(notifier => notifier({ topic, data }));
}

function startListeningActionMessages() {
  console.log('startListeningActionMessages()');
  let prevAll = null;

  function getNewOnes(newReqs) {
    if (!Array.isArray(prevAll)) {
      return newReqs;
    }

    const newOnes = [];
    for (let newReq of newReqs) {
      if (!prevAll.find(prevReq => prevReq.userId == newReq.userId)) {
        newOnes.push(newReq);
      }
    }
    return newOnes;
  }

  function getUpdated(allReqs) {
    if (!Array.isArray(prevAll)) {
      return [];
    }

    const updatedOnes = [];
    for (let req of allReqs) {
      if (prevAll.find(prevReq => ('' + prevReq.userId) == ('' + req.userId) && ('' + prevReq.messageText) != ('' + req.messageText))) {
        updatedOnes.push(req);
      }
    }
    return updatedOnes;
  }

  async function checkAll() {
    const allReqs = await getIncomingReqs();

    if (allReqs) {
      const onlyNewReqs = getNewOnes(allReqs);
      for (let doc of onlyNewReqs) {
        notifyChange('add_incoming_req', doc);
      }

      const updatedReqs = getUpdated(allReqs);
      for (let doc of updatedReqs) {
        notifyChange('update_incoming_req:' + doc.userId, doc);
      }

      // console.log('prevAll', prevAll, 'all=', allReqs, 'onlynew=', onlyNewReqs, 'updatedReqs=', updatedReqs);
    }

    prevAll = allReqs;
    setTimeout(function() {
      checkAll().catch(::console.error);
    }, 300);
  }

  checkAll().catch(::console.error);
}

function startListeningMessages() {
  console.log('startListeningMessages()');
  getMessagesCursor()
    .on('data', function(doc) {
      const userId = doc.senderType === 'user' ? doc.senderId : doc.receiverId;
      notifyChange('add_message:' + userId, doc);
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

const userWatchers = {};

export function startWatchingUser(userId, topic) {
  console.log('startWatchingUser', userId, topic);

  if (userWatchers[userId]) {
    // already watching
    return;
  }

  userWatchers[userId] = {};

  function watch() {
    setTimeout(() => {
      getUser(userId)
        .then((userDoc) => {
          if (userWatchers[userId].lastUserDoc && JSON.stringify(userWatchers[userId].lastUserDoc) != JSON.stringify(userDoc)) {
            notifyChange(topic, userDoc);
          }
          userWatchers[userId].lastUserDoc = userDoc;

          if (userWatchers[userId].DELETE_YOURSELF) {
            delete userWatchers[userId];
          } else {
            watch();
          }
        })
        .catch(::console.error);
    }, 300);
  }

  watch();
}

export function stopWatchingUser(userId) {
  console.log('stopWatchingUser', userId);

  if (!userWatchers[userId] || userWatchers[userId].DELETE_YOURSELF) {
    // not watching or already stopping
    return;
  }

  userWatchers[userId].DELETE_YOURSELF = true;
}
