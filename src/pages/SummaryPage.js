import React, {PropTypes} from 'react';

import { withRouter } from 'react-router';

@withRouter
class SummaryPage extends React.Component {
  render() {
    // const id = this.props.params.id;

    return (
			<div className="landing-page">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12 Days accommodation</td>
              <td>385</td>
            </tr>
            <tr>
              <td>Transfers and Taxi</td>
              <td>80</td>
            </tr>
            <tr>
              <td>National Park Entry Tikets</td>
              <td>25</td>
            </tr>
            <tr>
              <td>Guided excursions in Mulu national parks</td>
              <td>45</td>
            </tr>
            <tr>
              <td>Agency Fee (planning, booking, concierge)</td>
              <td>120</td>
            </tr>
            <tr>
              <td>Total For this propopsed trip</td>
              <td>655</td>
            </tr>
          </tbody>
        </table>

        <button className="pay-button">PAY</button>
			</div>
    );
  }
}

export default SummaryPage;
