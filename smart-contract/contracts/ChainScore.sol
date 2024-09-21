// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ChainScore {
    struct user {
        address walletAddress;
        string name;
        string email;
        string phoneNumber;
    }

    struct companyContract {
        string contractID;
        address fromWallet;
        address toWallet;
        uint amount;
        uint paymentDate;
        uint startDate;
        uint createdAt;
    }

    struct companyContractStatus {
        string contractId;
        string status;
    }

    struct userPayment {
        string contractId;
        uint paymentDate;
        uint amount;
    }

    struct trustScore {
        address walletAddress;
        uint avScore;
        uint lastUpdatedAt;
    }

    string[] public contractIds;


    mapping(string => companyContract) public companyContracts;


    function initializeBusinessContract(string memory contractID, address fromWallet, address toWallet, uint amount, uint paymentDate, uint startDate) public {
        // Check if all parameters are provided
        require(bytes(contractID).length > 0, "Contract ID is required");
        require(fromWallet != address(0), "From wallet address is required");
        require(toWallet != address(0), "To wallet address is required");
        require(amount > 0, "Amount must be greater than zero");
        require(paymentDate > 0, "Payment date is not valid");
        require(startDate > 0, "Start date is not valid");

        // throw an error if the contract already exists
        require(bytes(companyContracts[contractID].contractID).length == 0, "Contract already exists");

        // initialize the contract
        companyContract storage newContract = companyContracts[contractID];
        newContract.contractID = contractID;
        newContract.fromWallet = fromWallet;
        newContract.toWallet = toWallet;
        newContract.amount = amount;
        newContract.paymentDate = paymentDate;
        newContract.startDate = startDate;
        newContract.createdAt = block.timestamp;

        // add the contract id to the contract ids array
        contractIds.push(contractID);

    }

}