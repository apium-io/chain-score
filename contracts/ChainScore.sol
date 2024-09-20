// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract B2BContract {
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
}