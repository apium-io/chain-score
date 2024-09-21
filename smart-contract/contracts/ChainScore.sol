// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ChainScore {
  // optional struct- if we want to map wallet address to a user/business
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

    struct trustScorePerContract {
        string contractId;
        address walletAddress;
        uint score;
    }

    struct trustScore {
        address walletAddress;
        uint avScore;
        uint lastUpdatedAt;
    }

    string[] public contractIds;

    // mappings
    mapping(address => user) public users;
    mapping(string => companyContract) public companyContracts;
    mapping(string => userPayment[]) public userPayments;
    mapping(address => trustScore[]) public trustScores;
    mapping(bytes32 => companyContractStatus) private contractStatuses;
    mapping (address => trustScorePerContract[]) public trustScorePerContracts;
    mapping (string => trustScorePerContract) private contractScore;

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

        // create trustScorePerProject
        trustScorePerContract memory newTrustScorePerContract = trustScorePerContract({
            contractId: contractID,
            walletAddress: fromWallet,
            score: 10
        });

         // Add the trust score to the wallet's list of trust scores (array)
        trustScorePerContracts[fromWallet].push(newTrustScorePerContract);

        // add the trust score to the contract id
        contractScore[contractID] = newTrustScorePerContract;
    }

    function payContract(string memory contractID) public payable {
        // Check if all parameters are provided
        require(bytes(contractID).length > 0, "Contract ID is required");

        // throw an error if the contract does not exist
        require(bytes(companyContracts[contractID].contractID).length > 0, "Contract does not exist");

        //UPDATED: as the amount is stored in wei, we don't need to convert it to wei
        uint256 amountToPay = companyContracts[contractID].amount;
        require(msg.value == (amountToPay), "Amount sent is not matching the request amount");

        // transfer the amount to the toWallet
        payable(companyContracts[contractID].toWallet).transfer(msg.value);

        // add the payment to the user payments array
        addBusinessContractPayment(contractID, block.timestamp, amountToPay);
    }

    function addBusinessContractPayment(string memory contractID, uint paymentDate, uint amount) public {
        // Check if all parameters are provided
        require(bytes(contractID).length > 0, "Contract ID is required");
        require(paymentDate > 0, "Payment date is not valid");
        require(amount > 0, "Amount must be greater than zero");

        // Add the payment
        userPayment memory newPayment = userPayment({
            contractId: contractID,
            paymentDate: paymentDate,
            amount: amount
        });

        userPayments[contractID].push(newPayment);
    }

    function verifyPaymentsAtMidnight() public {
        for (uint i = 0; i < contractIds.length; i++) {
            string memory contractId = contractIds[i];
            companyContract storage currentContract = companyContracts[contractId];
            userPayment[] storage payments = userPayments[contractId];
                

            // uint monthsSinceStartDate = 5;
            uint currentTrustScore = 0;
            uint totalPaymentsMade = payments.length;
            uint monthsSinceStartDate = monthsBetween(currentContract.startDate, block.timestamp);

            //if no payments are made at all
            if (totalPaymentsMade == 0 && (totalPaymentsMade < monthsSinceStartDate)) {
                uint daysSinceLastPayment = daysBetween(currentContract.startDate, block.timestamp);
                // Pass the number of days late to the trust score calculation
                currentTrustScore = calculateTrustScore(daysSinceLastPayment);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
                
            } else if (totalPaymentsMade == monthsSinceStartDate) {
                // Payments up to date, pass 0 to the trust score calculation
               currentTrustScore = calculateTrustScore(0);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
             
            } else if (totalPaymentsMade < monthsSinceStartDate) {
                uint lastPaymentDate = payments[totalPaymentsMade - 1].paymentDate;
                uint daysSinceLastPayment = daysBetween(lastPaymentDate, block.timestamp);
                // Pass the number of days late to the trust score calculation
                currentTrustScore = calculateTrustScore(daysSinceLastPayment);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
            }
        }
    }


    function monthsBetween(uint startDate, uint currentDate) internal pure returns (uint) {
        // Ensure the dates are in the correct order, swapping them if necessary
        if (currentDate < startDate) {
            uint temp = startDate;
            startDate = currentDate;
            currentDate = temp;
        }
        
        // Number of seconds in an approximate month (30 days)
        uint secondsInMonth = 30 * 86400; // 30 days * 86400 seconds/day

        // Calculate the difference in seconds and divide by secondsInMonth
        uint differenceInSeconds = currentDate - startDate;
        return differenceInSeconds / secondsInMonth;
    }

 
    function daysBetween(uint startDate, uint endDate) internal pure returns (uint) {
        uint differenceInSeconds = endDate >= startDate ? (endDate - startDate) : (startDate - endDate);

        // Number of seconds in a day
        uint secondsInDay = 86400;

        // To round to the nearest day, we add half of `secondsInDay` to the difference before dividing
        return (differenceInSeconds + (secondsInDay / 2)) / secondsInDay;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }


    function updateTrustScore(address walletAddress, uint score, string memory contractId) public {

        // fetch the trust score for the contract
        trustScorePerContract storage contractTrustScore = contractScore[contractId];

        // update the score for the contract
        contractTrustScore.score = score;

        // fetch the project scores for the wallets address
        trustScorePerContract[] storage scores = trustScorePerContracts[walletAddress];

        // loop and find the score for the contract id
        for (uint i = 0; i < scores.length; i++) {
            bool isCorrectContract = compareStrings(scores[i].contractId, contractId);
            if (isCorrectContract){
                // update the score for the project
                scores[i].score = score;
                break;
            }
        }
    }

    function calculateTrustScore(uint daysLate) internal pure returns (uint) {

        // if daysLate is 0, return 10
        if (daysLate == 0) {
            return 10;
        }

        // if daysLate is between 1-90 return 5
        if (daysLate > 0 && daysLate <= 90) {
            return 5;
        }

        // if daysLate is more than 90, return 0
        if (daysLate > 90) {
            return 0;
        }

        return 0;
    
    }
}