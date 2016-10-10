import React, {PropTypes} from 'react';
import DATA from '../offers.json';
import { withRouter } from 'react-router';

@withRouter
class LandingPage extends React.Component {
  render() {
    const offerItaly = DATA[1];
    const offerBorneo = DATA[2];
    const offerIceland = DATA[3];
    const offerCambodia = DATA[4];
    const offerSingapore = DATA[5];
    const offerAndalucia = DATA[6];
    return (
			<div className="landing-page">
			<div id="wrapper">
					<header id="header">
						<div className="inner">

								<a href="/landing" className="logo">
									<span className="symbol"><img src="/imgs/landing/logo_yago.png" alt="" /></span><span className="title">Yago - Forever transformed</span>
								</a>

						</div>
					</header>

					<div id="main">
						<div className="inner">
							<header>
								<h1>Every traveler is unique</h1>
								<p>Discover the world with our customized itineraries starting from $30/day. <br />
									Advanced AI techonlogy combined with human intelegince and expertise <br />to offer you personalized trips, and the best possible price. Exclusive for 18-35 enthusaists.</p>
							</header>
							<section className="tiles">
								<article>
									<span className="image">
										<img src={offerItaly.mainImg} alt="/offers/1" />
									</span>
									<a href="/offers/1">
										<h2>Italy <br /> From $29/ day</h2>
										<div className="content">
											<p>See it all, do it all.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
											<img src={offerBorneo.mainImg} alt="/offers/2" />
									</span>
									<a href="/offers/2">
										<h2>Borneo <br /> From $49/ day</h2>
										<div className="content">
											<p>Sun, sea, sand and adventure.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src={offerIceland.mainImg} alt="" />
									</span>
									<a href="/offers/3">
										<h2>Iceland <br /> From $69/ day</h2>
										<div className="content">
											<p>For the off-peak adventurer.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src={offerCambodia.mainImg} alt="" />
									</span>
									<a href="/offers/4">
										<h2>Cambodia <br /> From $39/ day</h2>
										<div className="content">
											<p>For the culturally curious</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src={offerSingapore.mainImg} alt="" />
									</span>
									<a href="/offers/5">
										<h2>Singapore <br /> From $71/ day</h2>
										<div className="content">
											<p>For the tranquille traveller </p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src={offerAndalucia.mainImg} alt="" />
									</span>
									<a href="/offers/6">
										<h2>Spain <br /> From $44/ day</h2>
										<div className="content">
											<p>For just married couples.</p>
										</div>
									</a>
								</article>
							</section>
              <br /><br />
              <p><a href="https://m.me/1804162523163419">Inspiration and amazing deals, every week on your Facebook Messenger.</a></p>
						</div>
					</div>

					<footer id="footer">
						<div className="inner">
							<section>
                <br />
								<h2>A journey of a thousand miles begins with a single step</h2>
                <p>Advanced AI techonlogy combined with human intelegince and expertise to offer you the best travel experience possible.</p>
									<ul className="actions">
										<li><a href="#" className="button special">Ask YagoBot about your next trip</a></li>
									</ul>
							</section>

							<ul className="copyright">
								<li>&copy; 2016 Yago. All rights reserved</li>
                <li>Contact: 2443 Fillmore St #380-6872, San Francisco, CA 94115 Phone +1-650-646-54-80</li>
							</ul>
						</div>
					</footer>

			</div>
			</div>
    );
  }
}

export default LandingPage;
