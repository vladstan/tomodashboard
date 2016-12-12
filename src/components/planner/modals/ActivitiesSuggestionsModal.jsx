import React from 'react';

import {
  Button,
  FormControl,
	Modal,
} from '@sketchpixy/rubix';

class ActivitiesSuggestionsModal extends React.Component {

  state = {
    cards: [
      {key: Date.now(), link: '', title: '', description: ''},
    ],
    loading: false,
    error: null,
  }

  addRow() {
    this.setState({
      ...this.state,
      cards: [
        ...this.state.cards,
        {key: Date.now(), link: '', title: '', description: ''},
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

  onFieldChange(fieldKey, cardKey, event) {
    this.updateCard(cardKey, fieldKey, event.target.value);
  }

  onSend() {
    const suggestions = {
      cards: {...this.state.cards},
    };

    this.props.sendSuggestionsMessage(suggestions);
    this.props.onClose();

    this.setState({
      ...this.state,
      cards: [
        {key: Date.now(), link: '', title: '', description: ''},
      ],
    });
  }

  render() {
    return (
			<Modal show={this.props.show} onHide={this.props.onClose}>
			  <Modal.Header closeButton>
					<Modal.Title>Send activities suggestions</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
					{
            this.state.cards.map(card => (
              <div key={card.key}>
                <FormControl
                  type="text"
                  placeholder="Screenshot link..."
                  onChange={this.onFieldChange.bind(this, 'link', card.key)} />
                <FormControl
                  type="text"
                  placeholder="Activity name"
                  onChange={this.onFieldChange.bind(this, 'title', card.key)} />
                <FormControl
                  type="text"
                  placeholder="Price per person"
                  onChange={this.onFieldChange.bind(this, 'description', card.key)} />
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

export default ActivitiesSuggestionsModal;
