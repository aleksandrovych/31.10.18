var Escrow = artifacts.require("./Escrow.sol");

module.exports = function(deployer) {
  deployer.deploy(Escrow, '0x198198c8251f5044f6abb089a502bc42a4667005', '0x9765e26503937b3251fd88bf0d4df7d00121d297').then((instance) => {
    return instance //.testReturn.call()
  }).then(res => {
    console.log("blah", {res});
  });
};
