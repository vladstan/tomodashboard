import React from 'react';
import ReactDOM from 'react-dom';

import {
  Grid, Row, Col, Icon
} from '@sketchpixy/rubix';

class StatsSidebarComponent extends React.Component {
  componentDidMount() {
    (function() {
      var data = [
        {
          value: 200,
          color:'#F7464A',
          highlight: '#FF5A5E',
          label: 'Red'
        },
        {
          value: 100,
          color: '#46BFBD',
          highlight: '#5AD3D1',
          label: 'Green'
        },
        {
          value: 110,
          color: '#FDB45C',
          highlight: '#FFC870',
          label: 'Yellow'
        },
        {
          value: 130,
          color: '#949FB1',
          highlight: '#A8B3C5',
          label: 'Grey'
        },
        {
          value: 120,
          color: '#4D5360',
          highlight: '#616774',
          label: 'Dark Grey'
        }
      ];

    }.bind(this))();
  }
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div>
                <Grid>
                  <Row>
                    <Col xs={12} collapseLeft collapseRight>
                      <div className='sidebar-header text-left' style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>Conversations Today</div>
                      <div>
                        <h5 className='bg-darkgreen45 fg-white text-center' style={{margin: 0, height: 30, paddingTop: 7, marginLeft: 5, marginRight: 5}}>122</h5>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </div>
              <hr style={{borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, marginTop: 25, marginBottom: 12.5, width: 200}} />
              <div className='sidebar-header text-left' style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>Today's revenue</div>
              <div>
                <Grid>
                  <Row>
                    <Col xs={6} collapseLeft collapseRight>
                      <div>
                        <span className='fg-yellow'>USD </span>
                        <span className='fg-green'>0.43% <Icon glyph='icon-fontello-up-dir'/></span>
                      </div>
                      <div className='fg-white'>
                        <h4 style={{marginTop: 0}}>$518.47</h4>
                      </div>
                    </Col>
                    <Col xs={6} collapseLeft collapseRight>
                      <div>
                        <span className='fg-yellow'>EUR </span>
                        <span className='fg-red'>0.24% <Icon glyph='icon-fontello-down-dir'/></span>
                      </div>
                      <div className='fg-white'>
                        <h4 style={{marginTop: 0}}>€3,170.65</h4>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </div>
              <hr style={{borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, marginTop: 25, marginBottom: 12.5, width: 200}} />
              <div>
                <Grid>
                  <Row>
                    <div className='sidebar-header text-left' style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>Today's goal percentage</div>
                    <Col xs={5} collapseLeft collapseRight>
                      <span className='sidebar-header'>Chat</span>
                    </Col>
                    <Col xs={7} collapseLeft collapseRight>
                      <Icon glyph='icon-fontello-male fg-blue' />
                      <Icon glyph='icon-fontello-male fg-blue' />
                      <Icon glyph='icon-fontello-male fg-blue' />
                      <Icon glyph='icon-fontello-male fg-blue' />
                      <Icon glyph='icon-fontello-male fg-blue' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={5} collapseLeft collapseRight>
                      <span className='sidebar-header'>Messages</span>
                    </Col>
                    <Col xs={7} collapseLeft collapseRight>
                      <Icon glyph='icon-fontello-male fg-red' />
                      <Icon glyph='icon-fontello-male fg-red' />
                      <Icon glyph='icon-fontello-male fg-red' />
                      <Icon glyph='icon-fontello-male fg-red' />
                      <Icon glyph='icon-fontello-male fg-red' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                      <Icon glyph='icon-fontello-male fg-black75' />
                    </Col>
                  </Row>
                  <hr style={{borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, marginTop: 12.5, marginBottom: 25, width: 200}} />

                </Grid>
              </div>
              <div>
                <Grid>
                  <Row>
                    <Col xs={12} collapseLeft collapseRight>
                      <div className='sidebar-header text-left' style={{marginRight: 5, marginLeft: 5, textTransform: 'none'}}>Your Commision Today</div>
                      <div className='fg-white text-center'>
                        <h4 style={{marginTop: 0}}>€67.65</h4>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default StatsSidebarComponent;
