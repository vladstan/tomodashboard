import React from 'react';

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

  render() {
    try {
      const user = this.props.user;
      const profile = user.profile;
      const prefs = profile.prefs || {};

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
            <img src={profile.pictureUrl} width='40' height='40' />
            <div className='inbox-avatar-name hidden-xs hidden-sm'>
              <div>{profile.name}</div>
              <div><small>Facebook</small></div>
            </div>
          </div>
          <h6><small className='fg-darkgray'>PROFILE</small></h6>
          <ListGroup className='list-bg-blue'>
            <ListGroupItem>
              <InboxNavItem glyph='icon-fontello-clock' title={'Local time: ' + getLocalTime(profile.timezone)} />
            </ListGroupItem>
            <ListGroupItem>
              <InboxNavItem glyph='icon-fontello-briefcase' title={'Airport: ' + prefs.home_airport} />
            </ListGroupItem>
            <ListGroupItem>
              <InboxNavItem glyph='icon-fontello-location-2' title={'Gender: ' + profile.gender} />
            </ListGroupItem>
          </ListGroup>
          <hr/>
          <h6><small className='fg-darkgray'>PREFERENCES</small></h6>
          <ListGroup className='list-bg-blue'>
            <ListGroupItem>
              <InboxNavItem title={'Language: ' + profile.locale} />
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
    } catch (ex) {
      console.error('chatUserProfileSidebarComp', ex);
    }
  }

}

export default ChatUserProfileSidebar;
