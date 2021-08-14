// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

library LibA {
  bytes32 constant ST_STORAGE_POSITION = keccak256("Simple.Test.storage");
  struct TestData {
    string name;
  }

  function getData() internal pure returns (TestData storage td) {
    bytes32 position = ST_STORAGE_POSITION;
    assembly {
      td.slot := position
    }
  }
}

contract SimpleTestFacet {
  event ContractCreated(string name);
  event NameSet(string name);

  function getName() public view returns (string memory) {
    LibA.TestData storage fs = LibA.getData();
    return fs.name;
  }

  function setName(string memory _newName) external {
    LibA.TestData storage fs = LibA.getData();
    fs.name = _newName;
    emit NameSet(fs.name);
  }

  constructor(string memory _name) {
    LibA.TestData storage fs = LibA.getData();
    fs.name = _name;
  }
}
