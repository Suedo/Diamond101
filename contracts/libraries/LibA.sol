// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

library LibA {
  bytes32 constant ST_STORAGE_POSITION = keccak256("Simple.Test.storage");
  struct TestData {
    string name;
    uint256 age;
    uint256[] numbers;
  }

  function getData() internal pure returns (TestData storage td) {
    bytes32 position = ST_STORAGE_POSITION;
    assembly {
      td.slot := position
    }
  }
}