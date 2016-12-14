import React from 'react';
import ReactDOM from 'react-dom';
import ReactHotLoader from 'react-hot-loader';
import RelaySubscriptions from 'relay-subscriptions';
import {Router, applyRouterMiddleware, browserHistory} from 'react-router';
import useRelay from 'react-router-relay';

// preserve environment between hot reloads
let environment = null;

function loadEnv() {
  const SubsNetworkLayer = require('./network-layers/SubsNetworkLayer').default;
  environment = new RelaySubscriptions.Environment();
  environment.injectNetworkLayer(new SubsNetworkLayer());
}

function render() {
  ReactDOM.unmountComponentAtNode(document.getElementById('app-container'));
  ReactDOM.render(
    React.createElement(
      ReactHotLoader.AppContainer,
      null,
      React.createElement(Router, {
        history: browserHistory,
        routes: require('./routes').default,
        render: applyRouterMiddleware(useRelay),
        onError: onRouterError,
        environment,
      }),
    ),
    document.getElementById('app-container')
  );
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

  module.hot.accept('./network-layers/SubsNetworkLayer', () => {
    loadEnv();
    render();
  });
}
