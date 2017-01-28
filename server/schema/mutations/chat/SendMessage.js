const debug = require('debug');
const superagent = require('superagent');

const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  offsetToCursor,
  mutationWithClientMutationId,
} = require('graphql-relay');

const SessionModel = require('../../../models/Session');
const MessageModel = require('../../../models/Message');
const UserModel = require('../../../models/User');

const bot = require('../../../tomobot');
const log = debug('tomo:graphql:mutations:SendMessage');

const SendMessageMutation = mutationWithClientMutationId({
  name: 'SendMessage',
  inputFields: {
    type: {type: new GraphQLNonNull(GraphQLString)},
    senderId: {type: new GraphQLNonNull(GraphQLString)},
    receiverId: {type: new GraphQLNonNull(GraphQLString)},
    receiverFacebookId: {type: new GraphQLNonNull(GraphQLString)},
    senderType: {type: new GraphQLNonNull(GraphQLString)},
    receiverType: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLString)},
    text: {type: GraphQLString},      // required for type=text
    imageUrl: {type: GraphQLString},  // required for type=image
    cards: {type: GraphQLString},     // required for type=cards
    tripId: {type: GraphQLString},  // optional
    sType: {type: GraphQLString},   // optional
  },
  outputFields: () => ({
    messageEdge: {
      type: require('../../connections').MessageEdge,
      async resolve(payload) {
        const offset = await MessageModel.count({sessionId: payload.session._id});
        const edge = {
          cursor: offsetToCursor(offset),
          node: payload.message,
        };
        log('outputFields, returning edge', edge);
        return edge;
      },
    },
    user: {
      type: require('../../types/User'),
      resolve: (payload) => UserModel.findOne({_id: payload.session.userId}),
    },
  }),
  async mutateAndGetPayload(props) {
    log('mutateAndGetPayload', props);

    const session = await SessionModel.findOne({userId: props.userId});
    let cards = [];

    // validation
    if (props.type === 'text' && !props.text) {
      throw new Error('type===text, so props.text is required');
    }
    if (props.type === 'image' && !props.imageUrl) {
      throw new Error('type===image, so props.imageUrl is required');
    }
    if (props.type === 'cards' && !props.cards) {
      throw new Error('type===cards, so props.cards is required');
    }

    // process cards
    if (props.type === 'cards') {
      const propsCards = JSON.parse(props.cards);

      if (props.sType === 'accommodation') {
        cards = await getAccommodationCards(propsCards, props.tripId);
      } else if (props.sType === 'flights') {
        cards = await getFlightsCards(propsCards, props.tripId);
      } else if (props.sType === 'activities') {
        cards = await getActivitiesCards(propsCards, props.tripId);
      } else {
        throw new Error('err cards: invalid sType');
      }
    }

    const msg = {
      type: props.type,
      text: props.text || '',
      imageUrl: props.imageUrl || '',
      cards: cards || [],
      senderId: props.senderId,
      receiverId: props.receiverId,
      receiverFacebookId: props.receiverFacebookId,
      senderType: props.senderType,
      receiverType: props.receiverType,
      sessionId: session._id,
      timestamp: Date.now(),
    };

    log('sending message to Facebook');
    await bot.sendMessage(msg);

    log('saving message in database');
    const message = await new MessageModel(msg).save();

    return {
      message,
      session,
    };
  },
});

async function getFlightsCards(propsCards, tripId) {
  const cards = [];

  for (const c of propsCards) {
    const payloadData = {
      pictureUrl: c.link,
      airline: c.title,
      price: c.description,
      sType: 'flight',
      tripId: tripId,
    };
    const payloadJson = JSON.stringify(payloadData);

    cards.push({
      link: c.link,
      pictureUrl: c.link,
      title: c.title,
      description: c.description,
      buttons: [
        {title: 'Book this flight 👍', payload: 'BOOK_FLIGHT:' + payloadJson},
        {title: 'Tell me more ℹ️', payload: 'MORE_INFO_FLIGHT:' + payloadJson},
      ],
    });
  }

  return cards;
}

async function getAccommodationCards(propsCards, tripId) {
  const cards = [];

  for (const c of propsCards) {
    try {
      const resp = await superagent('GET', c.link); // eslint-disable-line babel/no-await-in-loop
      const text = resp.res.text;
      // console.log('resp for ', link, ':', text);
      const ogImage = text.match(/property="og:image" content="(.*?\.(png|jpe?g))"/)[1];
      const ogTitle = text.match(/property="og:title" content="(.*?)"/)[1].replace(/&#x2605;/g, '★');
      // const ogDescription = text.match(/property="og:description" content="(.*?)"/)[1];
      const payloadData = {
        link: c.link,
        pictureUrl: ogImage,
        name: ogTitle,
        price: c.description,
        sType: 'accommodation',
        tripId: tripId,
      };
      const payloadJson = JSON.stringify(payloadData);

      cards.push({
        link: c.link,
        pictureUrl: ogImage,
        title: ogTitle,
        // description: (c.description && (c.description + ' | ') || '') + ogDescription,
        description: 'Price per night: ' + c.description,
        buttons: [
          {title: 'Book this place 👍', payload: 'BOOK_ACCOMMODATION:' + payloadJson},
          {title: 'Tell me more ℹ️', payload: 'MORE_INFO_ACCOMMODATION:' + payloadJson},
        ],
      });
    } catch (ex) {
      console.error(ex);
      throw new Error('invalid url');
    }
  }

  return cards;
}

async function getActivitiesCards(propsCards, tripId) {
  const cards = [];

  for (const c of propsCards) {
    const payloadData = {
      pictureUrl: c.link,
      name: c.title,
      price: c.description,
      sType: 'activity',
      tripId: tripId,
    };
    const payloadJson = JSON.stringify(payloadData);

    cards.push({
      link: c.link,
      pictureUrl: c.link,
      title: c.title,
      description: c.description,
      buttons: [
        {title: 'Book this activity 👍', payload: 'BOOK_ACTIVITY:' + payloadJson},
        {title: 'Tell me more ℹ️', payload: 'MORE_INFO_ACTIVITY:' + payloadJson},
      ],
    });
  }

  return cards;
}

module.exports = SendMessageMutation;
