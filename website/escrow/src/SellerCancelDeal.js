import React from 'react';
import {Modal, Button, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class SellerCancelDeal extends React.Component {
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
          <ModalHeader className="bg-danger text-uppercase font-italic" toggle={this.toggle} close={closeBtn}>Escrow Contract Canceled</ModalHeader>
          <ModalBody>
            <span className="text-monospace">Transaction to cancel deal was sended. Buyer don't recive you product</span><br/><br/>
          </ModalBody>

        </Modal>
      </div>
    );
  }
}

export default SellerCancelDeal;
