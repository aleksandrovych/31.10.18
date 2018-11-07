import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component {

getWeb3 = () => ((window.web3.currentProvider != undefined && window.web3.currentProvider != null && window.web3.currentProvider != NaN) ? window.web3.currentProvider: new Web3());

constructor(props) {
  super(props);

  this.getWeb3 = this.getWeb3.bind(this);
  this.readContracts = this.readContracts.bind(this);
  this.readEscrowContracts = this.readEscrowContracts.bind(this);
  this.readContractsMixinCallback = this.readContractsMixinCallback.bind(this);
  this.parseContractsJSON = this.parseContractsJSON.bind(this);
  //this.parseContractsABI = this.parseContractsABI.bind(this);
  this.readFileCallback = this.readFileCallback.bind(this);
  //this.endEscrowContractFileReading = this.endEscrowContractFileReading.bind(this);
  this.onFileSelect = this.onFileSelect.bind(this);

  this.web3 = this.getWeb3();
}

//
componentDidMount() {
  document.getElementById('file-input').addEventListener('change', this.onFileSelect, false);
  // this.startEscrowContractFileReading(/*this.endEscrowContractFileReading(*/this.readFileCallback/*())*/);
}

onFileSelect = (event) => this.startEscrowContractFileReading(this.readFileCallback, event);

readContracts =  (path, event, reader = new FileReader()) => (reader.readAsText(event.target.files[0]), reader); // 1
readContractsMixinCallback = (path, callback, event) => (console.log("2: ", path, callback), this.readContracts(path, event).onload = callback ) // 2
readEscrowContracts = (callback, event) => (console.log("3: ", callback), this.readContractsMixinCallback('../../../build/contracts/Escrow.json', callback, event)) // 3
startEscrowContractFileReading = (callback, event) => (console.log("4: ", callback), this.readEscrowContracts(callback, event)) // 4
//endEscrowContractFileReading = fileParsedText => (console.log("5: ", fileParsedText), this.parseContractsABI('Escrow')(fileParsedText)) // 5
readFileCallback = event => (console.log("6: ", event.target.result)/*, this.parseContractsJSON(reader.result)*/); // 6
//parseContractsABI = Contract => contracts => (console.log("7: ", contracts), (typeof(contracts[Contract]) !== undefined && contracts != undefined) ? JSON.parse(contracts[Contract].abi) : ""); // 7
parseContractsJSON = source => (console.log("8: ", source), JSON.parse(source)["contracts"]); // 8

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
