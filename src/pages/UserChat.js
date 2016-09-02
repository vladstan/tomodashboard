import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import {
  Row,
  Col,
  Icon,
  Grid,
  Label,
  Badge,
  Panel,
  Button,
  PanelLeft,
  PanelBody,
  ListGroup,
  LoremIpsum,
  ButtonGroup,
  ButtonToolbar,
  ListGroupItem,
  PanelContainer,
} from '@sketchpixy/rubix';

import Chat from '../common/chat';

class InboxNavItem extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={8} collapseLeft collapseRight>
            <Icon glyph={this.props.glyph} className='inbox-item-icon'/>
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

@withRouter
class InboxItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/ltr/mailbox/mail');
  }
  render() {
    var classes = classNames({
      'inbox-item': true,
      'unread': this.props.unread
    });

    var linkProps = {
      ...this.props,
      href: '/ltr/mailbox/mail',
      onClick: ::this.handleClick,
      className: classes,
      name: null,
      date: null,
      itemId: null,
      labelClass: null,
      labelValue: null,
      description: null,
    };

    return (
      <a {...linkProps}>
        <div className='inbox-avatar'>
          <img src={this.props.src} width='40' height='40' className={this.props.imgClass + ' hidden-xs'} />
          <div className='inbox-avatar-name'>
            <div className='fg-darkgrayishblue75'>{this.props.name}</div>
            <div><small><Badge className={this.props.labelClass} style={{marginRight: 5, display: this.props.labelValue ? 'inline':'none'}}>{this.props.labelValue}</Badge><span>{this.props.description}</span></small></div>
          </div>
          <div className='inbox-date hidden-sm hidden-xs fg-darkgray40 text-right'>
            <div style={{position: 'relative', top: 5}}>{this.props.date}</div>
            <div style={{position: 'relative', top: -5}}><small>#{this.props.itemId}</small></div>
          </div>
        </div>
      </a>
    );
  }
}

@withRouter
class UserChat extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/ltr/mailbox/compose');
  }

  render() {
    return (
      <div>
        <PanelContainer className='inbox' collapseBottom>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={8} style={{paddingTop: 12.5, paddingBottom: 20.5}}>
                    <ButtonToolbar className='inbox-toolbar'>
                      <ButtonGroup>
                        <Button bsStyle='blue' onClick={::this.handleClick}>
                          <Icon glyph='icon-fontello-edit-1'/>
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-reply'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45' className='hidden-xs'><Icon glyph='icon-fontello-reply-all-1'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-forward'/></Button>
                      </ButtonGroup>
                      <ButtonGroup className='hidden-xs'>
                        <Button outlined onlyOnHover bsStyle='danger' className='text-center'><Icon glyph='icon-fontello-attention-alt'/></Button>
                        <Button outlined onlyOnHover bsStyle='danger'><Icon glyph='icon-fontello-trash-1'/></Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <Col xs={4} className='text-right'>
                    {/* <div className='inbox-avatar'>
                      <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                      <div className='inbox-avatar-name hidden-xs hidden-sm'>
                        <div>Anna Sanchez</div>
                        <div><small>Mailbox</small></div>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Grid>
              <hr style={{margin: 0}}/>
              <Panel horizontal>
                <PanelLeft className='panel-sm-3 inbox-nav hidden-xs'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <div className='inbox-avatar'>
                          <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                          <div className='inbox-avatar-name hidden-xs hidden-sm'>
                            <div>Anna Sanchez</div>
                            <div><small>Facebook</small></div>
                          </div>
                        </div>
                        <h6><small className='fg-darkgray'>PROFILE</small></h6>
                        <ListGroup className='list-bg-blue'>
                          <ListGroupItem>
                            <InboxNavItem glyph='icon-fontello-clock' title='Local time 10:34' />
                          </ListGroupItem>
                          <ListGroupItem>
                            <InboxNavItem glyph='icon-fontello-briefcase' title='Works at Apple' />
                          </ListGroupItem>
                          <ListGroupItem>
                            <InboxNavItem glyph='icon-fontello-location-2' title='From London, UK' />
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
                      </Col>
                    </Row>
                  </Grid>
                </PanelLeft>
                <PanelBody className='panel-sm-9 panel-xs-12' style={{ paddingTop: 0 }}>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <Chat />
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}

export default UserChat;
