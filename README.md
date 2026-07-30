# Real-Time B2B SaaS Collaboration Workspace

A modern, high-performance workspace collaboration platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time communication. This application allows teams to create workspaces, organize into channels, and collaborate with real-time chat, typing indicators, and online presence tracking.

## Features

- **Authentication**: Secure JWT-based authentication and user registration.
- **Workspaces**: Create isolated workspaces and generate invite codes to invite team members.
- **Channels**: Create public or private channels within workspaces for organized discussions.
- **Real-Time Chat**: Instant messaging powered by Socket.IO with typing indicators and online presence tracking.
- **Modern UI**: A premium, dark-mode responsive interface built with Tailwind CSS v4 and React.
- **Robust State Management**: Comprehensive context providers for Auth, Socket, and Toast notifications.

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, TypeScript, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT Authentication, bcrypt password hashing, Role-Based Access Control (RBAC)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB URI connection string

### Installation

1. **Clone the repository** (or download the source code).
2. **Install dependencies** for the entire workspace:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   In the `server` directory, ensure your `.env` file is set up correctly:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collaboration_workspace
   JWT_SECRET=super_secret_temporary_key_for_development_2026
   NODE_ENV=development
   ```

### Running the Application

You will need to start both the frontend and backend servers.

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture Highlights

- **Socket Middleware**: Custom Socket.IO middleware verifies JWT tokens on connection to ensure secure, authenticated real-time channels.
- **Paginated History**: Chat history is fetched efficiently via REST API on channel selection, while subsequent messages are seamlessly streamed via WebSockets.
- **Optimized UI Rendering**: Real-time presence indicators and message bubbles utilize CSS-based animations (`@keyframes`) for maximum performance without blocking the main JavaScript thread.
