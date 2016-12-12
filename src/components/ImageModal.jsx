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
    link: '',
  }

  updateField(fieldKey, prop, newVal) {
    const newFields = [...this.state.fields];
    newFields.find(f => f.key == fieldKey)[prop] = newVal;
    this.setState({
      ...this.state,
      fields: newFields,
    });
  }

  onFieldChange(event) {
    this.setState({
      ...this.state,
      link: event.target.value,
    });
  }

  onSend() {
    if (this.state.link) {
      this.props.sendImage(this.state.link);
      this.props.onClose();
    } else {
      alert('Enter a link first');
    }
  }

  render() {
    return (
			<Modal show={this.props.show} onHide={this.props.onClose}>
			  <Modal.Header closeButton>
					<Modal.Title>Send an image</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
          <FormControl type="text" placeholder="http://..." onChange={::this.onFieldChange} />
			  </Modal.Body>
			  <Modal.Footer>
          <Button onClick={::this.onSend} bsStyle="primary">Send</Button>
			  </Modal.Footer>
			</Modal>
		);
  }

}

export default SummaryModal;
