# Exlabs AI Chat

A real-time chat application with OpenAI integration, built with React, NestJS, and WebSockets.

![Exlabs AI Chat Preview](https://github.com/user-attachments/assets/76e952b8-7aa2-401f-878b-d6567e0e037f)

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v10.2.4 or higher
- **OpenAI API Key**: Required for AI integration

## Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd open-ai
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Create a `.env` file in `apps/backend`:
     ```plaintext
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Start development servers**:

   ```bash
   npm run start:dev
   ```

   - **Frontend**: Runs on [http://localhost:5173](http://localhost:5173)
   - **Backend**: Runs on [http://localhost:3000](http://localhost:3000)

## Features

- Real-time chat interface
- OpenAI integration for AI responses
- WebSocket communication
- Dark theme UI
- Message attribution with logos

## Tech Stack

- **Frontend**:

  - React
  - Vite
  - Socket.io-client
  - TypeScript

- **Backend**:
  - NestJS
  - Socket.io
  - OpenAI API
  - TypeScript

## Development

The project uses Turborepo for monorepo management. Key commands:

- `npm run start:dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run lint` - Run linting across all applications

## License

MIT
