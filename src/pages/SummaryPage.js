import React, {PropTypes} from 'react';
import Relay from 'react-relay';
import StripeCheckout from 'react-stripe-checkout';
import { withRouter } from 'react-router';
import UpdateStripeDetailsMutation from '../mutations/UpdateStripeDetailsMutation';
import SUMMARIES from '../summaries.json';

@withRouter
class SummaryPage extends React.Component {

  onToken = (token) => {
    console.log('token!! <3', token);
    const { relay, summary: {user} } = this.props;
    relay.commitUpdate(new UpdateStripeDetailsMutation({user, token}));
    this.props.router.push('/success/' + this.props.params.id);
  }

  render() {
    console.log('SummaryPage=', JSON.stringify(this.props.summary));
    try {
      const summary = this.props.summary;
      const fields = summary.fields.edges.map(e => e.node);

      return (
  			<div className="landing-page summary-page">
          <div className="previewImg" style={{backgroundImage: `url(${summary.pictureUrl})`}}></div>

          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {
                  fields.map(field => (
                    <tr key={field.id}>
                      <td>{field.name}</td>
                      <td>${field.price}</td>
                    </tr>
                  ))
                }
                <tr>
                  <td>Total</td>
                  <td>${summary.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="checkout-btn-wrapper">
            <StripeCheckout
              token={this.onToken}
              amount={summary.total * 100}
              stripeKey="pk_test_vxCnarJoHcKoviT3ntOVANqL"
            />
          </div>
  			</div>
      );
    } catch (ex) {
      console.error(ex);
    }
  }

  // name="Three Comma Co."
  // description="Big Data Stuff"
  // image="https://www.vidhub.co/assets/logos/vidhub-icon-2e5c629f64ced5598a56387d4e3d0c7c.png"
  // panelLabel="Give Money"
  // amount={100}
  // currency="USD"
  // stripeKey="..."
  // locale="zh"
  // email="info@vidhub.co"
  // // Note: Enabling either address option will give the user the ability to
  // // fill out both. Addresses are sent as a second parameter in the token callback.
  // shippingAddress
  // billingAddress={false}
  // // Note: enabling both zipCode checks and billing or shipping address will
  // // cause zipCheck to be pulled from billing address (set to shipping if none provided).
  // zipCode={false}
  // alipay
  // bitcoin
  // allowRememberMe
  // token={this.onToken}
  // // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
  // // you are using multiple stripe keys
  // reconfigureOnUpdate={false}
  // // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
  // // useful if you're using React-Tap-Event-Plugin
  // triggerEvent="onTouchTap"

}

const SummaryPageContainer = Relay.createContainer(SummaryPage, {
  fragments: {
    summary: () => Relay.QL`
      fragment on Summary {
        fields(first: 1000) {
          edges {
            node {
              id
              name
              price
              segments
              segmentPrice
            }
          }
        }
        total
        user {
          id
          _id
          stripe {
            customerId
          }
          ${UpdateStripeDetailsMutation.getFragment('user')}
        }
      }
    `,
  },
});

export default SummaryPageContainer;
