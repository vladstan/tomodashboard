const {graphql} = require('graphql');
const {graphqlSubscribe} = require('graphql-relay-subscription');

const db = require('../data/database');
const schema = require('../data/schema');

const SUBSCRIPTIONS_BY_TOPIC = new Map(); // topicName -> [subscriptionObj]
const UNSUBSCRIBERS_BY_SUBID = new Map(); // subscriptionId -> unsubscribeFn

class SubscriptionsManager {

  constructor(socket) {
    this.socket = socket;

    // init
    this.disconnected = false;

    // internal lists of subscriptions and topics
    this.topicsSet = new Set();
    this.subscriptionIdsSet = new Set();

    // set listeners
    socket.on('subscribe', this.onSubscribe.bind(this));
    socket.on('unsubscribe', this.onUnsubscribe.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));

    // listen to database notifications
    // this.removeDatabaseNotifier = db.addNotifier(this.onNotification.bind(this));
  }

  onNotification({topic, data}) {
    console.log('notified topic', topic);

    const subscriptions = SUBSCRIPTIONS_BY_TOPIC.get(topic);
    if (!subscriptions) return;

    // update every subscription
    for (const subscription of subscriptions) {
      const {id, query, variables} = subscription;
      graphql(schema, query, data, null, variables)
        .then((result) => this.socket.emit('subscription_update', Object.assign({id}, result)))
        .catch((err) => this.socket.emit('error', err));
    }
  }

  onSubscribe(subscription) {
    console.log('socket on subscribe');

    const unsubscribe = (topic, subscriptionId) => {
      const subscriptions = SUBSCRIPTIONS_BY_TOPIC.get(topic);

      // find the subscription's index
      const foundSubscription = subscriptions.find((s) => s.id === subscriptionId);
      const foundIndex = subscriptions.indexOf(foundSubscription);

      // knowing its index, remove it
      if (foundIndex > -1) {
        subscriptions.splice(foundIndex, 1);

        console.log(
          'removed subscription for topic %s (total: %d)',
          topic,
          SUBSCRIPTIONS_BY_TOPIC.get(topic).length
        );
      }

      // internal lists
      this.topicsSet.delete(topic);
      this.subscriptionIdsSet.delete(subscriptionId);
    };

    const subscribe = (topic) => {
      // set default value
      if (!SUBSCRIPTIONS_BY_TOPIC.has(topic)) {
        SUBSCRIPTIONS_BY_TOPIC.set(topic, []);
      }

      // add this subscription to the topic's lists
      SUBSCRIPTIONS_BY_TOPIC.get(topic).push(subscription);
      UNSUBSCRIBERS_BY_SUBID.set(id, () => unsubscribe(topic, subscription.id));

      // internal lists
      this.topicsSet.add(topic);
      this.subscriptionIdsSet.add(subscription.id);

      console.log(
        'new subscription for topic %s (total: %d)',
        topic,
        SUBSCRIPTIONS_BY_TOPIC.get(topic).length
      );
    };

    const {id, query, variables} = subscription;
    const context = {
      subscribe,
    };

    graphqlSubscribe({schema, query, variables, context})
      .then((result) => this.socket.emit('subscription_update', Object.assign({id}, result)))
      .catch((err) => this.socket.emit('error', err));
  }

  onUnsubscribe({id}) {
    console.log('socket on unsubscribe');

    const unsubscribe = UNSUBSCRIBERS_BY_SUBID.get(id);
    if (!unsubscribe) return;

    unsubscribe();
    UNSUBSCRIBERS_BY_SUBID.delete(id);

    // unless disconnected, notify the client
    if (!this.disconnected) {
      this.socket.emit('subscription_closed', {id});
    }
  }

  onDisconnect() {
    console.log('socket on disconnect');
    // this.removeDatabaseNotifier();

    // unsubscribe remaining subscriptions
    for (const subscriptionId of this.subscriptionIdsSet) {
      this.onUnsubscribe({id: subscriptionId});
    }
  }

}

module.exports = SubscriptionsManager;
