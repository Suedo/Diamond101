// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;


library LibCF {
  bytes32 constant CF_STORAGE_POSITION = keccak256("Crowd.Funding.storage");

  enum Status {Ongoing, Failed, Succeeded, PaidOut} // internally recorded as 0,1,2,3

  struct CFData {
    string name;
    uint256 targetAmount;
    uint256 fundingDeadline;
    address beneficiary;
    Status status;
    mapping(address => uint256) amounts;
    uint256 totalCollected;
    bool collected;
  }

  // first, we need a function that will give the struct we want: CFData
  function getData() internal pure returns (CFData storage cf) {
    bytes32 position = CF_STORAGE_POSITION;
    assembly {
      cf.slot := position
    }
  }
}

// A crowd funcding facet with deadline
contract CrowdFundFacet {

  modifier inState(LibCF.Status expectedStatus) {
    LibCF.CFData storage fs = LibCF.getData();    // fs :: facet storage
    require(fs.status == expectedStatus, "Invalid State");
    _;
  }

  function getTargetAmount() public view returns(uint256) {
    LibCF.CFData storage fs = LibCF.getData();
    return fs.targetAmount;
  }

  function contribute() public payable inState(LibCF.Status.Ongoing) {
    LibCF.CFData storage fs = LibCF.getData();

    fs.amounts[msg.sender] += msg.value;
    fs.totalCollected += msg.value;

    if (fs.totalCollected >= fs.targetAmount) {
      fs.collected = true;
    }
  }

  function isClosed() public view returns (bool) {
    LibCF.CFData storage fs = LibCF.getData();

    return block.timestamp > fs.fundingDeadline || fs.status != LibCF.Status.Ongoing;
  }

  function tryClosing() public returns (bool) {
    LibCF.CFData storage fs = LibCF.getData();

    require(fs.totalCollected >= fs.targetAmount, "Amount not met");
    require(block.timestamp > fs.fundingDeadline, "Time left");
    fs.status = LibCF.Status.Succeeded;
    return true;
  }

  constructor(
    string memory _contractName,
    uint256 _targetAmountEth,
    uint256 _durationInMin,
    address payable _beneficiary
  ) {
    LibCF.CFData storage fs = LibCF.getData();

    fs.name = _contractName;
    fs.targetAmount = _targetAmountEth * 1 ether; // convert ether to wei, and save as wei
    fs.fundingDeadline = block.timestamp + (_durationInMin * 1 minutes);
    fs.beneficiary = _beneficiary;
    fs.status = LibCF.Status.Ongoing;
  }
}
