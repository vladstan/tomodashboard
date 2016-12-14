import React from 'react';
import Relay from 'react-relay';

import {routerShape} from 'react-router';
import FacebookLogin from 'react-facebook-login';

import {
  Row,
  Col,
  Grid,
  Panel,
  PanelBody,
  PanelContainer,
} from '@sketchpixy/rubix';

import LogInAgentMutation from '../mutations/auth/LogInAgentMutation';

class Login extends React.Component {

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
    router: routerShape.isRequired,
  }

  onFacebookLogin(response) {
    console.log('facebook login response:', response);

    const {relay} = this.context;
    const loginMutation = new LogInAgentMutation({response});
    relay.commitUpdate(loginMutation, {
      onSuccess: ::this.onLoginSuccess,
      onFailure: ::this.onLoginFailure,
    });
  }

  onLoginSuccess(response) {
    console.log('server login success:', response);

    // save the token for later
    const {accessToken} = response.logInAgent;
    localStorage.setItem('access_token', accessToken);

    // redirect
    const {router} = this.context;
    const {query} = router.location;
    router.push(query.prevLoc || '/dashboard');
  }

  onLoginFailure(tx) {
    const err = tx.getError();
    console.error('server login failed:', err);
    alert(err.message);
  }

  render() {
    return (
      <Grid className='login-page'>
        <Row>
          <Col sm={4} smOffset={4} xs={10} xsOffset={1}>
            <PanelContainer>
              <Panel>
                <PanelBody className='login-panel'>
                  <div className='text-center bg-darkblue fg-white'>
                    <h3 className='title'>Travel Mate Dashboard</h3>
                  </div>
                  <div className='body bg-hoverblue fg-black50 text-center'>
                    <div>Hello, travel mate! This is where the journey begins.</div>
                    <FacebookLogin
                      appId='203339813420668'
                      fields='name,email,picture'
                      callback={::this.onFacebookLogin} />
                  </div>
                </PanelBody>
              </Panel>
            </PanelContainer>
          </Col>
        </Row>
      </Grid>
    );
  }

}

export default Login;
