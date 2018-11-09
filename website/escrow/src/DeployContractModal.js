import React from 'react';
import {Modal, Button, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class DeployContractModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.shouldShow
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;

      return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader className="bg-success text-uppercase font-italic" toggle={this.toggle} close={closeBtn}>Escrow Contract Deployed</ModalHeader>
          <ModalBody>
            <span className="text-monospace">Smart contract was deployed, it will be destructed after seller accept/cancel deal.</span><br/><br/>
            <span className="font-weight-light">Please navigate to 'Send Money Page', to send money to seller.<br/></span>
            <span className="font-weight-light">Please navigate to 'Accept Money Page' to confirm money receiving<br/></span>
          </ModalBody>

        </Modal>
      </div>
    );
  }
}

export default DeployContractModal;
