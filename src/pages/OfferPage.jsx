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
                <p>Yago can help you find out more about this trip and learn how you can personalize this trip.</p>
                <a href="http://m.me/1045932258858446" className="btn button"><i className="fa fa-facebook-square" aria-hidden="true"></i>Personalize with Yago</a>
              </div>

              <p>
                - Price per day for this trip: ${offer.price} <br/>
                - Nights: {offer.nights} <br />
                - Ideal for: {offer.ideal} <br />
                - Cities: {offer.cities} <br />
              </p>

              <br /><br />
              <h3>Travel Mate </h3>
              <div>
                <div>
                  <span className="image">
                    <img src={offer.agent.profilePic} alt="" height="50"/>
                  </span>
                </div>
                <div>
                  <h4>{offer.agent.firstName}</h4>
                  <p>{offer.agent.description}</p>
                </div>
              </div>
              <h3>Why this trip</h3>
              <p>{offer.shortDescription}</p>
              <h3>Itinerary</h3>
              <span className="image main"><img src={offer.itineraryImg} alt="" /></span>
              <section>
                <h3>Your budget for this trip</h3>
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
                        <tr key={JSON.stringify(item)}>
                          <th>{item.title} </th>
                          <th>${item.price}</th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                  <p><i>*We work for you not for airlines or hotesl. This way you can make sure we are going to find you the best proces for planes and for the accomodation everywhere you go. If we can get a discount for your trip, we will give it to you.</i></p>

                </div>
              </section>
              <h3>Detailed itineray</h3>
                {offer.itinerary.map((item) => (
                  <div key={JSON.stringify(item)}>
                    <p>{item.title} </p>
                    <p>{item.description}</p>
                  </div>
                ))}
              <h3>Travel Tips</h3>
                <p>{offer.travelTips}</p>
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
