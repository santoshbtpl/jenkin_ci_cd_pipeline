# OHIF Backend API

A RESTful API backend built with Express.js for the OHIF application.

## Features

- 🚀 Express.js server with modern ES6+ syntax
- 🔒 Security headers with Helmet
- 🌐 CORS enabled
- 📝 Request logging with Morgan
- ✅ Input validation with express-validator
- 🗃️ PostgreSQL integration with Sequelize ORM
- 🔐 JWT authentication (ready to implement)
- 📁 Well-organized folder structure
- 🛠️ Error handling middleware

## Folder Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # Database connection
│   └── index.js         # Central config exports
├── controllers/         # Route controllers
│   ├── authController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication & authorization
│   ├── errorHandler.js  # Error handling
│   └── validators.js    # Input validation
├── models/              # Database models
│   └── User.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── index.js
├── utils/               # Utility functions
│   ├── asyncHandler.js  # Async error handling
│   ├── logger.js        # Logging utility
│   └── response.js      # Standard API responses
├── .env.example         # Environment variables example
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── README.md           # Documentation
└── server.js           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL configuration:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ohif_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key_here
```

4. Create PostgreSQL database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ohif_db;

# Exit PostgreSQL
\q
```

5. (Optional) Seed database with sample data:
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /ris/api/auth/register` - Register new user
- `POST /ris/api/auth/login` - Login user
- `POST /ris/api/auth/logout` - Logout user
- `GET /ris/api/auth/me` - Get current user

### Users
- `GET /ris/api/users` - Get all users (protected)
- `GET /ris/api/users/:id` - Get user by ID (protected)
- `POST /ris/api/users` - Create new user (protected)
- `PUT /ris/api/users/:id` - Update user (protected)
- `DELETE /ris/api/users/:id` - Delete user (protected)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | ohif_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 30d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## Development

### Project Structure

- **config/**: Application configuration files
- **controllers/**: Business logic for routes
- **middleware/**: Custom Express middleware
- **models/**: Database models and schemas
- **routes/**: API route definitions
- **utils/**: Helper functions and utilities
- **server.js**: Main application entry point

### Adding New Routes

1. Create controller in `controllers/`
2. Define routes in `routes/`
3. Import and use in `routes/index.js`
4. Add validation middleware if needed

### Error Handling

All async route handlers are wrapped with `asyncHandler` utility to automatically catch errors. Custom errors are handled by the `errorHandler` middleware.

## Testing

```bash
npm test
```

## License

ISC

