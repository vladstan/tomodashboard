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
	Modal,
} from '@sketchpixy/rubix';

class SummaryModal extends React.Component {

  render() {
		return (
			<Modal show={this.props.show} onHide={this.props.onClose}>
			  <Modal.Header closeButton>
					<Modal.Title>Write a summary</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
					<h4>Text in a modal</h4>
			  </Modal.Body>
			  <Modal.Footer>
					<Button onClick={this.props.onSend}>Send</Button>
			  </Modal.Footer>
			</Modal>
		);
  }

}

export default SummaryModal;
