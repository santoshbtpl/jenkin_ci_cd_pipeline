# MongoDB to PostgreSQL Migration Guide

This project has been migrated from MongoDB to PostgreSQL. This guide explains the changes and how to work with the new database.

## Key Changes

### 1. Database Configuration

**Before (MongoDB):**
```javascript
MONGODB_URI=mongodb://localhost:27017/ohif-db
```

**After (PostgreSQL):**
```javascript
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ohif_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 2. ORM Change

- **Before:** Mongoose
- **After:** Sequelize

### 3. Model Definitions

**Before (Mongoose):**
```javascript
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});

module.exports = mongoose.model('User', UserSchema);
```

**After (Sequelize):**
```javascript
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { 
    type: DataTypes.STRING, 
    unique: true 
  }
});

module.exports = User;
```

### 4. Querying Differences

| Operation | Mongoose | Sequelize |
|-----------|----------|-----------|
| Find All | `User.find()` | `User.findAll()` |
| Find One | `User.findOne({ email })` | `User.findOne({ where: { email } })` |
| Find By ID | `User.findById(id)` | `User.findByPk(id)` |
| Create | `User.create(data)` | `User.create(data)` |
| Update | `user.save()` | `user.save()` |
| Delete | `User.deleteOne({ _id: id })` | `User.destroy({ where: { id } })` |

## Setup Instructions

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE ohif_db;

# Create user (optional)
CREATE USER ohif_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ohif_db TO ohif_user;

# Exit
\q
```

### 3. Update Environment Variables

Copy `.env.example` to `.env` and update:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ohif_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Migrations

The app will automatically create tables on first run in development mode.

Alternatively, seed the database:
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`

### 6. Start Server

```bash
npm run dev
```

## Common Operations

### Adding a New Model

1. Create file in `models/` directory:

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  }
});

module.exports = Post;
```

2. Add to `models/index.js`:

```javascript
const Post = require('./Post');

// Add relationships
User.hasMany(Post);
Post.belongsTo(User);
```

### Querying Examples

**Find all users:**
```javascript
const users = await User.findAll();
```

**Find with conditions:**
```javascript
const activeUsers = await User.findAll({
  where: { isActive: true }
});
```

**Find with pagination:**
```javascript
const users = await User.findAll({
  limit: 10,
  offset: 0,
  order: [['createdAt', 'DESC']]
});
```

**Find with relationships:**
```javascript
const user = await User.findByPk(id, {
  include: [Post]
});
```

**Update:**
```javascript
await User.update(
  { name: 'New Name' },
  { where: { id: userId } }
);
```

**Delete:**
```javascript
await User.destroy({
  where: { id: userId }
});
```

### Transactions

```javascript
const t = await sequelize.transaction();

try {
  await User.create({ ... }, { transaction: t });
  await Post.create({ ... }, { transaction: t });
  
  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Test connection:
```bash
psql -h localhost -U postgres -d ohif_db
```

3. Check credentials in `.env` file

### Migration Issues

If tables aren't created:
```javascript
// Force sync (WARNING: drops existing tables)
await sequelize.sync({ force: true });

// Alter existing tables
await sequelize.sync({ alter: true });
```

### Port Already in Use

```bash
# Find process using port 5432
lsof -i :5432

# Kill process
kill -9 <PID>
```

## Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize CLI](https://github.com/sequelize/cli) - for advanced migrations

## Support

For issues or questions, please refer to the main README.md or check the official documentation.

