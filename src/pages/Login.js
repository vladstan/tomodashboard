import React from 'react';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router';
import FacebookLogin from 'react-facebook-login';

import {
  Row,
  Col,
  Grid,
  Panel,
  PanelBody,
  PanelContainer,
} from '@sketchpixy/rubix';

import agent from 'superagent';

@withRouter
class Login extends React.Component {

  onFacebookLogin(response) {
    console.log('facebook login response =', response);

    agent
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send({response})
      .end((err, res) => {
        if (err) {
          console.error('error doing POST to /auth', err);
        } else {
          const result = res.body;
          console.log('/auth result =', result);
          if (result.success && result.auth_token) {
            window.localStorage.setItem('auth_token', result.auth_token);

            function createCookie(name, value, days) {
              if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
              }
              else var expires = "";
              document.cookie = name+"="+value+expires+"; path=/";
            }

            createCookie('auth_token', result.auth_token, 7);
            this.props.router.push(this.props.location.query.prevLoc || '/dashboard');
          } else {
            alert(JSON.stringify(result));
          }
        }
      });
  }

  render() {
    return (
      <div id='auth-container' className='login'>
        <div id='auth-row'>
          <div id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false}>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-darkblue fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>Sign in to Rubix</h3>
                        </div>
                        <div className='bg-hoverblue fg-black50 text-center' style={{padding: 12.5}}>
                          <div>You need to sign in for those awesome features</div>
                          <div style={{marginTop: 12.5, marginBottom: 12.5}}>
                            <FacebookLogin
                              appId="203339813420668"
                              fields="name,email,picture"
                              callback={::this.onFacebookLogin} />
                          </div>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }

}

export default Login;
