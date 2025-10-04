// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./lib/PaymentSplitter.sol";

/**
 * @title TruthPaymentSplitter
 * @dev This contract is just a wrapper to use PaymentSplitter
 * No custom logic needed - the base contract handles everything
 */
contract TruthPaymentSplitter is PaymentSplitter {
    constructor(
        address[] memory payees,
        uint256[] memory shares_
    ) PaymentSplitter(payees, shares_) {}
}