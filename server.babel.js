import path from 'path';
import express from 'express';
import { graphql } from 'graphql';
import { graphqlSubscribe } from 'graphql-relay-subscription';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Relay from 'react-relay';

import routes from './src/routes';
import { renderHTMLString, setNetworkLayer } from './src/relay-router';
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware';
import { addNotifier } from './data/database';
import schema from './data/schema';

import jwt from 'express-jwt';
import GraphQLSettings from './graphql.json';

const jwtSecret = '23rfqwdf32wqda';

let endpoint = GraphQLSettings.development.endpoint;
if (process.env.NODE_ENV === 'production') {
  endpoint = GraphQLSettings.production.endpoint;
}
endpoint = endpoint || 'http://localhost:8080/graphql';
setNetworkLayer(new Relay.DefaultNetworkLayer(endpoint));

const PORT = process.env.PORT || 8080;

let app = express();
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

const httpGraphQLHandler = async (req, res) => {
  try {
    const {query, variables, ...rootVals} = req.body;
    const authToken = req.user || {};
    const result = await graphql(schema, query, {authToken, ...rootVals}, variables);
    res.send(result);
  } catch (ex) {
    console.error(ex);
    res.send(ex);
  }
};

app.use('/graphql', jwt({secret: jwtSecret, credentialsRequired: false}), httpGraphQLHandler);
app.get('/graphiql', (req, res) => res.render('graphiql'));
app.post('/auth', (req, res) => {
  console.log('auth, resp=', req.body && req.body.response);
  res.send({
    success: false,
    auth_token: null,
  });
});

function renderHTML(req, res) {
  renderHTMLString(routes, req, (error, redirectLocation, data) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.render('index', {
        content: data.content,
        data: JSON.stringify(data.data).replace(/\//g, '\\/')
      });
    }
  });
}

app.get('*', RubixAssetMiddleware('ltr'), (req, res) => {
  renderHTML(req, res);
});

const graphQLServer = app.listen(PORT, () => {
  console.log(`Node.js app is running at http://localhost:${PORT}/`);
});

const io = require('socket.io')(graphQLServer, {
  serveClient: false,
});

io.on('connection', socket => {
  console.log('io on connection');

  const topics = Object.create(null);
  const unsubscribeMap = Object.create(null);

  const removeNotifier = addNotifier(({ topic, data }) => {
    // console.log('notified topic', topic);

    const topicListeners = topics[topic];
    if (!topicListeners) return;

    topicListeners.forEach(({ id, query, variables }) => {
      graphql(
        schema,
        query,
        data,
        null,
        variables
      ).then((result) => {
        console.log('subscription update');
        socket.emit('subscription update', { id, ...result });
      });
    });
  });

  socket.on('subscribe', ({ id, query, variables }) => {
    console.log('io socket on subscribe');

    function unsubscribe(topic, subscription) {
      const index = topics[topic].indexOf(subscription);
      if (index === -1) return;

      topics[topic].splice(index);

      console.log(
        'Removed subscription for topic %s. Total subscriptions for topic: %d',
        topic,
        topics[topic].length
      );
    }

    function subscribe(topic) {
      topics[topic] = topics[topic] || [];
      const subscription = { id, query, variables };

      topics[topic].push(subscription);

      unsubscribeMap[id] = () => {
        unsubscribe(topic, subscription);
      };

      console.log(
        'New subscription for topic %s. Total subscriptions for topic: %d',
        topic,
        topics[topic].length
      );
    }

    graphqlSubscribe({
      schema,
      query,
      variables,
      context: { subscribe },
    }).then((result) => {
      if (result.errors) {
        console.error('Subscribe failed', result.errors);
      }
    });
  });

  socket.on('unsubscribe', (id) => {
    console.log('io socket on unsubscribe');

    const unsubscribe = unsubscribeMap[id];
    if (!unsubscribe) return;

    unsubscribe();
    delete unsubscribeMap[id];
    socket.emit('subscription closed', id);
  });

  socket.on('disconnect', () => {
    console.log('io socket on disconnect');
    removeNotifier();
  });
});
