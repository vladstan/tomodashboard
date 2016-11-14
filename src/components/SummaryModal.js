import React from 'react';

import {
  Row,
  Col,
  Icon,
  Grid,
  Button,
  PanelBody,
  PanelFooter,
  FormControl,
  PanelContainer,
  Form,
  FormGroup,
  InputGroup,
	Modal,
} from '@sketchpixy/rubix';

class SummaryModal extends React.Component {

  state = {
    fields: [
      {key: 0, name: '', price: '', segments: '', segmentPrice: 9},
    ],
    loading: false,
    error: null,
  }

  addRow() {
    this.setState({
      ...this.state,
      fields: this.state.fields.concat([
        {key: Date.now(), name: '', price: '', segments: '', segmentPrice: 9},
      ]),
    });
  }

  updateField(fieldKey, prop, newVal) {
    const newFields = [...this.state.fields];
    newFields.find(f => f.key == fieldKey)[prop] = newVal;
    this.setState({
      ...this.state,
      fields: newFields,
    });
  }

  onNameChange(fieldKey, event) {
    this.updateField(fieldKey, 'name', event.target.value);
  }

  onPriceChange(fieldKey, event) {
    this.updateField(fieldKey, 'price', event.target.value);
  }

  onSegmentsChange(fieldKey, event) {
    this.updateField(fieldKey, 'segments', event.target.value);
  }

  onSend() {
    this.setState({
      ...this.state,
      loading: true,
    });

    const summary = {
      fields: {...this.state.fields},
    };

    this.props.getSummaryLink(summary)
      .then(summaryLink => {
        if (!summaryLink) {
          // error on the server
          throw new Error('no summary link');
        }
        const summaryId = summaryLink;
        this.props.sendLink('https://tomo.mod.bz/summary/' + summaryId);
        this.props.onClose();
        this.setState({
          ...this.state,
          loading: false,
        });
      })
      .catch(err => this.setState({...this.state, loading: false, error: err}));
  }

  render() {
    const totalPrice = this.state.fields
      .map(f => parseInt(f.price || '0', 10))
      .reduce((acc, p) => acc + p, 0);
    const totalFee = this.state.fields
      .map(f => parseInt(f.segments || '0', 10) * f.segmentPrice)
      .reduce((acc, s) => acc + s, 0);
    const totalTotalPrice = totalPrice + totalFee;
    const myFee = Math.ceil(totalFee * 0.7);

		return (
			<Modal show={this.props.show} onHide={this.props.onClose}>
			  <Modal.Header closeButton>
					<Modal.Title>Write a summary</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
					{
            this.state.fields.map(field => (
              <Form inline key={field.key}>
              	<FormGroup controlId="formControlsText">
              	  <FormControl type="text" placeholder="Name" onChange={this.onNameChange.bind(this, field.key)} />
                  <InputGroup>
                		<InputGroup.Addon>$</InputGroup.Addon>
                		<FormControl type="number" min="1" placeholder="Price" onChange={this.onPriceChange.bind(this, field.key)} />
              	  </InputGroup>
                  <FormControl type="number" min="1" placeholder="Segments" onChange={this.onSegmentsChange.bind(this, field.key)} />
              	</FormGroup>
              </Form>
            ))
          }
          <br />
          <div style={{textAlign: 'center'}}>
            <Button onClick={::this.addRow}>+</Button>
          </div>
          {this.state.error && 'Error: ' + (this.state.error.message || JSON.stringify(this.state.error))}
			  </Modal.Body>
			  <Modal.Footer>
          <span>My Fee: ${myFee}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Agency Fee: ${totalFee}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Total: ${totalTotalPrice}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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

export default SummaryModal;
