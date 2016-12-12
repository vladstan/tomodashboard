const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const {
  mutationWithClientMutationId,
} = require('graphql-relay');

const db = require('../database');
const bot = require('../tomobot');
const superagent = require('superagent');

const SendMessageMutation = mutationWithClientMutationId({
  name: 'SendMessage',
  inputFields: {
    type: {type: new GraphQLNonNull(GraphQLString)},
    text: {type: new GraphQLNonNull(GraphQLString)},
    imageUrl: {type: new GraphQLNonNull(GraphQLString)},
    cards: {type: new GraphQLNonNull(GraphQLString)},
    senderId: {type: new GraphQLNonNull(GraphQLString)},
    receiverId: {type: new GraphQLNonNull(GraphQLString)},
    receiverFacebookId: {type: new GraphQLNonNull(GraphQLString)},
    senderType: {type: new GraphQLNonNull(GraphQLString)},
    receiverType: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLString)},
    tripId: {type: GraphQLString},
    sType: {type: GraphQLString},
  },
  outputFields: {
    nothing: {
      type: GraphQLString,
      resolve: () => 'nada',
    },
  },
  async mutateAndGetPayload(props) {
    console.log('>> SEND MESSAGE PAYLOAD');
    try {
      console.log('send message mutateAndGetPayload');
      const session = await db.getSessionOfUser(props.userId);
      let cards = [];

      if (props.type === 'cards') {
        const propsCards = JSON.parse(props.cards);

        if (props.sType === 'accommodation') {
          cards = await getAccommodationCards(propsCards, props.tripId);
        } else if (props.sType === 'flights') {
          cards = await getFlightsCards(propsCards, props.tripId);
        } else if (props.sType === 'activities') {
          cards = await getActivitiesCards(propsCards, props.tripId);
        } else {
          throw new Error('errrrr cards');
        }
      }

      await bot.sendMessage({
        type: props.type,
        text: props.text,
        imageUrl: props.imageUrl,
        senderId: props.senderId,
        cards: cards,
        receiverId: props.receiverId,
        receiverFacebookId: props.receiverFacebookId,
        senderType: props.senderType,
        receiverType: props.receiverType,
        sessionId: session._id,
        timestamp: Date.now(),
      });
    } catch (ex) {
      console.error(ex);
      throw ex;
    }

    return {};
  }
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
      ]
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
      const ogTitle = text.match(/property="og:title" content="(.*?)"/)[1]
        .replace(/\&\#x2605\;/g, '★');
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
        ]
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
      ]
    });
  }

  return cards;
}

module.exports = SendMessageMutation;
