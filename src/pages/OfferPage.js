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
                  <span className="symbol"><img src="/imgs/landing/logo.svg" alt="" /></span><span className="title">Yago - Unique experiences</span>
                </a>

            </div>
          </header>

          <div id="main">
            <div className="inner">
              <h1>{offer.title}</h1>
              <span className="image main"><img src={offer.mainImg} alt="" /></span>

              <div className="offer-floating-right-chat">
                <span className="title"><b>Personalize this offer with our Expert:</b></span><br/>
                <a href="https://fb.me/yago" className="btn button">Chat with {offer.agent.firstName}</a>
              </div>

              <p>
                - Starting price for this trip: ${offer.price} <br/>
                - Nights: {offer.nights} <br />
                - Ideal for: {offer.ideal} <br />
                - Cities: {offer.cities} <br />
              </p>
              <ul>
                {offer.bucketList.map((item) => (
                  <li key={JSON.stringify(item)}>{item.title} — ${item.price}</li>
                ))}
              </ul>

              <br /><br />
              <p>{offer.shortDescription}</p>
              <p><b>Itinerary</b></p>
              <span className="image main"><img src={offer.itineraryImg} alt="" /></span>
              <p><b>${offer.price} price includes</b></p>
              <ul>
                <li>Transfer from the airport: ${offer.priceStructure.transfers}</li>
                <li>Accommodation: ${offer.priceStructure.accommodation}</li>
                <li><i>Accommodation Discount: - ${offer.priceStructure.accommodationDiscount} </i></li>
                <li>Agency Fee (planning, booking, concierge): {offer.priceStructure.agencyFee}% - ${offer.priceStructure.agencyFee * offer.price / 100}</li>
              </ul>
              <p><b>Not included</b></p>
              <ul>
                <li>{offer.notIncluded}</li>
              </ul>
              <p><b>Documents and Visas</b></p>
              <ul>
                <li>{offer.docs}</li>
              </ul>
              <p><b>Description</b></p>
              <ul>
                <li>{offer.description}</li>
              </ul>
            </div>
          </div>

        </div>
			</div>
    );
  }
}

export default OfferPage;
