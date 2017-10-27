pragma solidity ^0.4.15;
contract Sha3AndSign {
  /*** sha3(alias of keccak256 on solidity) Test ***/
  // type1: address[]
  function Sha3_1(address[] a) public returns(bytes32){
    return sha3(a);
  }
  // type2: uint16[], address[]
  function  Sha3_2(uint16[] a, address[] b) public returns(bytes32){
    return sha3(a, b);
  }
  // type3: uint256[], address[]
  function Sha3_3(uint256[] a, address[] b) public returns(bytes32){
    return sha3(a, b);
  }
  // type4: bytes2[], address[]
  function Sha3_4(bytes2[] a, address[] b) public returns(bytes32){
    return sha3(a, b);
  }
  // type5: many arguments
  function Sha3_5(uint72 a, uint128 b, uint16[] c, address[] d) public returns(bytes32){
    return sha3(a, b, c, d);
  }

  /*** ecrecover Test ***/
  // return Signer's Address
  function ECSignRetAddr(uint72 a, uint128 b, uint16[] c, address[] d, uint8 v, bytes32 r, bytes32 s) public returns(address){
    // ecrecover: The first argument is bytes32
    return ecrecover(sha3(a, b, c, d), v, r, s);
  }
  // check whether sender made this signature
  function ECSignCheck(uint72 a, uint128 b, uint16[] c, address[] d, uint8 v, bytes32 r, bytes32 s) public returns(bool){
    return (ecrecover(sha3(a, b, c, d), v, r, s) == msg.sender);
  }
}
