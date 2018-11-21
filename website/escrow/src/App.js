import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Utils from './Lib/Utils';
import compose from './Lib/ComposeSync';
import {
    Alert,
    ListGroup,
    ListGroupItem,
    Jumbotron,
    InputGroup,
    InputGroupAddon,
    FormGroup,
    Label,
    Input,
    FormTextContainer,
    FormText,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Button,
    Row,
    Col
} from 'reactstrap';
import classnames from 'classnames';
import DeployContractModal from './DeployContractModal';

import BuyerApproveDeal from './BuyerApproveDeal';
import SellerApproveDeal from './SellerApproveDeal';
import BuyerCancelDeal from './BuyerCancelDeal';
import SellerCancelDeal from './SellerCancelDeal';
import BuyerSendMoney from './BuyerSendMoney'
import ErrorAlert from 'react-s-alert';

const PASSWORD = 'robotBorsh1';


class App extends Component {

    constructor(props) {
        super(props);

        this.web3 = this.getWeb3();
        const web = this.web3;

        this.contract = null;
        this.source = null;

        this.state = {
            activeTab: '1',
            modal: false,
            buyerApprove: false,
            sellerApprove: false,
            buyerCancel: false,
            sellerCancel: false,
            buyerSend: false,
            buyer: '',
            seller: '',
            deposit: 5,
        };
    }

    componentDidMount() {
        compose(this.getInputFileElement, this.listenFileSelection)()

        let strongSelf = this;

        this.web3.eth.getAccounts(function(err, accounts){
            if (err != null) {
                ErrorAlert.error('Some problems with Metamask, Maybe you should install it. Program was developed to work in Chrome browser', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 'none'
                });
                return
            }
            else if (accounts.length == 0) {
                ErrorAlert.error('User have to be logged in Metamask Chrome extension, Refresh website after login', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 'none'
                });
                return
            }
            else {
                strongSelf.unlockBase(PASSWORD);
            }
        });
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    toggleModal = (event) => {

        if (this.source === null) {
            event.preventDefault();
            ErrorAlert.error('Choose contract please', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
            return
        }


        if (this.state.buyer.length != 42 && this.state.buyer.slice(0, 3) !== '0x') {
            event.preventDefault();
            ErrorAlert.error('Enter correct buyer address please', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
            return
        }

        if (this.state.seller.length != 42 && this.state.seller.slice(0, 3) !== '0x') {
            event.preventDefault();
            ErrorAlert.error('Enter correct seller address please', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
            return
        }

        ErrorAlert.closeAll();

        this.coinbase((from) => {

            const strongSelf = this;

            const contract = this.source.proxy;
            contract.options.address = from;

            const promise = contract.deploy({
                data: this.source.bin,
                arguments: [this.state.buyer, this.state.seller]
            }).send({
                from: from,
            }).then(function (newContractInstance) {
                strongSelf.contract =  newContractInstance;
                console.log('newContractInstance: ',newContractInstance);
            });
        }, [])
    }

    toggleBuyerCancel = () => {

        if (this.showErrorIfShould()) {
            return
        };

        this.coinbase((from) => {
            if (this.state.buyer.trim().toLowerCase() == from.trim().toLowerCase()) {
                const result = this.contract.methods.cancel().send({from: this.state.buyer, gas: 27870}, (error, result) => {
                    if (error === null) {
                        this.setState({
                            buyerCancel: !this.state.buyerCancel
                        });
                        this.contract = null;
                        this.source = null;
                        return
                    }
                });

                return
            }

            ErrorAlert.error('Choose buyer account to do this', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
        }, [])
    }

    toggleSellerCancel = () => {
        if (this.showErrorIfShould()) {
            return
        };

        this.coinbase((from) => {
            if (this.state.seller.trim().toLowerCase() == from.trim().toLowerCase()) {
                const result = this.contract.methods.cancel().send({from: this.state.seller, gas: 27870}, (error, result) => {
                    if (error === null) {
                        this.setState({
                            sellerCancel: !this.state.sellerCancel
                        });
                        this.contract = null;
                        this.source = null;
                        return
                    }
                });
                return
            }

            ErrorAlert.error('Choose seller account to do this', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
        }, [])
    }

    toggleBuyerApprove = () => {
        if (this.showErrorIfShould()) {
            return
        };

        this.coinbase((from) => {
            if (this.state.buyer.trim().toLowerCase() == from.trim().toLowerCase()) {
                this.contract.methods.accept().send({from: this.state.buyer, gas: 50000}, (error, result) => {
                    if (error === null) {
                        this.setState({
                            buyerApprove: !this.state.buyerApprove
                        });
                        return
                    }
                });

                return
            }

            ErrorAlert.error('Choose buyer account to do this', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
            }, [])
    }

    toggleSellerApprove = () => {
        if (this.showErrorIfShould()) {
            return
        };

        this.coinbase((from) => {
            if (this.state.seller.trim().toLowerCase() == from.trim().toLowerCase()) {
                this.contract.methods.accept().send({from: this.state.seller, gas: 50000}, (error, result) => {
                    if (error === null) {
                        this.setState({
                            sellerApprove: !this.state.sellerApprove
                        });
                        return
                    }
                });
                return
            }

            ErrorAlert.error('Choose seller account to do this', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
        }, [])


    }


    toggleBuyerSend = () => {

        if (this.showErrorIfShould()) {
            return
        };

        this.coinbase((from) => {
            if (this.state.buyer.trim().toLowerCase() == from.trim().toLowerCase()) {
                this.contract.methods.deposit().send({from: this.state.buyer, value: (1000000000000000 * this.state.deposit)}, (error, result) => {
                    if (error === null) {
                        this.setState({
                            buyerSend: !this.state.buyerSend
                        });
                        return
                    }
                });
                return
            }

            ErrorAlert.error('Only buyer can make a deposit', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });


        }, [])




    }

    updateSellerAddress = event => {
        this.setState({seller: event.target.value});
    }

    updateBuyerAddress = event => {
        this.setState({buyer: event.target.value});
    }

    updateDeposit = event => {
        this.setState({deposit: event.target.value});
    }

    showErrorIfShould = () => {
        if (this.source === null || this.contract === null) {
            ErrorAlert.error('No contract deployed', {
                position: 'top-right',
                effect: 'slide',
                timeout: 'none'
            });
            return true
        }

        return false
    }

    getWeb3 = () => ((window.web3.currentProvider != undefined && window.web3.currentProvider != null && window.web3.currentProvider != NaN) ? new Web3(window.web3.currentProvider) : new Web3());

    getInputFileElement = () => document.getElementById('file-input');
    listenFileSelection = (element) => element.addEventListener('change', this.onFileSelect, false);

    onFileSelect = (event) => (this.startEscrowContractFileReading(event));
    startEscrowContractFileReading = event => (this.readEscrowContracts(event))

    readEscrowContracts = (event) => (this.readContracts('../../../build/contracts/Escrow.json', event))
    readContracts = (path, event, reader = new FileReader()) => (reader.onload = this.readFileCallback, reader.readAsText(event.target.files[0]));

    readFileCallback = (event) => this.imperativ({
        proxy: this.createContractProxy(this.parseContractAttribute(event.target.result, 'abi')),
        bin: this.parseContractAttribute(event.target.result, 'bytecode')
    });

    parseContractAttribute = (source, attribute) => JSON.parse(source)[attribute];
    createContractProxy = abi => (new this.web3.eth.Contract(abi));


    unlockBase = pass => this.coinbase(this.unlockAcc, pass)

    coinbase = (fn, par) => (this.web3.eth.getCoinbase((err, res) => fn(res, ...par)))
    unlockAcc = (acc, pass) => this.web3.eth.personal.unlockAccount(acc, pass);

    createContract = (Contract, from, gas, bin) => Contract.new({from: from, gas: gas, data: bin})

    imperativ = (source) => {
        this.source = source;
    }

    render() {
        return (
            <div className="pl-5 pr-5 bg-secondary bg-gradient-light">
                <ErrorAlert stack={{limit: 3}} html={true}/>
                {this.state.modal && <DeployContractModal shouldShow={this.state.modal}/>}
                {this.state.buyerApprove && <BuyerApproveDeal shouldShow={this.state.buyerApprove}/>}
                {this.state.sellerApprove && <SellerApproveDeal shouldShow={this.state.sellerApprove}/>}
                {this.state.buyerCancel && <BuyerCancelDeal shouldShow={this.state.buyerCancel}/>}
                {this.state.sellerCancel && <SellerCancelDeal shouldShow={this.state.sellerCancel}/>}
                {this.state.buyerSend && <BuyerSendMoney shouldShow={this.state.buyerSend}/>}
                <Nav className="bg-secondary pt-5 rounded-left rounded-right" tabs>
                    <NavItem className="bg-light border-primary rounded-top">
                        <NavLink
                            className={classnames({active: this.state.activeTab === '1'})}
                            onClick={() => {
                                this.toggle('1');
                            }}>
                            Contract creation page
                        </NavLink>
                    </NavItem>
                    <NavItem className="bg-light border-primary rounded-top">
                        <NavLink
                            className={classnames({active: this.state.activeTab === '2'})}
                            onClick={() => {
                                this.toggle('2');
                            }}>
                            Send money page (For buyers)
                        </NavLink>
                    </NavItem>
                    <NavItem className="bg-light border-2 rounded-top">
                        <NavLink
                            className={classnames({active: this.state.activeTab === '3'})}
                            onClick={() => {
                                this.toggle('3');
                            }}>
                            Accept money page (For sellers)
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} className="border-0">

                    <TabPane className="bg-light border-0 " tabId="1">
                        <div id="tab1">
                            <Row className="pl-4 pr-2 mb-0 pb-0">
                                <Col sm="12">
                                    <FormGroup className="pt-4 pb-3">
                                        <Label for="exampleFile">Escrow Contract</Label>
                                        <Input type="file" name="file" id="file-input"/>
                                        <FormText color="muted">
                                            Load compiled contract file from your local machine
                                        </FormText>
                                    </FormGroup>
                                    <ListGroup className="pb-4 mr-3">
                                        <ListGroupItem className="pt-4 pb-0" color="success">
                                            <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                                                <InputGroup className="pb-4">
                                                    <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                                    <Input value={this.state.buyer} onChange={this.updateBuyerAddress}
                                                           placeholder="Buyer address"/>
                                                </InputGroup>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                                    <Input value={this.state.seller} onChange={this.updateSellerAddress}
                                                           placeholder="Seller address"/>
                                                </InputGroup>
                                            </Jumbotron>
                                        </ListGroupItem>
                                        <ListGroupItem className="text-right pr-4" color="info"><Button
                                            onClick={this.toggleModal} color="success">Deploy Contract to
                                            Blockchain</Button></ListGroupItem>
                                    </ListGroup>
                                    <Jumbotron fluid className="mr-3 mb-3 pl-4 pr-4 pt-3 pb-1">
                                        <Alert color="success">
                                            Contract deploying will cost 683675 gas for you!
                                            <InputGroup className="w-25 d-inline-block ml-5">
                                                <Input id="inputField" className="input-width d-inline-block" value={this.state.deposit} onChange={this.updateDeposit} placeholder="Enter ammount" />
                                                <InputGroupAddon className="d-inline-block" addonType="append">finney - default deposit</InputGroupAddon>
                                            </InputGroup>
                                        </Alert>
                                    </Jumbotron>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane className="border-0 bg-light" tabId="2">
                        <div id="tab2">
                            <Row className="pl-4 pr-2 mb-0 pb-0 pt-4">
                                <Col sm="12">
                                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-3 pb-4">
                                        <Alert color="success">
                                            Seller receive your money only after your approve!
                                        </Alert>
                                        <Button onClick={this.toggleBuyerSend} className="w-25" color="primary">Send
                                            money</Button>
                                    </Jumbotron>
                                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-3 pb-4">
                                        <Alert color="success">
                                            Approve deal, if you receive product
                                        </Alert>
                                        <Button onClick={this.toggleBuyerApprove} className="w-25" color="primary">Approve
                                            deal</Button>
                                    </Jumbotron>
                                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-3 pb-4">
                                        <Alert color="danger">
                                            After clicking you deal will be canceled!
                                        </Alert>
                                        <Button onClick={this.toggleBuyerCancel} className="w-25" color="danger">Cancel
                                            deal</Button>
                                    </Jumbotron>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>


                    <TabPane className="border-0 bg-light" tabId="3">
                        <div id="tab3">
                            <Row className="pl-4 pr-2 mb-0 pb-0 pt-4">
                                <Col sm="12">
                                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                                        <Alert color="success">
                                            To approve deal, after receiving money
                                        </Alert>
                                        <Button onClick={this.toggleSellerApprove} className="w-25" color="primary">Approve
                                            money receiving</Button>
                                    </Jumbotron>
                                    <Jumbotron fluid className="mr-2 pl-4 pr-4 pt-4 pb-4">
                                        <Alert color="danger">
                                            After clicking you deal will be canceled!
                                        </Alert>
                                        <Button onClick={this.toggleSellerCancel} className="w-25" color="danger">Cancel
                                            deal</Button>
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
