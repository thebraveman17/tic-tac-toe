# Blockchain-Based 2-Player Tic-Tac-Toe Game
## Backend
- **Framework**: Developed using Foundry with 100% unit test coverage to ensure robustness.
- **Game Mechanics**: Players can create a new game with another address and make moves on their turn. Each move is recorded onchain.
- **Game Sharing**: Once a game is created, players can share a link or the game ID for the other player to join.
- **Error Handling**: If a player navigates to an incorrect game, they receive a warning and cannot access the game's progress.
- **Technology**: Implements Coinbase Smart Wallet for wallet integration and passkey sign-in for improved user authentication.
- **Deployment**: Currently live on the [Base L2 Mainnet](https://basescan.org/address/0x5084951aca1844ff69bc4110db32c95f9cdad05b).
## Frontend
- **Tech Stack**: Built using React, wagmi, and viem, leveraging the OnchainKit app template for seamless integration.
- **Deployment**: Available on [Vercel](https://tic-tac-toe-gamma-ruby.vercel.app/).
## Future Upgrades
- Implement session keys to create a more immersive user experience.
