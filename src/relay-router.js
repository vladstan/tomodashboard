import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
// import ReactRouter from 'react-router';
import ReactHotLoader from 'react-hot-loader';
import Relay from 'react-relay';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRelayRouter from 'isomorphic-relay-router';

import onRouterSetup from '@sketchpixy/rubix/lib/node/onRouterSetup';
import isBrowser from '@sketchpixy/rubix/lib/isBrowser';

const ReactRouter = require('react-router');

if (isBrowser()) {
  onRouterSetup();
}

let networkLayer;
let Environment = Relay.Environment;

function setEnvironment(Env) {
  Environment = Env;
}

function setNetworkLayer(layer) {
  networkLayer = layer;
}

function render(Component, onRender) {
  if (!onRender) onRender = function onRender() {};

  if (isBrowser()) {
    // in browser
    const history = global.Modernizr.history ? ReactRouter.browserHistory : ReactRouter.hashHistory;

    const environment = new Environment();
    environment.injectNetworkLayer(networkLayer);

    const preloadedData = document.getElementById('preloadedData');
    const data = preloadedData ? JSON.parse(preloadedData.textContent) : '';
    IsomorphicRelay.injectPreparedData(environment, data);

    const matchOpts = { routes: Component, history: history };
    const matchCallback = (error, redirectLocation, renderProps) => {
      IsomorphicRelayRouter.prepareInitialRender(environment, renderProps)
        .then((props) => {
          return ReactDOM.render(React.createElement(
            ReactHotLoader.AppContainer,
            null,
            React.createElement(ReactRouter.Router, props)
          ), document.getElementById('app-container'), onRender);
        });
    };

    ReactRouter.match(matchOpts, matchCallback);
  }
}

function renderIRData(_ref) {
  const data = _ref.data;
  const props = _ref.props;

  return {
    content: ReactDOMServer.renderToString(React.createElement(
      ReactHotLoader.AppContainer,
      null,
      IsomorphicRelayRouter.render(props)
    )),
    data: data
  };
}

function renderHTMLString(routes, req, callback) {
  // in server
  const matchOpts = { routes: routes.get(req), location: req.url };
  const matchCallback = (error, redirectLocation, renderProps) => {
    if (error) {
      callback(error);
    } else if (redirectLocation) {
      callback(null, redirectLocation);
    } else if (renderProps) {
      IsomorphicRelayRouter.prepareData(renderProps, networkLayer)
        .then(renderIRData)
        .then((data) => {
          callback(null, null, data);
        });
    } else {
      callback({
        message: 'Not found'
      });
    }
  };

  ReactRouter.match(matchOpts, matchCallback);
}

export {
  setEnvironment,
  setNetworkLayer,
  renderHTMLString
};
export default render;
