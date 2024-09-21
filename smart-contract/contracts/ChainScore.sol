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

    mapping(address => user) public users;
    mapping(string => companyContract) public companyContracts;
    mapping(string => userPayment[]) public userPayments;
    mapping(address => trustScore[]) public trustScores;
    mapping(bytes32 => companyContractStatus) private contractStatuses;
    mapping (address => trustScorePerContract[]) public trustScorePerContracts;
    mapping (string => trustScorePerContract) private contractScore;

    function initializeBusinessContract(string memory contractID, address fromWallet, address toWallet, uint amount, uint paymentDate, uint startDate) public {
        require(bytes(contractID).length > 0, "Contract ID is required");
        require(fromWallet != address(0), "From wallet address is required");
        require(toWallet != address(0), "To wallet address is required");
        require(amount > 0, "Amount must be greater than zero");
        require(paymentDate > 0, "Payment date is not valid");
        require(startDate > 0, "Start date is not valid");

        require(bytes(companyContracts[contractID].contractID).length == 0, "Contract already exists");

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

        contractScore[contractID] = newTrustScorePerContract;
    }

    function payContract(string memory contractID) public payable {
        require(bytes(contractID).length > 0, "Contract ID is required");

        require(bytes(companyContracts[contractID].contractID).length > 0, "Contract does not exist");

        uint256 amountToPay = companyContracts[contractID].amount;
        require(msg.value == (amountToPay), "Amount sent is not matching the request amount");

        payable(companyContracts[contractID].toWallet).transfer(msg.value);

        addBusinessContractPayment(contractID, block.timestamp, amountToPay);
    }

    function addBusinessContractPayment(string memory contractID, uint paymentDate, uint amount) public {
        require(bytes(contractID).length > 0, "Contract ID is required");
        require(paymentDate > 0, "Payment date is not valid");
        require(amount > 0, "Amount must be greater than zero");

        userPayment memory newPayment = userPayment({
            contractId: contractID,
            paymentDate: paymentDate,
            amount: amount
        });

        userPayments[contractID].push(newPayment);
    }

    function _stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function setContractStatus(string memory _contractId, string memory _status) public {
        bytes32 contractKey = _stringToBytes32(_contractId);
        contractStatuses[contractKey] = companyContractStatus(_contractId, _status);
    }

    function getContractStatus(string memory _contractId) public view returns (string memory) {
        bytes32 contractKey = _stringToBytes32(_contractId);
        companyContractStatus memory statusData = contractStatuses[contractKey];
        require(bytes(statusData.contractId).length != 0, "Contract ID does not exist.");
        return statusData.status;
    }


    function createAndReturnOpenContractIds() public pure returns (string[] memory) {

    }

    function verifyPaymentsAtMidnight() public {
        for (uint i = 0; i < contractIds.length; i++) {
            string memory contractId = contractIds[i];
            companyContract storage currentContract = companyContracts[contractId];
            userPayment[] storage payments = userPayments[contractId];
                

            uint currentTrustScore = 0;
            uint totalPaymentsMade = payments.length;
            uint monthsSinceStartDate = monthsBetween(currentContract.startDate, block.timestamp);

            if (totalPaymentsMade == 0 && (totalPaymentsMade < monthsSinceStartDate)) {
                uint daysSinceLastPayment = daysBetween(currentContract.startDate, block.timestamp);
                currentTrustScore = calculateTrustScore(daysSinceLastPayment);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
                
            } else if (totalPaymentsMade == monthsSinceStartDate) {
               currentTrustScore = calculateTrustScore(0);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
             
            } else if (totalPaymentsMade < monthsSinceStartDate) {
                uint lastPaymentDate = payments[totalPaymentsMade - 1].paymentDate;
                uint daysSinceLastPayment = daysBetween(lastPaymentDate, block.timestamp);
                currentTrustScore = calculateTrustScore(daysSinceLastPayment);
                updateTrustScore(currentContract.fromWallet, currentTrustScore, contractId);
            }
        }
    }


    function monthsBetween(uint startDate, uint currentDate) internal pure returns (uint) {
        if (currentDate < startDate) {
            uint temp = startDate;
            startDate = currentDate;
            currentDate = temp;
        }
        
        uint secondsInMonth = 30 * 86400;

        uint differenceInSeconds = currentDate - startDate;
        return differenceInSeconds / secondsInMonth;
    }

 
    function daysBetween(uint startDate, uint endDate) internal pure returns (uint) {
        uint differenceInSeconds = endDate >= startDate ? (endDate - startDate) : (startDate - endDate);

        uint secondsInDay = 86400;

        return (differenceInSeconds + (secondsInDay / 2)) / secondsInDay;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }


    function updateTrustScore(address walletAddress, uint score, string memory contractId) public {

        trustScorePerContract storage contractTrustScore = contractScore[contractId];

        contractTrustScore.score = score;

        trustScorePerContract[] storage scores = trustScorePerContracts[walletAddress];

        for (uint i = 0; i < scores.length; i++) {
            bool isCorrectContract = compareStrings(scores[i].contractId, contractId);
            if (isCorrectContract){
                scores[i].score = score;
                break;
            }
        }
    }

    function calculateTrustScore(uint daysLate) internal pure returns (uint) {

        if (daysLate == 0) {
            return 10;
        }

        if (daysLate > 0 && daysLate <= 90) {
            return 5;
        }

        if (daysLate > 90) {
            return 0;
        }

        return 0;
    
    }

    function getTrustScore(address walletAddress) public view returns (uint) {

        trustScorePerContract[] storage scores = trustScorePerContracts[walletAddress];
        require(scores.length > 0, "No trust scores found for this wallet");

        uint totalScore = 0;
        for (uint i = 0; i < scores.length; i++) {
            totalScore += scores[i].score;
        }

        if (scores.length == 0) {
            return 0;
        }
        return ((totalScore / scores.length) *10);
    }

    function getWalletContractsIds(address walletAddress) public view returns (string[] memory) {
        string[] memory contracts = new string[](contractIds.length);
        uint contractCount = 0;
        for (uint i = 0; i < contractIds.length; i++) {
            string memory contractId = contractIds[i];
            companyContract storage currentContract = companyContracts[contractId];
            if (currentContract.fromWallet == walletAddress || currentContract.toWallet == walletAddress) {
                contracts[contractCount] = contractId;
                contractCount++;
            }
        }

        if(contractCount == 0) {
            return new string[](0);
        }

        string[] memory contractIdsList = new string[](contractCount);
        for (uint i = 0; i < contractCount; i++) {
            contractIdsList[i] = contracts[i];
        }

        return contractIdsList;
    }

    function getWalletContracts(address walletAddress) public view returns (companyContract[] memory) {

        string[] memory contracts = getWalletContractsIds(walletAddress);
        
        if(contracts.length == 0) {
            return new companyContract[](0);
        }

        companyContract[] memory contractsDetails = new companyContract[](contracts.length);
        for (uint i = 0; i < contracts.length; i++) {
            string memory contractId = contracts[i];
            contractsDetails[i] = getContractDetail(contractId);
        }
        return contractsDetails;
    }

    function getContractDetail(string memory contractId) public view returns (companyContract memory) {
        require(bytes(contractId).length > 0, "Contract ID is required");
        require(bytes(companyContracts[contractId].contractID).length > 0, "Contract does not exist");

        companyContract memory contractDetails = companyContracts[contractId];
        return contractDetails;
    }

    function getPaymentHistory(string memory contractId) public view returns (userPayment[] memory) {
        require(bytes(contractId).length > 0, "Contract ID is required");
        require(bytes(companyContracts[contractId].contractID).length > 0, "Contract does not exist");

        return userPayments[contractId];
    }
}