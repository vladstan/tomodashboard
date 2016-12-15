import React from 'react';

import {
  Row,
  Col,
  Grid,
} from '@sketchpixy/rubix';

class Footer extends React.Component {

  render() {
    const year = new Date().getFullYear();
    return (
      <div id='footer-container'>
        <Grid id='footer' className='text-center'>
          <Row>
            <Col xs={12}>
              <div>&copy; {year} Futuristico & Tomo</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

export default Footer;
