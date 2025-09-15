# Acquisitions App - Dockerized with Neon Database

A Node.js application using Express, Drizzle ORM, and Neon Database with comprehensive Docker support for both development and production environments.

## 🏗️ Architecture Overview

- **Development Environment**: Uses Neon Local via Docker for ephemeral database branches
- **Production Environment**: Connects directly to Neon Cloud Database
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Runtime**: Node.js with Express framework
- **Containerization**: Multi-stage Docker builds with environment-specific configurations

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Neon Account](https://console.neon.tech/) with API access
- Git

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd devops
   ```

2. **Set up development environment**
   ```bash
   # Copy and configure development environment
   cp .env.example .env.development
   ```

3. **Configure Neon credentials in `.env.development`**
   ```bash
   # Get these from https://console.neon.tech/
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   PARENT_BRANCH_ID=your_parent_branch_id_here  # Optional
   ```

4. **Start development environment**
   ```bash
   # Method 1: Using helper script (recommended)
   ./scripts/dev.sh
   
   # Method 2: Using Docker Compose directly
   docker-compose -f docker-compose.dev.yml --env-file .env.development up --build
   ```

5. **Access the application**
   - Application: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - API: http://localhost:3000/api

### Production Deployment

1. **Set up production environment**
   ```bash
   cp .env.example .env.production
   ```

2. **Configure production settings in `.env.production`**
   ```bash
   # Get your database URL from https://console.neon.tech/
   DATABASE_URL=postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/dbname?sslmode=require
   JWT_SECRET=your_super_secure_production_jwt_secret_here
   NODE_ENV=production
   ```

3. **Deploy to production**
   ```bash
   # Method 1: Using helper script (recommended)
   ./scripts/prod.sh
   
   # Method 2: Using Docker Compose directly
   docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
   ```

## 🛠️ Environment Configuration

### Development Environment (`.env.development`)

```bash
# Development Environment Configuration
NODE_ENV=development
PORT=3000

# Neon Local Database Configuration
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb?sslmode=require

# Neon API Configuration (Required for Neon Local)
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here  # Optional

# Application Configuration
JWT_SECRET=dev-super-secret-jwt-key
LOG_LEVEL=debug
COOKIE_MAX_AGE=900000
BCRYPT_SALT_ROUNDS=10
```

### Production Environment (`.env.production`)

```bash
# Production Environment Configuration
NODE_ENV=production
PORT=3000

# Neon Cloud Database Configuration
DATABASE_URL=postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/dbname?sslmode=require

# Application Configuration
JWT_SECRET=your_super_secure_production_jwt_secret_here
LOG_LEVEL=info
COOKIE_MAX_AGE=3600000
BCRYPT_SALT_ROUNDS=12
```

## 🐳 Docker Configuration

### Dockerfile Structure

- **Multi-stage build** with development and production stages
- **Security hardened** with non-root user and minimal attack surface
- **Optimized layers** for efficient caching and smaller images
- **Health checks** for container monitoring

### Docker Compose Files

#### Development (`docker-compose.dev.yml`)

- **Neon Local container**: Creates ephemeral database branches
- **Hot reloading**: Source code mounted for live development
- **Debug logging**: Enhanced logging for development
- **Health checks**: Ensures services are ready before startup

#### Production (`docker-compose.prod.yml`)

- **Production optimized**: Security hardened and resource limited
- **Neon Cloud**: Direct connection to production database
- **Optional Nginx**: Reverse proxy support (use `--profile with-nginx`)
- **Monitoring ready**: Health checks and proper logging

## 📚 Database Management

### Development with Neon Local

**Ephemeral Branches**: Each time you start the development environment, Neon Local creates a fresh database branch from your specified parent branch. When you stop the containers, the branch is automatically deleted.

**Benefits**:
- ✅ Fresh database state for each development session
- ✅ No manual cleanup required
- ✅ Isolated development environment
- ✅ Same data structure as production

### Running Migrations

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Or run migrations during deployment (included in prod.sh script)
```

### Database Studio

```bash
# Access Drizzle Studio for database management
npm run db:studio
```

## 🔧 Common Commands

### Development

```bash
# Start development environment
./scripts/dev.sh

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build

# Execute commands in running container
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
```

### Production

```bash
# Deploy to production
./scripts/prod.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# Scale application (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Maintenance

```bash
# Clean up unused Docker resources
docker system prune -f

# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.prod.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.*` files with real credentials
- ✅ Use strong, unique JWT secrets in production
- ✅ Rotate API keys and secrets regularly
- ✅ Use different credentials for development and production

### Docker Security
- ✅ Containers run as non-root user
- ✅ Production containers are read-only with specific tmpfs mounts
- ✅ Security options enabled (`no-new-privileges`)
- ✅ Resource limits configured for production

### Neon Database Security
- ✅ Always use SSL connections (`sslmode=require`)
- ✅ Configure IP allowlist in Neon console for production
- ✅ Use connection pooling in production
- ✅ Monitor database access logs

## 📊 Monitoring and Logging

### Health Checks
- Application health: `http://localhost:3000/health`
- Docker health checks configured for all services
- Automatic restart policies in production

### Logging
- Structured logging with Winston
- Log rotation configured
- Different log levels for development and production
- Logs accessible via Docker commands

### Monitoring Production

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Monitor resource usage
docker stats

# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check health endpoints
curl http://localhost:3000/health
```

## 🚨 Troubleshooting

### Common Issues

**1. Neon Local not starting**
```bash
# Check Neon credentials
source .env.development
echo "API Key: ${NEON_API_KEY}"
echo "Project ID: ${NEON_PROJECT_ID}"

# Check Docker logs
docker-compose -f docker-compose.dev.yml logs neon-local
```

**2. Application can't connect to database**
```bash
# Verify network connectivity
docker-compose -f docker-compose.dev.yml exec app nc -zv neon-local 5432

# Check environment variables in container
docker-compose -f docker-compose.dev.yml exec app printenv | grep DATABASE
```

**3. Port conflicts**
```bash
# Check what's using port 3000 or 5432
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# Stop conflicting services
docker-compose down
```

**4. Permission issues (Windows)**
```bash
# Make scripts executable
icacls "scripts\dev.sh" /grant Everyone:F
icacls "scripts\prod.sh" /grant Everyone:F
```

### Getting Help

1. Check container logs: `docker-compose -f docker-compose.dev.yml logs`
2. Verify environment variables are set correctly
3. Ensure Docker and Docker Compose are up to date
4. Check Neon console for API key and project ID
5. Verify network connectivity and port availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in development environment
5. Submit a pull request

## 📝 License

ISC License - see LICENSE file for details

## 🔗 Links

- [Neon Documentation](https://neon.com/docs)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)

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


## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## 📞 Support

For support, email [rohanvishwakarma8261@gmail.com] or create an issue in the GitHub repository.

---

**Happy coding! 🎉**
