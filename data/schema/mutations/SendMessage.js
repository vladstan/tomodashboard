import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  offsetToCursor,
  mutationWithClientMutationId,
} from 'graphql-relay';

import Message from '../types/Message';
import User from '../types/User';

import * as db from '../../database';
import * as bot from '../../tomobot';
import superagent from 'superagent';

const SendMessageMutation = mutationWithClientMutationId({
  name: 'SendMessage',
  inputFields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    imageUrl: { type: new GraphQLNonNull(GraphQLString) },
    cards: { type: new GraphQLNonNull(GraphQLString) },
    senderId: { type: new GraphQLNonNull(GraphQLString) },
    receiverId: { type: new GraphQLNonNull(GraphQLString) },
    receiverFacebookId: { type: new GraphQLNonNull(GraphQLString) },
    senderType: { type: new GraphQLNonNull(GraphQLString) },
    receiverType: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    sType: { type: GraphQLString },
  },
  outputFields: {
    messageEdge: {
      type: Message.edgeType,
      resolve: async (doc) => {
        const messages = await db.getMessagesForUser(doc.userId);
        console.log('messages vs doc', '\n\n\n', messages, '\n\n\n', doc);
        const offset = messages.length - 1;
        const cursor = offsetToCursor(offset);

        return {
          cursor: cursor,
          node: doc,
        };
      },
    },
    user: {
      type: User,
      resolve: (doc) => db.getUser(doc.userId),
    },
  },
  mutateAndGetPayload: async (props) => {
    try {
      console.log('send message mutateAndGetPayload');
      const session = await db.getSessionOfUser(props.userId);
      let cards = [];

      if (props.type === 'cards') {
        const propsCards = JSON.parse(props.cards);

        if (props.sType === 'accommodation') {
          for (const c of propsCards) {
            try {
              const resp = await superagent('GET', c.link); // eslint-disable-line babel/no-await-in-loop
              const text = resp.res.text;
              // console.log('resp for ', link, ':', text);
              const ogImage = text.match(/property="og:image" content="(.*?\.(png|jpe?g))"/)[1];
              const ogTitle = text.match(/property="og:title" content="(.*?)"/)[1]
                .replace(/\&\#x2605\;/g, '★');
              // const ogDescription = text.match(/property="og:description" content="(.*?)"/)[1];
              cards.push({
                link: c.link,
                pictureUrl: ogImage,
                title: ogTitle,
                // description: (c.description && (c.description + ' | ') || '') + ogDescription,
                description: 'Price per night: ' + c.description,
                buttons: [
                  {title: 'I like this', payload: 'I_LIKE_THIS_ACCOMMODATION_' + (cards.length + 1)},
                  {title: 'More details', url: c.link},
                ]
              });
            } catch (ex) {
              console.error(ex);
              throw new Error('invalid url');
            }
          }
        } else if (props.sType === 'flights') {
          for (const c of propsCards) {
            try {
              cards.push({
                link: c.link,
                pictureUrl: c.link,
                title: c.title,
                description: c.description,
                buttons: [
                  {title: 'This flight', payload: 'I_LIKE_THIS_FLIGHT_' + (cards.length + 1)},
                ]
              });
            } catch (ex) {
              console.error(ex);
              throw new Error('invalid url');
            }
          }
        } else {
          console.log('errrrr cards');
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
  }
});

export default SendMessageMutation;
