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
      {key: 0, name: '', price: '', segments: ''},
    ],
  }

  addRow() {
    this.setState({
      ...this.state,
      fields: this.state.fields.concat([
        {key: Date.now(), name: '', price: '', segments: ''},
      ])
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

  render() {
    const totalPrice = this.state.fields.map(f => parseInt(f.price || '0', 10)).reduce((acc, p) => acc + p, 0);
    const totalFee = this.state.fields.map(f => parseInt(f.segments || '0', 10)).reduce((acc, s) => acc + s * 10, 0);
    const totalTotalPrice = totalPrice + totalFee;

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
			  </Modal.Body>
			  <Modal.Footer>
          <span>Agency Fee: {totalFee}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Total: {totalTotalPrice}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button onClick={this.props.onSend}>Send</Button>
			  </Modal.Footer>
			</Modal>
		);
  }

}

export default SummaryModal;
