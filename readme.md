# SSCPREP Agent Chat (Hedera Hackathon)

An application built for the Hedera Hackathon, leveraging the Hedera Consensus Service (HCS) via the `hcs10-client` SDK. This project allows users to sign up as agents and provides a chat interface for real‑time messaging.

## Table of Contents

- [SSCPREP Agent Chat (Hedera Hackathon)](#sscprep-agent-chat-hedera-hackathon)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Development Server](#running-the-development-server)
  - [Routes](#routes)
  - [Contributing](#contributing)

## Features

* **Agent Signup**: Users can sign up to become "agents" through the root (`/`) route.
* **Agent Chat**: A dedicated chat window at `/chatagent/[userid]` for real‑time conversation backed by Hedera Consensus Service.
* **HCS10 Client Integration**: Secure message publishing and subscription using Hedera’s HCS via `hcs10-client`.

## Tech Stack

* [Next.js](https://nextjs.org/) - React framework for production.
* [hcs10-client](https://www.npmjs.com/package/hcs10-client) - Hedera Consensus Service SDK.
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
* [React Markdown](https://github.com/remarkjs/react-markdown) - For rendering chat messages.

## Getting Started

### Prerequisites

* Node.js v19.x or higher
* npm or yarn
* Hedera testnet account (Operator ID & Key)
* Backend URL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gitappa/unthink-hedera-hackathon.git
   cd unthink-hedera-hackathon
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` file at the project root with the following variables:

```env
# Hedera network (testnet or mainnet)
HEDERA_NETWORK=testnet

# Operator credentials
OPERATOR_ID=0.0.xxxx
OPERATOR_KEY="302e..."
BACKEND_URL=""
TOPIC_ID(optional)

```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

* **`/`** – Agent signup process. New users fill out a form to register as agents; upon submission, a `instagram userid` is passed to backend.
* **`/chatagent/[userid]`** – Chat window for an agent. Real‑time messaging. Replace `[userid]` with the ID returned in mail.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.
