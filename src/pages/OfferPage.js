import React, {PropTypes} from 'react';

import { withRouter } from 'react-router';
import DATA from '../offers.json';

@withRouter
class OfferPage extends React.Component {
  render() {
    const id = this.props.params.id;
    const offer = DATA[id];
    console.log(offer);
    return (
			<div className="landing-page">
        <div id="wrapper">

          <header id="header">
            <div className="inner">

                <a href="/landing/" className="logo">
                  <span className="symbol"><img src="/imgs/landing/logo_yago.png" alt="" /></span><span className="title">Yago - Forever transformed</span>
                </a>

            </div>
          </header>

          <div id="main">
            <div className="inner">
              <h1>{offer.title}</h1>
              <span className="image main"><img src={offer.mainImg} alt="" /></span>

              <div className="offer-floating-right-chat">
                <p>Find out more and personalize this offer with our expert:</p>
                <a href="http://m.me/1045932258858446" className="btn button">Chat with {offer.agent.firstName}</a>
              </div>

              <p>
                - Price per day for this trip: ${offer.price} <br/>
                - Nights: {offer.nights} <br />
                - Ideal for: {offer.ideal} <br />
                - Cities: {offer.cities} <br />
              </p>

              <br /><br />
              <h3>Short Description</h3>
              <p>{offer.shortDescription}</p>
              <h3>Itinerary</h3>
              <span className="image main"><img src={offer.itineraryImg} alt="" /></span>
              <section>
                <h3>Our proposed trip to Italy costs</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offer.bucketList.map((item) => (
                        <tr>
                          <th key={JSON.stringify(item)}>{item.title} </th>
                          <th>${item.price}</th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <h3>Not Included</h3>
              <ul>
                <li>{offer.notIncluded}</li>
              </ul>
              <h3>Documents and Visas</h3>
              <ul>
                <li>{offer.docs}</li>
              </ul>
            </div>

          </div>

        </div>
			</div>
    );
  }
}

export default OfferPage;
