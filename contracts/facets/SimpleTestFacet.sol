// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import '../libraries/LibA.sol';

contract SimpleTestFacet {
  event ContractCreated(string name);
  event NameSet(string name);
  event NumberAdded(uint256 number);
  event AllNumbers(uint256[] numbers);

  function getName() public view returns (string memory name) {
    LibA.TestData storage fs = LibA.getData();
    return fs.name;
  }

  function setName(string memory _newName) external {
    LibA.TestData storage fs = LibA.getData();
    fs.name = _newName;
    emit NameSet(fs.name);
  }

  function getNumbers() public returns (uint256[] memory) {
    LibA.TestData storage fs = LibA.getData();
    emit AllNumbers(fs.numbers);
    return fs.numbers;
  }

  function addNumber(uint256 _num) public {
    LibA.TestData storage fs = LibA.getData();
    fs.numbers.push(_num);
    uint256 newNum = fs.numbers[fs.numbers.length - 1];
    emit NumberAdded(newNum);
  }

  function getCount() public view returns(uint256 count) {
    LibA.TestData storage fs = LibA.getData();
    return fs.numbers.length; 
  }

  constructor(string memory _name) {
    LibA.TestData storage fs = LibA.getData();
    fs.name = _name;
  }
}
