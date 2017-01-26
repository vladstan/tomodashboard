const path = require('path');
const fs = require('fs');

const express = require('express');
const socketIO = require('socket.io');
const webpack = require('webpack');

const morgan = require('morgan');
const compression = require('compression');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

const {graphql} = require('graphql');
const {introspectionQuery} = require('graphql/utilities');

const QueriesManager = require('./socket/QueriesManager');
const SubscriptionsManager = require('./socket/SubscriptionsManager');

const schema = require('./schema');
const config = require('../webpack.config.js');

// compile the graphql schema
graphql(schema, introspectionQuery)
  .then((result) => {
    if (result.errors) {
      console.error(result.errors);
      throw new Error('Invalid schema, see errors above');
    }

    const folderPath = path.join(__dirname, '../.graphql');
    const jsonPath = path.join(folderPath, 'schema.json');
    const jsonData = JSON.stringify(result, null, 2);

    // ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // write the schema json
    fs.writeFileSync(jsonPath, jsonData);

    console.log('finished writing schema.json');
    onSchemaCompiled();
  })
  .catch((err) => { throw err; });

// connect to the database
require('./mongodb').connect((err) => {
  if (err) {
    throw err;
  }

  console.log('successfully connected to MongoDB');
});

// continue server startup
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
    res.sendFile('index.html', {root: path.join(__dirname, '..', 'public')});
  });

  // start listening
  const PORT = process.env.PORT || 8080;
  const server = app.listen(PORT, () => console.log('server listening on port', PORT));
  const io = socketIO(server, {serveClient: false});

  // handle socket connections
  io.on('connection', (socket) => {
    console.log('io on connection');

    // launch managers to register listeners
    new QueriesManager(socket);
    new SubscriptionsManager(socket);
  });
}
