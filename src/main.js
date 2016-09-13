import Relay from 'react-relay';
import ReactDOM from 'react-dom';

import routes from './routes';
import render, { setNetworkLayer, setEnvironment } from './relay-router';
import RelaySubscriptions from 'relay-subscriptions';
import isBrowser from '@sketchpixy/rubix/lib/isBrowser';
import SubsNetworkLayer from './SubsNetworkLayer';
import GraphQLSettings from '../graphql.json';

if (isBrowser()) {
  setEnvironment(RelaySubscriptions.Environment);
  setNetworkLayer(new SubsNetworkLayer('/graphql'));
} else {
  let endpoint = GraphQLSettings.development.endpoint;
  if (process.env.NODE_ENV === 'production') {
    endpoint = GraphQLSettings.production.endpoint;
  }
  endpoint = endpoint || 'http://localhost:8080/graphql';
  setNetworkLayer(new Relay.DefaultNetworkLayer(endpoint));
}

render(routes, () => {
  console.log('Completed rendering!');
});

if (module.hot) {
  module.hot.accept('./routes', () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('app-container'));
    // reload routes again
    render(require('./routes').default);
  });
}
