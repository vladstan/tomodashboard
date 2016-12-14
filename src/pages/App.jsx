import React from 'react';

class App extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  render() {
    return (
      <div id='app'>
        {this.props.children}
      </div>
    );
  }

}

export default App;
