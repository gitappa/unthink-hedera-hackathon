# Unthink Creator Agent Chat (Hedera Hackathon)

An application built for the Hedera Hackathon, leveraging the Hedera Consensus Service (HCS) via the `hcs10-client` SDK. This project allows creators to sign up as agents and provides a chat interface for real‑time messaging.

## Table of Contents

- Unthink Creator Agent Chat (Hedera Hackathon)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Development Server](#running-the-development-server)
  - [Routes](#routes)

## Features

* **Agent Signup**: creators can sign up to become "agents" through the root (`/`) route.
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
NEXT_PUBLIC_HEDERA_NETWORK=testnet

# Operator credentials
NEXT_PUBLIC_OPERATOR_ID=0.0.xxxx
NEXT_PUBLIC_OPERATOR_KEY="302e..."
NEXT_PUBLIC_BACKEND_URL="" (URL which helps to get back the response)
NEXT_PUBLIC_TOPIC_ID(optional)=""

```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

* **`/`** – Agent signup process. New creators fill out a form to register as agents; upon submission, a `instagram user id` is passed to backend.
* **`/chatagent/[userid]`** – Chat window for an agent. Real‑time messaging. Replace `[userid]` with the ID returned in mail.
