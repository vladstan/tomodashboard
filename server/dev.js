const express = require('express');
const socketIO = require('socket.io');
const webpack = require('webpack');
const fs = require('fs');

const morgan = require('morgan');
const compression = require('compression');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

const {graphql} = require('graphql');
const {introspectionQuery} = require('graphql/utilities');

const QueriesManager = require('./socket/QueriesManager');
const SubscriptionsManager = require('./socket/SubscriptionsManager');

const schema = require('./data/schema');
const config = require('./webpack.config.js');

const PORT = process.env.PORT || 8080;

// compile the graphql schema
graphql(schema, introspectionQuery)
  .then((result) => {
    if (result.errors) {
      console.error(result.errors);
      throw new Error('Invalid schema, see errors above');
    }

    // write the schema json
    fs.writeFile('../schema.json', JSON.stringify(result, null, 2), (err) => {
      if (err) {
        throw err;
      }

      onSchemaCompiled();
    });
  })
  .catch((err) => { throw err; });

function onSchemaCompiled() {
  const compiler = webpack(config);
  const app = express();

  // middleware
  app.use(morgan('short'));
  app.use(compression());
  app.use(webpackDev(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {colors: true},
    noInfo: true,
  }));
  app.use(webpackHot(compiler));
  app.use(express.static('../public'));

  // routes
  app.get('*', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
  });

  // start listening
  const server = app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
  const io = socketIO(server, {serveClient: false});

  // handle socket connections
  io.on('connection', (socket) => {
    console.log('io on connection');

    // launch managers to register listeners
    new QueriesManager(socket);
    new SubscriptionsManager(socket);
  });
}
