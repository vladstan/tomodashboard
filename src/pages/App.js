import React from 'react';
import { withRouter } from 'react-router';

@withRouter
class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
