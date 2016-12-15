import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import {
  Grid,
  Row,
  Col,
} from '@sketchpixy/rubix';

class UserChatItem extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    avatarUrl: React.PropTypes.string.isRequired,
  }

  render() {
    const {id, avatarUrl, name} = this.props;

    const avatarStyle = {
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 100,
      padding: 2,
      position: 'relative',
      top: -7,
      opacity: 1,
    };

    const nameStyle = {
      position: 'relative',
      top: -2,
      opacity: 1,
    };

    return (
      <li tabIndex='-1'>
        <Link to={'/dashboard/chat/' + id}>
          <img src={avatarUrl} width='30' height='30' className='border-green' style={avatarStyle} />
          <span className='name' style={nameStyle}>{name}</span>
        </Link>
      </li>
    );
  }

}

class ActiveChatsSidebar extends React.Component {

  static propTypes = {
    agent: React.PropTypes.object.isRequired,
  }

  render() {
    const users = this.props.agent.users.edges.map((e) => e.node);
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>All</div>
            <div className='sidebar-nav-container'>
              <ul className='sidebar-nav' style={{marginBottom: 0}}>
                {users.map((user) => (
                  <UserChatItem key={user.id} id={user._id} name={user.profile.name} avatarUrl={user.profile.pictureUrl} />
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

}

const ActiveChatsSidebarContainer = Relay.createContainer(ActiveChatsSidebar, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        users(first: 100) {
          edges {
            node {
              id
              _id
              profile {
                name
                pictureUrl
              }
            }
          }
        }
      }
    `,
  },
});

export default ActiveChatsSidebarContainer;
