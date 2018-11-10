import React from 'react';
import {Modal, Button, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class BuyerSendMoney extends React.Component {
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
          <ModalHeader className="bg-primary text-uppercase font-italic" toggle={this.toggle} close={closeBtn}>Transaction sended!</ModalHeader>
          <ModalBody>
            <span className="text-monospace">Seller will receive your money after you approve this deal</span><br/><br/>
          </ModalBody>

        </Modal>
      </div>
    );
  }
}

export default BuyerSendMoney;
