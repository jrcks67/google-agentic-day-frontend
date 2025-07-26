# Agentic Chat Application - Frontend

A modern React-based frontend for an agentic chat application with backend authentication.

## Features

- 🔐 Backend-handled authentication (signup, login, logout)
- 💬 Real-time chat interface with conversation management
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 State management with React Query and Recoil
- 🛡️ Protected routes with authentication guards
- 🚀 Built with Vite for fast development

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Recoil** - Client state management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
src/
├── api/
│   ├── apiClientFactory.js     # API client factory with auth/public clients
│   ├── apiClients.js          # Pre-configured API clients
│   ├── interceptors/
│   │   └── authInterceptor.js # Auth token handling
│   └── services/
│       └── chatApi.js         # Chat API service
├── components/
│   └── ProtectedRoutes.jsx    # Route protection component
├── hooks/
│   ├── useAuth.js            # Authentication hooks
│   └── useChat.js            # Chat functionality hooks
├── pages/
│   ├── private/
│   │   └── chat/
│   │       └── Chat.jsx      # Main chat interface
│   └── public/
│       ├── SigninPage.jsx    # Login page
│       └── SignupPage.jsx    # Registration page
├── utils/
│   └── auth.js              # Auth utility functions
├── App.jsx                  # Main app component
└── main.jsx                # App entry point
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## API Integration

The frontend expects the following backend endpoints:

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend-confirmation` - Resend confirmation email
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify-token` - Verify auth token
- `POST /api/auth/refresh` - Refresh auth token
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/reset-password` - Password reset
- `PUT /api/auth/update-password` - Update password

### Chat Endpoints
- `POST /api/chat/` - Send message
- `GET /api/chat/history/:conversationId` - Get chat history
- `GET /api/chat/conversations` - Get all conversations
- `POST /api/chat/conversations` - Create new conversation
- `PUT /api/chat/conversations/:id` - Update conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation

## Authentication Flow

1. **Public Routes**: Signup, login, and password reset don't require authentication
2. **Protected Routes**: All other routes require valid JWT token
3. **Token Management**: Automatic token refresh and logout on expiration
4. **Interceptors**: Automatic token attachment to authenticated requests

## Key Components

### API Clients
- **Public Client**: For auth endpoints (no token required)
- **Authenticated Client**: For protected endpoints (auto token handling)
- **Chat Client**: Specialized client for chat endpoints

### Authentication
- Backend-handled authentication with JWT tokens
- Automatic token refresh and error handling
- Protected route guards

### Chat Interface
- Conversation management (create, edit, delete)
- Real-time message sending
- Chat history with pagination
- Responsive design

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript-style JSDoc comments for functions
3. Ensure responsive design for all components
4. Test authentication flows thoroughly
5. Handle loading and error states appropriately

## License

[Your License Here]
