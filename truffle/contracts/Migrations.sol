pragma solidity ^0.4.23;

contract Migrations {
  address public owner;
  uint public last_completed_migration;
  uint public c;

  constructor() public {
    owner = msg.sender;
    uint a = 5;
    c = 10;
    doNothing();
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function doNothing() {
    c = 15;
    doNothing2();
  }

  function doNothing2() {
    c = 35;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
