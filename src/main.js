import React from 'react';
import ReactDOM from 'react-dom';
import ReactHotLoader from 'react-hot-loader';
import RelaySubscriptions from 'relay-subscriptions';
import {Router, applyRouterMiddleware, browserHistory} from 'react-router';
import useRelay from 'react-router-relay';
import io from 'socket.io-client';

// preserve environment between hot reloads
let socket = null;
let environment = null;

function loadEnv() {
  // disconnect the previous socket
  if (socket) {
    socket.disconnect();
  }

  // create a new socket connection
  socket = io();

  // Relay environment
  const SubsNetworkLayer = require('./network/SubsNetworkLayer').default;
  environment = new RelaySubscriptions.Environment();
  environment.injectNetworkLayer(new SubsNetworkLayer(socket));
}

function render() {
  const routerElem = React.createElement(Router, {
    history: browserHistory,
    routes: require('./routes').default,
    render: applyRouterMiddleware(useRelay),
    onError: onRouterError,
    environment,
  });

  const rootElem = React.createElement(
    ReactHotLoader.AppContainer,
    null,
    routerElem,
  );

  const appContainer = document.getElementById('app-container');
  ReactDOM.unmountComponentAtNode(appContainer);
  ReactDOM.render(rootElem, appContainer);
}

function onRouterError(err) {
  console.error('router error:', err);
}

loadEnv();
render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    render();
  });

  module.hot.accept('./network/SubsNetworkLayer', () => {
    loadEnv();
    render();
  });
}
