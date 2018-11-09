import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Utils from './Lib/Utils';
import composeAsync from './Lib/ComposeAsync';
import compose from './Lib/ComposeSync';

const PASSWORD = 'robotBorsh1';

class App extends Component {

constructor(props) {
  super(props);

  Utils.autobind(this);
  this.web3 = this.getWeb3();
}

componentDidMount() {
  compose(this.getInputFileElement, this.listenFileSelection)()
  this.unlockBase(PASSWORD);
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
coinbase = (fn, par) => (console.log('par: ', par), this.web3.eth.getCoinbase((err, res) => fn(res, ...par)))
unlockAcc = (acc, pass) =>  this.web3.eth.personal.unlockAccount(acc, pass);
//
createContract = (Contract, from, gas, bin) => Contract.new({from: from, gas: gas, data: bin})

imperativ = (source) => {

  this.coinbase((from) => {
    const contract = source.proxy;
    contract.options.gas = 3000000;
    contract.options.gasPrice = 21;
    contract.options.address = from;

  //  console.log('contract.methods.testReturn: ', contract.methods.testReturn.call());

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
      <div className="App">
        <header className="App-header">
        <input type="file" id="file-input" />
        <h3>Contents of the file:</h3>
        <pre id="file-content"></pre>
        </header>
      </div>
    );
  }
}




export default App;
