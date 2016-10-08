import React, {PropTypes} from 'react';

import { withRouter } from 'react-router';

@withRouter
class LandingPage extends React.Component {
  render() {
    return (
			<div className="landing-page">
			<div id="wrapper">
					<header id="header">
						<div className="inner">

								<a href="index.html" className="logo">
									<span className="symbol"><img src="/imgs/landing/logo.svg" alt="" /></span><span className="title">Yago - Personalized trips</span>
								</a>

						</div>
					</header>

					<div id="main">
						<div className="inner">
							<header>
								<h1>Every traveler is unique</h1>
								<p>Discover the world with our personalized itineraries starting from $50/day. <br />
									Personalize your trip, from airline, train, hotels, hostels and camping to exlusive properties.
									 <br />See bellow how you can join our private beta.</p>
							</header>
							<section className="tiles">
								<article>
									<span className="image">
										<img src="/imgs/landing/pic01.jpeg" alt="" />
									</span>
									<a href="/offers/1">
										<h2>Discover</h2>
										<div className="content">
											<p>See it all, do it all.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src="/imgs/landing/pic02.jpeg" alt="" />
									</span>
									<a href="#">
										<h2>Energy</h2>
										<div className="content">
											<p>Sun, sea, sand and adventure.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src="/imgs/landing/pic03.jpeg" alt="" />
									</span>
									<a href="#">
										<h2>Yolo</h2>
										<div className="content">
											<p>For the off-peak adventurer.</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src="/imgs/landing/pic04.jpeg" alt="" />
									</span>
									<a href="#">
										<h2>Cities</h2>
										<div className="content">
											<p>For the culturally curious</p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src="/imgs/landing/pic05.jpeg" alt="" />
									</span>
									<a href="#">
										<h2>Easy Pace</h2>
										<div className="content">
											<p>For the tranquille traveller </p>
										</div>
									</a>
								</article>
								<article>
									<span className="image">
										<img src="/imgs/landing/pic06.jpeg" alt="" />
									</span>
									<a href="#">
										<h2>Hello Darling</h2>
										<div className="content">
											<p>For just married couples.</p>
										</div>
									</a>
								</article>
							</section>
						</div>
					</div>

					<footer id="footer">
						<div className="inner">
							<section>
								<h2>A journey of a thousand miles begins with a single step</h2>

									<ul className="actions">
										<li><a href="#" className="button special">Join our private beta</a></li>
									</ul>
							</section>

							<ul className="copyright">
								<li>&copy; 2016 Yago. All rights reserved</li>
							</ul>
						</div>
					</footer>

			</div>
			</div>
    );
  }
}

export default LandingPage;
