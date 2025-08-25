// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";

contract SimpleTest {
    euint64 private testValue;
    ebool private testBool;
    
    constructor() {
        // Initialization with correct syntax
        testValue = FHE.asEuint64(0);
        testBool = FHE.asEbool(false);
    }
    
    function testConversion(uint64 value) external {
        testValue = FHE.asEuint64(value);
    }
    
    function testArithmetic(uint64 a, uint64 b) external {
        euint64 encryptedA = FHE.asEuint64(a);
        euint64 encryptedB = FHE.asEuint64(b);
        
        // Correct arithmetic with FHE types
        testValue = FHE.add(encryptedA, encryptedB);
    }
    
    function testComparison(uint64 a, uint64 b) external returns (ebool) {
        euint64 encryptedA = FHE.asEuint64(a);
        euint64 encryptedB = FHE.asEuint64(b);
        
        // Correct comparison
        return FHE.gt(encryptedA, encryptedB);
    }
}
