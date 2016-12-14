import React from 'react';
import Relay from 'react-relay';

import {
  Grid,
  Row,
  Col,
} from '@sketchpixy/rubix';

class StatsSidebar extends React.Component {

  static propTypes = {
    agent: React.PropTypes.object.isRequired,
  }

  render() {
    const {
      lastCreditAmount,
      totalUnpaidTrips,
      totalUnpaidMoney,
      totalPaidMoney,
    } = this.props.agent;

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Grid>
              <Row>
                <Col xs={12} collapseLeft collapseRight>
                  <div className='sidebar-header text-left'
                    style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>Unpaid Trips</div>
                  <h5 className='bg-darkgreen45 fg-white text-center'
                    style={{margin: 0, height: 30, paddingTop: 7, marginLeft: 5, marginRight: 5}}>{totalUnpaidTrips}</h5>
                </Col>
              </Row>
            </Grid>
            <hr style={{borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, marginTop: 25, marginBottom: 12.5, width: 200}} />
            <div className='sidebar-header text-left'
              style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>EARNINGS</div>
            <Grid>
              <Row>
                <Col xs={6} collapseLeft collapseRight>
                  <span className='fg-yellow'>CREDIT</span>
                  <div className='fg-white'>
                    <h4 style={{marginTop: 0}}>${totalUnpaidMoney}</h4>
                  </div>
                </Col>
                <Col xs={6} collapseLeft collapseRight>
                  <span className='fg-yellow'>PAID</span>
                  <div className='fg-white'>
                    <h4 style={{marginTop: 0}}>${totalPaidMoney}</h4>
                  </div>
                </Col>
              </Row>
            </Grid>
            <hr style={{borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, marginTop: 25, marginBottom: 12.5, width: 200}} />
            <Grid>
              <Row>
                <Col xs={12} collapseLeft collapseRight>
                  <div className='sidebar-header text-left'
                    style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>My Last Trip Earnings</div>
                  <div className='fg-white text-center'>
                    <h4 style={{marginTop: 0}}>${lastCreditAmount}</h4>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Col>
        </Row>
      </Grid>
    );
  }

}

const StatsSidebarContainer = Relay.createContainer(StatsSidebar, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        lastCreditAmount
        totalUnpaidTrips
        totalUnpaidMoney
        totalPaidMoney
      }
    `,
  },
});

export default StatsSidebarContainer;
