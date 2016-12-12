import RelaySubscriptions from 'relay-subscriptions';
import SubsNetworkLayer from './network-layers/SubsNetworkLayer';

import useRelay from 'react-router-relay';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactHotLoader from 'react-hot-loader';
import {Router, applyRouterMiddleware, browserHistory} from 'react-router';

const environment = new RelaySubscriptions.Environment();
environment.injectNetworkLayer(new SubsNetworkLayer());

function render() {
  ReactDOM.render(
    React.createElement(
      ReactHotLoader.AppContainer,
      null,
      React.createElement(Router, {
        history: browserHistory,
        routes: require('./routes').default.get(),
        render: applyRouterMiddleware(useRelay),
        environment,
      }),
    ),
    document.getElementById('root')
  );
}

render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    // reload routes again
    render();
  });
}
