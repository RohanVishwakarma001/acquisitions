# 🚀 Acquisitions API

A modern, secure Node.js authentication API built with Express.js, featuring JWT-based authentication, PostgreSQL database integration, and comprehensive user management capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#️-database-setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- 🛡️ **Password Security**: bcrypt hashing with salt rounds for secure password storage
- ✅ **Input Validation**: Zod schema validation for all API endpoints
- 🗄️ **Database Integration**: PostgreSQL with Drizzle ORM for type-safe database operations
- 📝 **Structured Logging**: Winston-based logging with multiple transport layers
- 🔧 **Development Tools**: ESLint, Prettier, and hot reload for enhanced developer experience
- 🐳 **Docker Support**: Ready-to-use Docker configuration for development and production
- 📊 **Health Monitoring**: Built-in health check endpoints
- 🌐 **CORS Support**: Configurable cross-origin resource sharing
- 🔒 **Security Headers**: Helmet.js integration for enhanced security

## 🛠️ Tech Stack

### Core
- **Runtime**: Node.js (ES6+ modules)
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM 0.44.5

### Security & Authentication
- **Password Hashing**: bcrypt 6.0.0
- **JWT**: jsonwebtoken 9.0.2
- **Security Headers**: Helmet 8.1.0
- **CORS**: cors 2.8.5

### Validation & Utilities
- **Schema Validation**: Zod 4.1.8
- **Logging**: Winston 3.17.0
- **HTTP Logging**: Morgan 1.10.1
- **Environment**: dotenv 17.2.2

### Development
- **Linting**: ESLint 9.35.0
- **Formatting**: Prettier 3.6.2
- **Database Tools**: Drizzle Kit 0.31.4

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RohanVishwakarma001/acquisitions.git
   cd acquisitions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/acquisitions

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Logging Configuration
LOG_LEVEL=info
```

## 🗄️ Database Setup

### Using Neon (Recommended)
1. Create a [Neon](https://neon.tech/) account
2. Create a new project and database
3. Copy the connection string to `DATABASE_URL` in your `.env` file

### Using Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `acquisitions`
3. Update `DATABASE_URL` with your local credentials

### Run Migrations
```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
npm run db:studio    # Open Drizzle Studio (optional)
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-13T10:26:15.000Z",
  "uptime": 3600.42
}
```

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User Registered",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### User Login
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "User logged in successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### User Logout
```http
POST /api/auth/sign-out
```

**Response (200):**
```json
{
  "message": "User logged out successfully"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": "Email must be a valid email, Password must be at least 6 characters"
}
```

#### Authentication Error (401)
```json
{
  "error": "Invalid email or password"
}
```

#### Conflict Error (409)
```json
{
  "error": "User already exists"
}
```

## 📁 Project Structure

```
src/
├── 🚀 Entry Points
│   ├── index.js          # Application bootstrap
│   ├── server.js         # HTTP server setup
│   └── app.js           # Express app configuration
├── 🎛️ Configuration
│   ├── config/
│   │   ├── database.js  # Database connection
│   │   └── logger.js    # Winston logging setup
├── 🌐 API Layer
│   ├── routes/          # API route definitions
│   ├── controller/      # Request/response handlers
│   └── validations/     # Zod validation schemas
├── 🏢 Business Logic
│   └── services/        # Core business operations
├── 💾 Data Layer
│   └── models/          # Database schema definitions
└── 🔧 Utilities
    └── utils/           # Helper functions
```

## 📜 Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm start           # Start production server

# Database
npm run db:generate # Generate migrations
npm run db:migrate  # Run migrations
npm run db:studio   # Open Drizzle Studio

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run format      # Format with Prettier
npm run format:check # Check formatting

# Docker
npm run dev:docker  # Start development container
npm run prod:docker # Start production container

# Testing
npm test           # Run tests
```

## 🏗️ Architecture

This project follows a **layered MVC architecture** with clear separation of concerns:

- **Presentation Layer**: Routes and controllers handle HTTP requests/responses
- **Business Layer**: Services contain core business logic
- **Data Layer**: Models and database operations
- **Utility Layer**: Shared helpers and configurations

### Key Design Patterns
- **Dependency Injection**: Clean module imports with path aliases
- **Error Handling**: Centralized error handling with proper logging
- **Validation**: Schema-based validation at the API boundary
- **Security**: JWT tokens with HTTP-only cookies

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: XSS protection for token storage
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js security middleware
- **CORS Configuration**: Controlled cross-origin access
- **Error Sanitization**: No sensitive data in error responses

## 🚀 Deployment

### Using Docker
```bash
# Development
npm run dev:docker

# Production
npm run prod:docker
```

### Manual Deployment
1. Set `NODE_ENV=production`
2. Configure production database URL
3. Run `npm install --production`
4. Start with `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style (ESLint + Prettier)
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## 📞 Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

---

**Happy coding! 🎉**
