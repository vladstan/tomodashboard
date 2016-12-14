import React from 'react';

import {
  Grid,
  Row,
  Col,
  FormControl,
} from '@sketchpixy/rubix';

class BroadcastingSidebar extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <FormControl type='text' placeholder='Search...' className='sidebar-search'
            style={{border: 'none', background: 'none', margin: '10px 0 0 0', borderBottom: '1px solid #666', color: 'white'}} />
          <Col xs={12}>
            <div className='sidebar-header'>Active Users</div>
            <div className='sidebar-nav-container'>
              <br/>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default BroadcastingSidebar;
