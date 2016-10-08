import React, {PropTypes} from 'react';

import { withRouter } from 'react-router';
import DATA from '../offers.json';

@withRouter
class OfferPage extends React.Component {
  render() {
    const id = this.props.params.id;
    const offer = DATA[id];

    return (
			<div className="landing-page">
        <div id="wrapper">

          <header id="header">
            <div className="inner">

                <a href="index.html" className="logo">
                  <span className="symbol"><img src="/imgs/landing/logo.svg" alt="" /></span><span className="title">Yago - Unique experiences</span>
                </a>

            </div>
          </header>

          <div id="main">
            <div className="inner">
              <h1>About Us - Every second counts</h1>
              <a href="https://fb.me/yago" className="btn button">Message Us</a>
              <span className="image main"><img src="/imgs/landing/sanfran.jpeg" alt="" /></span>
              <p>We are an early stage startup working amazing agents from all over the world. <br /> We want to connect our passionate agents with young travellers to help them build unique remarkable experiences.</p>
              <p>The world is about people and their stories not about other things. <br /> Great people allways celebrate uniqness, diversity and of course the human connection.</p>
              <p>Get in touch with us: <br />
              2443 Fillmore St #380-6872, San Francisco, CA 94115 <br /> Phone +1-650-646-54-80</p>
            </div>
          </div>

        </div>
			</div>
    );
  }
}

export default OfferPage;
