-include .env

build:
	forge build

deploy-base-sepolia:
	forge script script/DeployTicTacToe.s.sol --rpc-url $(BASE_SEPOLIA_RPC_URL) --account testAccount --broadcast

deploy-and-verify-base-sepolia:
	forge script script/DeployTicTacToe.s.sol --rpc-url $(BASE_SEPOLIA_RPC_URL) --account testAccount --broadcast --verify --etherscan-api-key $(BASESCAN_API_KEY)

deploy-and-verify-base-mainnet:
	forge script script/DeployTicTacToe.s.sol --rpc-url $(BASE_MAINNET_RPC_URL) --account privateKey --broadcast --verify --etherscan-api-key $(BASESCAN_API_KEY)