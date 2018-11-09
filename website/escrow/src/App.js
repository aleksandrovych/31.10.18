import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Utils from './Lib/Utils';
import composeAsync from './Lib/ComposeAsync';
import compose from './Lib/ComposeSync';
import {Alert, ListGroup, ListGroupItem, Jumbotron, Container, InputGroup, InputGroupAddon, FormGroup, Label, Input, FormTextContainer, FormText, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import DeployContractModal from './DeployContractModal';

const PASSWORD = 'robotBorsh1';

class App extends Component {

constructor(props) {
  super(props);

  Utils.autobind(this);
  this.web3 = this.getWeb3();

  this.toggle = this.toggle.bind(this);

  this.state = {
      activeTab: '1',
      modal: false,
    };
}

componentDidMount() {
  compose(this.getInputFileElement, this.listenFileSelection)()
  this.unlockBase(PASSWORD);
}

toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  toggleModal = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

getWeb3 = () => ((window.web3.currentProvider != undefined && window.web3.currentProvider != null && window.web3.currentProvider != NaN) ? new Web3(window.web3.currentProvider): new Web3());
//
getInputFileElement = () => document.getElementById('file-input');
listenFileSelection = (element) =>  element.addEventListener('change', this.onFileSelect, false);
/*block start*/
onFileSelect = (event) => (this.startEscrowContractFileReading(event));
startEscrowContractFileReading = event => (this.readEscrowContracts(event))
//
readEscrowContracts = (event) => (this.readContracts('../../../build/contracts/Escrow.json', event))
readContracts =  (path, event, reader = new FileReader()) => (reader.onload = this.readFileCallback, reader.readAsText(event.target.files[0]));
//
readFileCallback = (event) => this.imperativ({proxy: this.createContractProxy(this.parseContractAttribute(event.target.result, 'abi')), bin: this.parseContractAttribute(event.target.result, 'bytecode')});
//
parseContractAttribute = (source, attribute) => JSON.parse(source)[attribute];
createContractProxy = abi => (new this.web3.eth.Contract(abi));
//
/*block end*/
unlockBase = pass => this.coinbase(this.unlockAcc, pass)
//
coinbase = (fn, par) => (this.web3.eth.getCoinbase((err, res) => fn(res, ...par)))
unlockAcc = (acc, pass) =>  this.web3.eth.personal.unlockAccount(acc, pass);
//
createContract = (Contract, from, gas, bin) => Contract.new({from: from, gas: gas, data: bin})

imperativ = (source) => {
  this.coinbase((from) => {
    const contract = source.proxy;
    contract.options.gas = 3000000;
    contract.options.gasPrice = 21;
    contract.options.address = from;

  const promise = contract.deploy({
    data: source.bin,
    arguments: ['0x198198c8251f5044f6abb089a502bc42a4667005', '0x9765e26503937b3251fd88bf0d4df7d00121d297']
  }).send({
    from: from,
    gas: 3000000,
    gasPrice: '21',
}).then(function(newContractInstance){
    const result = newContractInstance.methods.testReturn().call({from: from}, (error, result) => console.log('result1: ', result));
  });
  }, [])
}

  render() {
    return (
            <div  className="pl-5 pr-5 bg-secondary bg-gradient-light">
            {this.state.modal && <DeployContractModal shouldShow={this.state.modal} />}
              <Nav className="bg-secondary pt-5 rounded-left rounded-right" tabs>
                <NavItem className="bg-light border-primary rounded-top">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}>
                    Contract creation page
                  </NavLink>
                </NavItem>
                <NavItem className="bg-light border-primary rounded-top">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}>
                    Send money page (For buyers)
                  </NavLink>
                </NavItem>
                <NavItem className="bg-light border-2 rounded-top">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}>
                    Accept money page (For sellers)
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab} className="border-0">

                <TabPane className="bg-light border-0 " tabId="1">
                <div id="tab1">
                  <Row className="pl-4 pr-2 mb-0 pb-0">
                    <Col sm="12" >
                    <FormGroup className="pt-4 pb-3">
                      <Label for="exampleFile">Escrow Contract</Label>
                      <Input type="file" name="file" id="file-input" />
                      <FormText color="muted">
                        Load compiled contract file from your local machine
                      </FormText>
                      </FormGroup>
              <ListGroup className="pb-4 mr-3">
        <ListGroupItem className="pt-4 pb-0" color="success">
        <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
        <InputGroup className="pb-4">
          <InputGroupAddon addonType="prepend">@</InputGroupAddon>
          <Input placeholder="Buyer address" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">@</InputGroupAddon>
          <Input placeholder="Seller address" />
        </InputGroup>
        </Jumbotron>
        </ListGroupItem>
                    <ListGroupItem className="text-right pr-4" color="info"><Button onClick={this.toggleModal } color="success">Deploy Contract to Blockchain</Button></ListGroupItem>
                    </ListGroup>
                    </Col>
                  </Row>
                  </div>
                </TabPane>
                <TabPane className="border-0 bg-light" tabId="2">
                <div id="tab2">
                  <Row className="pl-4 pr-2 mb-0 pb-0 pt-4">
                    <Col sm="12" >
                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                    <Alert color="success">
      Seller recive your money only after your approve!
                    </Alert>
                    <Button className="w-25" color="primary">Send money</Button>
                    </Jumbotron>
                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                    <Alert color="success">
      Approve deal, if you recive product
                    </Alert>
                    <Button className="w-25" color="primary">Approve deal</Button>
                    </Jumbotron>
                    </Col>
                  </Row>
                    </div>
                </TabPane>


                <TabPane className="border-0 bg-light" tabId="3">
                <div id="tab3">
                  <Row className="pl-4 pr-2 mb-0 pb-0 pt-4">
                    <Col sm="12" >
                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                    <Alert color="success">
      To approve deal, after receiving money
                    </Alert>
                    <Button className="w-25" color="primary">Approve money receiving</Button>
                    </Jumbotron>

                    </Col>
                  </Row>
                  </div>
                </TabPane>

              </TabContent>

            </div>
          );

}
}


export default App;
