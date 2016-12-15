import React from 'react';
import Relay from 'react-relay';

import {
  Row,
  Col,
  Icon,
  Grid,
  Label,
  Badge,
  ListGroup,
  ListGroupItem,
} from '@sketchpixy/rubix';

class InboxNavItem extends React.Component {

  static propTypes = {
    glyph: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    labelClass: React.PropTypes.string,
    labelValue: React.PropTypes.string,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={8} collapseLeft collapseRight>
            {this.props.glyph && <Icon glyph={this.props.glyph} className='inbox-item-icon' />}
            <span>{this.props.title}</span>
          </Col>
          <Col xs={4} className='text-right' collapseLeft collapseRight>
            <div style={{marginTop: 5}}><Label className={this.props.labelClass}>{this.props.labelValue}</Label></div>
          </Col>
        </Row>
      </Grid>
    );
  }

}

class InboxNavTag extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    badgeClass: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} collapseLeft collapseRight>
            <Badge className={this.props.badgeClass}>{' '}</Badge>
            <span>{this.props.title}</span>
          </Col>
        </Row>
      </Grid>
    );
  }

}

class ChatUserProfileSidebar extends React.Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  render() {
    const {profile} = this.props.user;
    const {name, pictureUrl, locale, timezone, gender, prefs = {}} = profile;

    const getLocalTime = (timezone) => {
      if (timezone > 0) {
        return 'GMT +' + timezone;
      } else if (timezone < 0) {
        return 'GMT -' + timezone;
      } else {
        return 'GMT';
      }
    };

    return (
      <div>
        <div className='inbox-avatar'>
          <img src={pictureUrl} width='40' height='40' />
          <div className='inbox-avatar-name hidden-xs hidden-sm'>
            <div>{name}</div>
            <div><small>Facebook</small></div>
          </div>
        </div>
        <h6><small className='fg-darkgray'>PROFILE</small></h6>
        <ListGroup className='list-bg-blue'>
          <ListGroupItem>
            <InboxNavItem glyph='icon-fontello-clock' title={'Local time: ' + getLocalTime(timezone)} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem glyph='icon-fontello-briefcase' title={'Airport: ' + prefs.home_airport} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem glyph='icon-fontello-location-2' title={'Gender: ' + gender} />
          </ListGroupItem>
        </ListGroup>
        <hr/>
        <h6><small className='fg-darkgray'>PREFERENCES</small></h6>
        <ListGroup className='list-bg-blue'>
          <ListGroupItem>
            <InboxNavItem title={'Language: ' + locale} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Accommodation: ' + (prefs.accommodation || null)} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Budget: ' + (prefs.accommodation_budget_currency || '') + prefs.budget} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Flight cabin: ' + prefs.flight_cabin} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Flight seat: ' + prefs.flight_seat} />
          </ListGroupItem>
        </ListGroup>
        <hr/>
        <h6><small className='fg-darkgray'>NEXT TRIP</small></h6>
        <ListGroup className='list-bg-blue'>
          <ListGroupItem>
            <InboxNavItem title={'Type: ' + prefs.next_trip_type} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Time span: ' + prefs.next_trip_time} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Purpose: ' + prefs.next_trip_purpose} />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavItem title={'Extra: ' + prefs.next_trip_extra} />
          </ListGroupItem>
        </ListGroup>
        <hr/>
        <h6><small className='fg-darkgray'>NOTES</small></h6>
        <ListGroup>
          <ListGroupItem>
            <textbox>User is very X and sometimes Y. Don't say the word 'money', he'll go nuts</textbox>
          </ListGroupItem>
        </ListGroup>
        <hr/>
        <h6><small className='fg-darkgray'>LABELS</small></h6>
        <ListGroup>
          <ListGroupItem>
            <InboxNavTag title='#7day' badgeClass='bg-green fg-white' />
          </ListGroupItem>
          <ListGroupItem>
            <InboxNavTag title='#newVisitor' badgeClass='bg-red fg-white' />
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }

}

const ChatUserProfileSidebarContainer = Relay.createContainer(ChatUserProfileSidebar, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        profile {
          name
          pictureUrl
          locale
          timezone
          gender
          prefs {
            home_airport
            accommodation
            accommodation_budget
            accommodation_budget_currency
            flight_cabin
            flight_seat
            next_trip_type
            next_trip_destination
            next_trip_time
            next_trip_purpose
            next_trip_extra
          }
        }
      }
    `,
  },
});

export default ChatUserProfileSidebarContainer;
