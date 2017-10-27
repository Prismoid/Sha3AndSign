/*** require the external Liblary ***/
// employed as the function
var BigNumber = require('bignumber.js'); // npm install bignumber, https://www.npmjs.com/package/bignumber.js
var leftPad = require('left-pad'); // npm install left-pad, https://www.npmjs.com/package/left-pad
var web3utils = require('web3-utils'); // npm install web3-utils, https://www.npmjs.com/package/web3-utils
// making a Web3 instance
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount=web3.eth.accounts[0];

// making a contract instance (Sha3AndSign)
var contract_json = require('../build/contracts/Sha3AndSign.json');
var addr = contract_json.networks[1].address;
var abi = contract_json.abi;
var contract = web3.eth.contract(abi).at(addr);

// varialbe for using arguments
var addr_array = [web3.eth.accounts[0], web3.eth.accounts[1]];
var num_array = [8, 16];
var uint72 = 300;
var x1 = new BigNumber('0x2710'); // making Large Value 
var uint128 = "0x" + leftPad(web3.toHex(x1).slice(2).toString(16), 32, 0); // converting x1 into string(HexString(32 * 4 = 128bit))

// Experiments
console.log("--- Sha3_1(address[] a) Experiment ---");
console.log("sha3(address[] a) on contract: " + contract.Sha3_1.call(addr_array));
console.log("sha3(address[] a) on local(web3-utils, type -> address[]): " + web3utils.soliditySha3({t: "address[]", v: addr_array}));
console.log("sha3(address[] a) on local(web3-utils, type -> uint256[]): " + web3utils.soliditySha3({t: "uint256[]", v: addr_array}));
console.log("sha3(address[] a) on local(web3-utils, type -> uint160[]): " + web3utils.soliditySha3({t: "uint160[]", v: addr_array}));
console.log();

console.log("--- Sha3_2(uint16[] a, address[] b) Experiment ---");
console.log("sha3(uint16[] a, address[] b) on contract: " + contract.Sha3_2.call(num_array, addr_array));
console.log("sha3(uint16[] a, address[] b ) on local(web3-utils, type -> uint16[], type -> address[]), This is a BUG!!: "
	    + web3utils.soliditySha3({t: "uint16[]", v: num_array}, {t: "address[]", v: addr_array}));
console.log("sha3(uint16[] a, address[] b) on local(web3-utils, type -> uint256[], type -> address[]), This result is correct!: "
	    + web3utils.soliditySha3({t: "uint256[]", v: num_array}, {t: "address[]", v: addr_array}));
console.log("sha3(uint16[] a, address[] b) on local(web3-utils, type -> uint16[], type -> uint256[]), This is a BUG!!: "
	    + web3utils.soliditySha3({t: "uint16[]", v: num_array}, {t: "uint256[]", v: addr_array}));
console.log();

console.log("---  Sha3_5(uint72 a, uint128 b, uint16[] c, address[] d) Experiment ---");
console.log("sha3(uint72 a, uint128 b, uint16[] c, address[] d) on contract: \n" + contract.Sha3_5.call(uint72, uint128, num_array, addr_array));
console.log("sha3(uint72 a, uint128 b, uint16[] c, address[] d) on local(web3-utils, type -> uint72, type -> uint128, type -> uint16[], type -> address[]), This is a BUG!!: \n"
	    + web3utils.soliditySha3({t: "uint72", v: uint72}, {t: "uint128", v: uint128}, {t: "uint16[]", v: num_array}, {t: "address[]", v: addr_array}));
console.log("sha3(uint72 a, uint128 b, uint16[] c, address[] d) on local(web3-utils, type -> uint72, type -> uint128, type -> uint16[], type -> uint256[]), This is a BUG!!: \n"
	    + web3utils.soliditySha3({t: "uint72", v: uint72}, {t: "uint128", v: uint128}, {t: "uint16[]", v: num_array}, {t: "uint256[]", v: addr_array}));
console.log("sha3(uint72 a, uint128 b, uint16[] c, address[] d) on local(web3-utils, type -> uint72, type -> uint128, type -> uint256[], type -> uint256[]), This result is correct!: \n"
	    + web3utils.soliditySha3({t: "uint72", v: uint72}, {t: "uint128", v: uint128}, {t: "uint256[]", v: num_array}, {t: "uint256[]", v: addr_array}));
console.log();

console.log("--- ecrecover Test --- ");
// variables for ecrecover

var msg = web3utils.soliditySha3({t: "uint72", v: uint72}, {t: "uint128", v: uint128}, {t: "uint256[]", v: num_array}, {t: "uint256[]", v: addr_array});
var sig = web3.eth.sign(web3.eth.accounts[0], msg);
var v = Number(sig.slice(130,132)) + 27; // This is only a variable of numeric type.
var r = sig.slice(0,66);
var s = '0x' + sig.slice(66,130);

console.log("Return Address: " + contract.ECSignRetAddr.call(uint72, uint128, num_array, addr_array, v, r, s));
console.log("Return Sign Check: " + contract.ECSignCheck.call(uint72, uint128, num_array, addr_array, v, r, s));
console.log();

console.log("Conclusion: If we use an array variable for a soliditySha3's argument, we should set the type \"uint256[]\"!!!");

