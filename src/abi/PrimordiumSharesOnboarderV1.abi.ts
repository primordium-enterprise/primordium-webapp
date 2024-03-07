const PrimordiumSharesOnboarderV1Abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "BatchArrayLengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "BatchArrayMissingItems",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotSetQuoteAssetToSelf",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "FundingIsNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDepositAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDepositAmountMultiple",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "missingInterfaceId",
        type: "bytes4",
      },
    ],
    name: "InvalidERC165InterfaceSupport",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "InvalidMsgValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "providedSpender",
        type: "address",
      },
      {
        internalType: "address",
        name: "correctSpender",
        type: "address",
      },
    ],
    name: "InvalidPermitSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    name: "InvalidTreasuryAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "QuoteAssetInterfaceNotSupported",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenPriceTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenSaleBeginsAt",
        type: "uint256",
      },
    ],
    name: "TokenSalesNotAvailableYet",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    name: "TreasuryInterfaceNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminPausedFunding",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldExpiresAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newExpiresAt",
        type: "uint256",
      },
    ],
    name: "AdminStatusChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountDeposited",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votesMinted",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFundingBeginsAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newFundingBeginsAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFundingEndsAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newFundingEndsAt",
        type: "uint256",
      },
    ],
    name: "FundingPeriodChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldQuoteAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newQuoteAsset",
        type: "address",
      },
    ],
    name: "QuoteAssetChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldQuoteAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newQuoteAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldMintAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newMintAmount",
        type: "uint256",
      },
    ],
    name: "SharePriceChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldTreasury",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "TreasuryChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "adminStatus",
    outputs: [
      {
        internalType: "bool",
        name: "isAdmin",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "expiresAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "totalSharesMinted",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
    ],
    name: "depositFor",
    outputs: [
      {
        internalType: "uint256",
        name: "totalSharesMinted",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "depositWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "totalSharesMinted",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fundingPeriods",
    outputs: [
      {
        internalType: "uint256",
        name: "fundingBeginsAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fundingEndsAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isFundingActive",
    outputs: [
      {
        internalType: "bool",
        name: "fundingActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pauseFunding",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quoteAsset",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "_quoteAsset",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "expiresAts",
        type: "uint256[]",
      },
    ],
    name: "setAdminExpirations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newFundingBeginsAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newFundingEndsAt",
        type: "uint256",
      },
    ],
    name: "setFundingPeriods",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newQuoteAsset",
        type: "address",
      },
    ],
    name: "setQuoteAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newQuoteAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newMintAmount",
        type: "uint256",
      },
    ],
    name: "setSharePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "address",
                name: "treasury",
                type: "address",
              },
              {
                internalType: "address",
                name: "quoteAsset",
                type: "address",
              },
              {
                internalType: "uint128",
                name: "quoteAmount",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "mintAmount",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "fundingBeginsAt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundingEndsAt",
                type: "uint256",
              },
            ],
            internalType: "struct ISharesOnboarder.SharesOnboarderInit",
            name: "sharesOnboarderInit",
            type: "tuple",
          },
        ],
        internalType: "struct PrimordiumSharesOnboarderV1.SharesOnboarderV1Init",
        name: "init",
        type: "tuple",
      },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sharePrice",
    outputs: [
      {
        internalType: "uint128",
        name: "quoteAmount",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "mintAmount",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "contract ITreasury",
        name: "_treasury",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export default PrimordiumSharesOnboarderV1Abi;
