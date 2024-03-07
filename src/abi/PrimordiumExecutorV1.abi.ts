const PrimordiumExecutorV1Abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AddressInsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AuthorizedInitializerAlreadySet",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "BalanceSharesInitializationCallFailed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "reason",
        "type": "bytes"
      }
    ],
    "name": "CallReverted",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "min",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max",
        "type": "uint256"
      }
    ],
    "name": "DelayOutOfRange",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DepositSharesAlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "expectedOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "currentOwner",
        "type": "address"
      }
    ],
    "name": "DistributorInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "executorToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "distributorToken",
        "type": "address"
      }
    ],
    "name": "DistributorInvalidTokenAddress",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "ERC1967InvalidImplementation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC1967NonPayable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ETHTransferFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedInnerCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FailedToTransferBaseAsset",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "balanceTransferAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentBalance",
        "type": "uint256"
      }
    ],
    "name": "InsufficientBaseAssetFunds",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "InvalidBaseAssetOperation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidCallParameters",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidDepositAmount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contract",
        "type": "address"
      },
      {
        "internalType": "bytes4",
        "name": "missingInterfaceId",
        "type": "bytes4"
      }
    ],
    "name": "InvalidERC165InterfaceSupport",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "InvalidModuleAddress",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "actual",
        "type": "uint256"
      }
    ],
    "name": "InvalidMsgValue",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "enum ITimelockAvatar.OperationStatus",
        "name": "currentStatus",
        "type": "uint8"
      },
      {
        "internalType": "enum ITimelockAvatar.OperationStatus",
        "name": "requiredStatus",
        "type": "uint8"
      }
    ],
    "name": "InvalidOperationStatus",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pageSize",
        "type": "uint256"
      }
    ],
    "name": "InvalidPageSize",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "prevModule",
        "type": "address"
      }
    ],
    "name": "InvalidPreviousModuleAddress",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "start",
        "type": "address"
      }
    ],
    "name": "InvalidStartModule",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MathOverflowedMulDiv",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "min",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max",
        "type": "uint256"
      }
    ],
    "name": "MinDelayOutOfRange",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "ModuleAlreadyEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ModuleInitializationNeedsMoreThanZeroModules",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "ModuleNotEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ModulesAlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "guard",
        "type": "address"
      }
    ],
    "name": "NotIERC165Compliant",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlySelfAuthorized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlySharesOnboarder",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "executingModule",
        "type": "address"
      }
    ],
    "name": "SenderMustBeExecutingModule",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      }
    ],
    "name": "SignatureDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "signatureExpiration",
        "type": "uint256"
      }
    ],
    "name": "SignatureExpirationMustBeInFuture",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UUPSUnauthorizedCallContext",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "slot",
        "type": "bytes32"
      }
    ],
    "name": "UUPSUnsupportedProxiableUUID",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "authorizedInitializer",
        "type": "address"
      }
    ],
    "name": "UnauthorizedInitializer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UnauthorizedModule",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "balanceSharesManager",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "balanceShareId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "contract IERC20",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountAllocated",
        "type": "uint256"
      }
    ],
    "name": "BalanceShareAllocated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "balanceSharesManager",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalDeposits",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "depositsAllocated",
        "type": "uint256"
      }
    ],
    "name": "BalanceSharesInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldBalanceSharesManager",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newBalanceSharesManager",
        "type": "address"
      }
    ],
    "name": "BalanceSharesManagerUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "CallExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "guard",
        "type": "address"
      }
    ],
    "name": "ChangedGuard",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "contract IERC20",
        "name": "quoteAsset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "depositAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "mintAmount",
        "type": "uint256"
      }
    ],
    "name": "DepositRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "DisabledModule",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldDistributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDistributor",
        "type": "address"
      }
    ],
    "name": "DistributorUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      }
    ],
    "name": "EIP1271MessageCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "signatureExpiration",
        "type": "uint256"
      }
    ],
    "name": "EIP1271MessageSigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "EnabledModule",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "ExecutionFromModuleFailure",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "ExecutionFromModuleSuccess",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "authorizedInitializer",
        "type": "address"
      }
    ],
    "name": "InitializerAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldMinDelay",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newMinDelay",
        "type": "uint256"
      }
    ],
    "name": "MinDelayUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "modules_",
        "type": "address[]"
      }
    ],
    "name": "ModulesInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "OperationCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "OperationExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "module",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "delay",
        "type": "uint256"
      }
    ],
    "name": "OperationScheduled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldSharesOnboarder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newSharesOnboarder",
        "type": "address"
      }
    ],
    "name": "SharesOnboarderUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "sharesBurned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSharesSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "contract IERC20[]",
        "name": "assets",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "payouts",
        "type": "uint256[]"
      }
    ],
    "name": "WithdrawalProcessed",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "DEPOSITS_ID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DISTRIBUTIONS_ID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GRACE_PERIOD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_DELAY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_DELAY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADE_INTERFACE_VERSION",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "authorizeDistributorImplementation",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "balanceSharesEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isBalanceSharesEnabled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "balanceSharesManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "_balanceSharesManager",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "cancelOperation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      }
    ],
    "name": "cancelSignature",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "createDistribution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "prevModule",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "disableModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributor",
    "outputs": [
      {
        "internalType": "contract IDistributionCreator",
        "name": "_distributor",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "applyDepositSharesRetroactively",
        "type": "bool"
      }
    ],
    "name": "enableBalanceShares",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "enableModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "execTransactionFromModule",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "execTransactionFromModuleReturnData",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "returnData",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "executeOperation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "executingModule",
    "outputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuthorizedOperator",
    "outputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGuard",
    "outputs": [
      {
        "internalType": "address",
        "name": "guard",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMinDelay",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "start",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pageSize",
        "type": "uint256"
      }
    ],
    "name": "getModulesPaginated",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "array",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "next",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNextOperationNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "getOperationDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "executableAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "opHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "getOperationExecutableAt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "executableAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "getOperationHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "opHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "getOperationModule",
    "outputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opNonce",
        "type": "uint256"
      }
    ],
    "name": "getOperationStatus",
    "outputs": [
      {
        "internalType": "enum ITimelockAvatar.OperationStatus",
        "name": "opStatus",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      }
    ],
    "name": "getSignatureExpiration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "expiration",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "hashOperation",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "opHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "isModuleEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "isValidSignature",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "magicValue",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "transactions",
        "type": "bytes"
      }
    ],
    "name": "multiSend",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sharesBurned",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "sharesTotalSupply",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20[]",
        "name": "assets",
        "type": "address[]"
      }
    ],
    "name": "processWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "quoteAsset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "depositAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mintAmount",
        "type": "uint256"
      }
    ],
    "name": "registerDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "delay",
        "type": "uint256"
      }
    ],
    "name": "scheduleTransactionFromModuleReturnData",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "returnData",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "authorizedInitializer",
        "type": "address"
      }
    ],
    "name": "setAuthorizedInitializer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newBalanceSharesManager",
        "type": "address"
      }
    ],
    "name": "setBalanceSharesManager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "guard",
        "type": "address"
      }
    ],
    "name": "setGuard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newMinDelay",
        "type": "uint256"
      }
    ],
    "name": "setMinDelay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newSharesOnboarder",
        "type": "address"
      }
    ],
    "name": "setSharesOnboarder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "minDelay",
                "type": "uint256"
              },
              {
                "internalType": "address[]",
                "name": "modules",
                "type": "address[]"
              }
            ],
            "internalType": "struct ITimelockAvatar.TimelockAvatarInit",
            "name": "timelockAvatarInit",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "sharesOnboarder",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "balanceSharesManager",
                "type": "address"
              },
              {
                "internalType": "bytes[]",
                "name": "balanceSharesManagerCalldatas",
                "type": "bytes[]"
              },
              {
                "internalType": "address",
                "name": "distributor",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "distributionClaimPeriod",
                "type": "uint256"
              }
            ],
            "internalType": "struct ITreasurer.TreasurerInit",
            "name": "treasurerInit",
            "type": "tuple"
          }
        ],
        "internalType": "struct PrimordiumExecutorV1.ExecutorV1Init",
        "name": "init",
        "type": "tuple"
      }
    ],
    "name": "setUp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sharesOnboarder",
    "outputs": [
      {
        "internalType": "contract ISharesOnboarder",
        "name": "_sharesOnboarder",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "signatureExpiration",
        "type": "uint256"
      }
    ],
    "name": "signMessageHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;

export default PrimordiumExecutorV1Abi;