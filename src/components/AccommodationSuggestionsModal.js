import React from 'react';

import {
  Button,
  FormControl,
	Modal,
} from '@sketchpixy/rubix';

class AccommodationSuggestionsModal extends React.Component {

  state = {
    cards: [
      {key: Date.now(), link: '', description: ''},
    ],
    loading: false,
    error: null,
  }

  addRow() {
    this.setState({
      ...this.state,
      cards: [
        ...this.state.cards,
        {key: Date.now(), link: '', description: ''},
      ],
    });
  }

  updateCard(cardKey, prop, newVal) {
    const newCards = [...this.state.cards];
    newCards.find(c => c.key == cardKey)[prop] = newVal;
    this.setState({
      ...this.state,
      cards: newCards,
    });
  }

  onLinkChange(cardKey, event) {
    this.updateCard(cardKey, 'link', event.target.value);
  }

  onDescChange(cardKey, event) {
    this.updateCard(cardKey, 'description', event.target.value);
  }

  onSend() {
    // this.setState({
    //   ...this.state,
    //   loading: true,
    // });

    const suggestions = {
      cards: {...this.state.cards},
    };

    this.props.sendSuggestionsMessage(suggestions, 'accommodation');
    this.props.onClose();
      // .then(() => {
      //   this.props.onClose();
      //   this.setState({
      //     ...this.state,
      //     loading: false,
      //   });
      // })
      // .catch(err => this.setState({...this.state, loading: false, error: err}));
  }

  render() {
    return (
			<Modal show={this.props.show} onHide={this.props.onClose}>
			  <Modal.Header closeButton>
					<Modal.Title>Send accommodation suggestions</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
					{
            this.state.cards.map(card => (
              <div key={card.key}>
                <FormControl type="text" placeholder="Booking.com link..." onChange={this.onLinkChange.bind(this, card.key)} />
                <FormControl type="text" placeholder="Price per night" onChange={this.onDescChange.bind(this, card.key)} />
              </div>
            ))
          }
          <br />
          <div style={{textAlign: 'center'}}>
            <Button onClick={::this.addRow}>+</Button>
          </div>
          {this.state.error && 'Error: ' + (this.state.error.message || JSON.stringify(this.state.error))}
			  </Modal.Body>
			  <Modal.Footer>
          {
            this.state.loading ?
              (<Button>Sending...</Button>)
            :
              (<Button onClick={::this.onSend} bsStyle="primary">Send</Button>)
          }
			  </Modal.Footer>
			</Modal>
		);
  }

}

export default AccommodationSuggestionsModal;
