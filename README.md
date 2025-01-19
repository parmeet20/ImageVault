# ImageVault DApp

## Project Overview
ImageVault is a blockchain-based decentralized application (DApp) designed to provide users with secure storage and sharing of images on the blockchain using IPFS (via Pinata). The key features include:

- **Image Storage**: Users can upload images along with a title and description to the blockchain.
- **Access Control**: Users can share and revoke access to their images with other users.
- **Downloadable Images**: Users and authorized individuals can download specific images from the gallery.
- **Privacy and Security**: Only users with granted access can view specific images, ensuring complete privacy.
- **Revoke Access**: Users can revoke access to their images anytime, providing full control.

---

## Features

1. **Image Management**:
   - Upload images with a title and description.
   - Images are stored on IPFS using Pinata, with references saved on the blockchain.

2. **Access Control**:
   - Users can share access to specific images with other users by granting their addresses permission.
   - Users can revoke access to any shared image at any time.

3. **Image Download**:
   - Authorized users can download images from the gallery.

4. **Secure Blockchain Storage**:
   - All metadata and access control information are securely stored on the blockchain, ensuring transparency and immutability.

---

## Installation

<p>Follow the steps below to install the dependencies:</p>

```bash
cd client
npm i
cd ..
cd web3
npm i
cd ..
```

---

## Running the Project

<p>Follow these commands to start the application:</p>

```bash
cd web3
npx hardhat node
npx hardhat run ignition/modules/deploy.ts --network localhost # Run this in another terminal window
cd client
npm run dev
cd ..
```

---

## Project Structure

- **`web3/`**: Contains the smart contracts written in Solidity.
- **`client/`**: Contains the frontend application built with React.

---

## Technologies Used

- **Frontend**: React.js with TypeScript
- **Backend**: Solidity (Smart Contracts)
- **Blockchain Framework**: Hardhat
- **Storage**: IPFS via Pinata

---

## Final Preview

<h2>Screenshots</h2>

<img width="947" alt="img1" src="https://github.com/user-attachments/assets/3dc9fe3c-de19-4dc4-a09f-767f326cfb50" />
<img width="947" alt="img2" src="https://github.com/user-attachments/assets/8cedf5bf-3078-4930-b285-4012ce987ce1" />

---

## Contribution

If you'd like to contribute to this project, feel free to open a pull request or raise an issue. We welcome all contributions!

---

## License

This project is licensed under the [MIT License](LICENSE).
