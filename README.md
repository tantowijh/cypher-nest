# Cyper Nest

Cyper Nest is a modern and secure text encryption and decryption application that combines classical and contemporary encryption methods. Built with **Next.js**, **Tailwind CSS**, and **FastAPI**, it offers a seamless and intuitive interface for encrypting and decrypting text.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Example Requests](#example-requests)
- [Localization](#localization)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Encryption Methods**:
  - **Vigenère Cipher**: Classical encryption using a keyword.
  - **XOR Cipher**: Simple encryption using a passphrase.
  - **AES Encryption**: Advanced encryption requiring a 16-character key.
  - **RSA Encryption**: Public-key encryption using key pairs.
- **Decryption**: Supports decryption for all the above methods.
- **Multilingual Support**: Available in multiple languages (e.g., English, Indonesian).
- **Clipboard Integration**: Easily copy encrypted or decrypted text.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: Next.js 15, Tailwind CSS
- **Backend**: FastAPI
- **Encryption Libraries**: Cryptography, RSA

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tantowijh/cypher-nest.git
   cd cypher-nest
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
      
    Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
      Activate the virtual environment:
      - On MacOS/Linux:

        ```bash
        source venv/bin/activate
        ```
      - On Windows:

        ```bash
        venv\Scripts\activate
        ```
    Then install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the application:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## API Endpoints

- **POST** `/api/encrypt`: Encrypt text using the specified method.
- **POST** `/api/decrypt`: Decrypt text using the specified method.

### Example Requests

#### Encryption
```json
POST /api/encrypt
{
  "plaintext": "Hello, World!",
  "keyword": "KEY",
  "method": "vigenere"
}
```

#### Decryption
```json
POST /api/decrypt
{
  "ciphertext": "Rijvs, Uyvjn!",
  "keyword": "KEY",
  "method": "vigenere"
}
```

## Localization

The application supports multiple languages. To add or modify translations, edit the JSON files in:
```
/src/utils/i18n/locales/
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

- Built with ❤️ by the Cyper Nest team.
- Powered by Next.js, Tailwind CSS, and FastAPI.
