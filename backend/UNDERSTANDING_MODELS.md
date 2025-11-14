# Understanding Sequelize Models - Complete Guide

## 📚 Table of Contents

1. [What is a Model?](#what-is-a-model)
2. [Model Structure](#model-structure)
3. [Data Types](#data-types)
4. [Field Options](#field-options)
5. [Validations](#validations)
6. [Hooks (Lifecycle Events)](#hooks)
7. [Associations (Relationships)](#associations)
8. [Querying Models](#querying-models)
9. [Instance vs Class Methods](#instance-vs-class-methods)
10. [Best Practices](#best-practices)

---

## 1. What is a Model?

A **Model** represents a table in your database. It defines:
- What columns the table has
- What type of data each column stores
- Rules for the data (validations)
- Relationships with other tables
- Business logic methods

### Think of it like a blueprint:

```
Model (Blueprint) → Database Table (Built House)
User Model        → users table
Facility Model    → facilities table
```

### Your Models Structure:

```
models/
├── User.js          ← Represents 'users' table
├── Facility.js      ← Represents 'facilities' table
└── index.js         ← Manages all models & relationships
```

---

## 2. Model Structure

Let's break down your User model line by line:

```5:107:backend/models/User.js
const User = sequelize.define('user', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Full name is required" } }
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
    validate: { notEmpty: { msg: "Gender is required" } }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'username already exists' },
    validate: { notEmpty: { msg: 'Invalid username format' } }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Email already exists' },
    validate: { isEmail: { msg: 'Invalid email format' } }
  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Mobile number already exists' },
    validate: {
      isNumeric: { msg: 'Mobile number must be numeric' },
      len: { args: [10, 10], msg: 'Mobile number must be 10 digits' },
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Technician', 'FrontDesk', 'Radiologist'),
    allowNull: false,
    validate: { notEmpty: { msg: 'Role is required' } }
  },
  facility_id: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Facility/Branch is required' } }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Inactive'
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Technician Fields
  employee_id: { type: DataTypes.STRING, allowNull: true },
  department: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  qualification: { type: DataTypes.STRING, allowNull: true },
  experience_years: { type: DataTypes.INTEGER, allowNull: true },
  reporting_supervisor: { type: DataTypes.STRING, allowNull: true },

  // FrontDesk Fields
  assigned_counter: { type: DataTypes.STRING, allowNull: true },
  shift_timing: { type: DataTypes.STRING, allowNull: true },

  // Radiologist Fields
  doctor_id: { type: DataTypes.STRING, allowNull: true },
  registration_number: { type: DataTypes.STRING, allowNull: true },
  specialty: { type: DataTypes.STRING, allowNull: true },
  signature: { type: DataTypes.STRING, allowNull: true },
  peer_reviewer: { type: DataTypes.BOOLEAN, defaultValue: false },
  reporting_modality_access: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  deleted_at: { type: DataTypes.DATE, allowNull: true },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      // Only hash if password was changed
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;
```

### Anatomy of Model Definition:

```javascript
const ModelName = sequelize.define('table_name', {
  // ↑ Model name        ↑ Actual database table name
  
  // FIELDS (Columns)
  field_name: {
    type: DataTypes.TYPE,     // What kind of data
    allowNull: false,         // Required or optional
    unique: true,             // Must be unique
    defaultValue: 'value',    // Default if not provided
    validate: { ... }         // Validation rules
  }
  
}, {
  // OPTIONS
  timestamps: true,           // Auto-add createdAt/updatedAt
  hooks: { ... },            // Lifecycle events
  indexes: [ ... ]           // Performance indexes
});
```

---

## 3. Data Types

Sequelize provides many data types. Here are the ones you're using:

### String Types

```javascript
// Regular string (up to 255 characters)
full_name: {
  type: DataTypes.STRING    // VARCHAR(255)
}

// Text (unlimited length)
facility_description: {
  type: DataTypes.TEXT      // TEXT
}
```

### Number Types

```javascript
// Integer (whole numbers)
experience_years: {
  type: DataTypes.INTEGER   // INTEGER
}

// Port number
pacs_port: {
  type: DataTypes.INTEGER   // INTEGER
}
```

### Boolean

```javascript
is_deleted: {
  type: DataTypes.BOOLEAN   // BOOLEAN (true/false)
}

peer_reviewer: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
}
```

### Date Types

```javascript
// Date only (no time)
date_of_birth: {
  type: DataTypes.DATEONLY  // DATE (YYYY-MM-DD)
}

// Date and time
deleted_at: {
  type: DataTypes.DATE      // TIMESTAMP (with time)
}
```

### ENUM (Fixed Options)

```javascript
gender: {
  type: DataTypes.ENUM('Male', 'Female', 'Other')
  // Can ONLY be one of these three values
}

role: {
  type: DataTypes.ENUM('Technician', 'FrontDesk', 'Radiologist')
  // Can ONLY be one of these three
}

status: {
  type: DataTypes.ENUM('Active', 'Inactive')
  // Can ONLY be Active or Inactive
}
```

### Array Types

```javascript
// Array of strings
department: {
  type: DataTypes.ARRAY(DataTypes.STRING)
  // Example: ['CT', 'MRI', 'X-Ray']
}

reporting_modality_access: {
  type: DataTypes.ARRAY(DataTypes.STRING)
  // Example: ['CT', 'MRI']
}
```

### Complete Data Type Reference

| DataType | Database Type | JavaScript Type | Example |
|----------|---------------|-----------------|---------|
| `STRING` | VARCHAR(255) | string | 'John Doe' |
| `STRING(100)` | VARCHAR(100) | string | 'Short text' |
| `TEXT` | TEXT | string | 'Very long text...' |
| `INTEGER` | INTEGER | number | 25 |
| `FLOAT` | FLOAT | number | 25.5 |
| `BOOLEAN` | BOOLEAN | boolean | true/false |
| `DATE` | TIMESTAMP | Date | 2025-01-15 10:30:00 |
| `DATEONLY` | DATE | string | 2025-01-15 |
| `ENUM()` | ENUM | string | 'Active' |
| `ARRAY()` | ARRAY | array | ['a', 'b'] |
| `JSON` | JSON | object | {key: 'value'} |
| `JSONB` | JSONB | object | {key: 'value'} (faster) |
| `UUID` | UUID | string | 'a0eebc99-9c0b...' |

---

## 4. Field Options

Every field can have several options:

### type (Required)
```javascript
full_name: {
  type: DataTypes.STRING  // ← REQUIRED: What kind of data
}
```

### allowNull
```javascript
full_name: {
  type: DataTypes.STRING,
  allowNull: false  // ← false = REQUIRED, true = OPTIONAL
}

profile_picture: {
  type: DataTypes.STRING,
  allowNull: true   // ← OPTIONAL (can be NULL)
}
```

### unique
```javascript
email: {
  type: DataTypes.STRING,
  unique: true  // ← No two users can have same email
  // Or with custom error message:
  unique: { msg: 'Email already exists' }
}
```

### defaultValue
```javascript
status: {
  type: DataTypes.ENUM('Active', 'Inactive'),
  defaultValue: 'Inactive'  // ← Auto-set to 'Inactive' if not provided
}

is_deleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false  // ← Auto-set to false
}
```

### validate
```javascript
email: {
  type: DataTypes.STRING,
  validate: {
    isEmail: { msg: 'Invalid email format' }  // ← Must be valid email
  }
}

mobile_number: {
  type: DataTypes.STRING,
  validate: {
    isNumeric: { msg: 'Must be numeric' },
    len: { args: [10, 10], msg: 'Must be 10 digits' }
  }
}
```

---

## 5. Validations

Validations check if data is correct BEFORE saving to database.

### Built-in Validators

```javascript
// Email validation
email: {
  validate: {
    isEmail: true  // ✅ Must be valid email
  }
}

// Numeric validation
mobile_number: {
  validate: {
    isNumeric: true  // ✅ Must be numbers only
  }
}

// Length validation
mobile_number: {
  validate: {
    len: {
      args: [10, 10],  // Min: 10, Max: 10
      msg: 'Must be exactly 10 digits'
    }
  }
}

// Not empty validation
full_name: {
  validate: {
    notEmpty: { msg: 'Name is required' }
  }
}

// URL validation
ris_url: {
  validate: {
    isUrl: { msg: 'Must be valid URL' }
  }
}

// IP address validation
pacs_ip_address: {
  validate: {
    isIP: { msg: 'Must be valid IP address' }
  }
}
```

### Custom Validators

```javascript
age: {
  type: DataTypes.INTEGER,
  validate: {
    // Custom validation function
    isOldEnough(value) {
      if (value < 18) {
        throw new Error('Must be 18 or older');
      }
    }
  }
}

password: {
  type: DataTypes.STRING,
  validate: {
    // Complex password validation
    isStrongPassword(value) {
      if (value.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(value)) {
        throw new Error('Password must contain uppercase letter');
      }
      if (!/[0-9]/.test(value)) {
        throw new Error('Password must contain number');
      }
    }
  }
}
```

### Validation Flow

```
User submits data
       ↓
Sequelize checks validations
       ↓
   All pass? ─── YES ───→ Save to database ✅
       │
       NO
       ↓
Throw validation error ❌
```

---

## 6. Hooks (Lifecycle Events)

Hooks let you run code at specific points in a model's lifecycle.

### Your Current Hooks (Password Hashing)

```90:104:backend/models/User.js
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      // Only hash if password was changed
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});
```

### Hook Lifecycle

```
CREATE:
beforeCreate → validate → afterCreate → save to DB

UPDATE:
beforeUpdate → validate → afterUpdate → save to DB

DELETE:
beforeDestroy → delete from DB → afterDestroy

FIND:
beforeFind → query DB → afterFind
```

### Common Hooks

```javascript
{
  hooks: {
    // Before creating new record
    beforeCreate: async (record) => {
      console.log('About to create:', record);
      // Modify data before saving
      record.created_at = new Date();
    },
    
    // After creating new record
    afterCreate: async (record) => {
      console.log('Created:', record);
      // Send welcome email, create log, etc.
    },
    
    // Before updating
    beforeUpdate: async (record) => {
      record.updated_at = new Date();
    },
    
    // Before deleting
    beforeDestroy: async (record) => {
      // Create audit log
      await AuditLog.create({
        action: 'delete',
        record_id: record.id
      });
    },
    
    // Before finding
    beforeFind: (options) => {
      // Auto-exclude soft-deleted records
      options.where = options.where || {};
      options.where.is_deleted = false;
    }
  }
}
```

### Real Example: Auto-Generate Codes

```javascript
{
  hooks: {
    beforeCreate: async (facility) => {
      if (!facility.facility_code) {
        // Auto-generate: FAC0001, FAC0002, etc.
        const count = await Facility.count();
        facility.facility_code = `FAC${String(count + 1).padStart(4, '0')}`;
      }
    }
  }
}
```

---

## 7. Associations (Relationships)

Associations define how models relate to each other.

### Your Current Associations

```59:72:backend/models/Facility.js
    Facility.associate = models => {
        // Facility belongs to the user who created it
        Facility.belongsTo(models.User, {
          as: "CreatedBy",
          foreignKey: "created_by"
        });
    
        // Facility belongs to the user who last modified it
        Facility.belongsTo(models.User, {
          as: "ModifiedBy",
          foreignKey: "modified_by"
        });
      };
    
module.exports = Facility;
```

### Types of Associations

#### 1. One-to-One (hasOne / belongsTo)

```javascript
// User has one Profile
User.hasOne(Profile, {
  foreignKey: 'user_id'
});

// Profile belongs to User
Profile.belongsTo(User, {
  foreignKey: 'user_id'
});
```

**Database:**
```
users table:          profiles table:
┌────┬──────┐        ┌────┬─────────┬────────┐
│ id │ name │        │ id │ user_id │ bio    │
├────┼──────┤        ├────┼─────────┼────────┤
│ 1  │ John │        │ 1  │ 1       │ Hello  │
└────┴──────┘        └────┴─────────┴────────┘
                             ↑
                   Foreign key to users.id
```

#### 2. One-to-Many (hasMany / belongsTo)

```javascript
// User creates many Facilities
User.hasMany(Facility, {
  foreignKey: 'created_by',
  as: 'CreatedFacilities'
});

// Facility belongs to one User (creator)
Facility.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'CreatedBy'
});
```

**Database:**
```
users table:              facilities table:
┌────┬──────┐            ┌────┬────────────┬────────────┐
│ id │ name │            │ id │ name       │ created_by │
├────┼──────┤            ├────┼────────────┼────────────┤
│ 1  │ John │ ←──────────│ 1  │ Hospital A │ 1          │
└────┴──────┘      ↑     ├────┼────────────┼────────────┤
                   │     │ 2  │ Hospital B │ 1          │
                   │     └────┴────────────┴────────────┘
                   └─ One user created many facilities
```

#### 3. Many-to-Many (belongsToMany)

```javascript
// User can work at many Facilities
User.belongsToMany(Facility, {
  through: 'UserFacilities',  // Junction table
  foreignKey: 'user_id'
});

// Facility has many Users (staff)
Facility.belongsToMany(User, {
  through: 'UserFacilities',
  foreignKey: 'facility_id'
});
```

**Database:**
```
users table:          user_facilities (junction):     facilities table:
┌────┬──────┐        ┌─────────┬─────────────┐       ┌────┬────────┐
│ id │ name │        │ user_id │ facility_id │       │ id │ name   │
├────┼──────┤        ├─────────┼─────────────┤       ├────┼────────┤
│ 1  │ John │ ←──────│ 1       │ 1           │───→   │ 1  │ Hosp A │
├────┼──────┤        ├─────────┼─────────────┤       ├────┼────────┤
│ 2  │ Jane │ ←──────│ 2       │ 1           │───┐   │ 2  │ Hosp B │
└────┴──────┘        ├─────────┼─────────────┤   └───→└────┴────────┘
                     │ 1       │ 2           │───→
                     └─────────┴─────────────┘
```

### Using Associations in Queries

```javascript
// Get facility with creator info
const facility = await Facility.findOne({
  where: { id: 1 },
  include: [{
    model: User,
    as: 'CreatedBy',
    attributes: ['id', 'full_name', 'email']
  }]
});

console.log(facility.facility_name);       // 'City Hospital'
console.log(facility.CreatedBy.full_name); // 'John Doe'

// Get user with all facilities they created
const user = await User.findOne({
  where: { id: 1 },
  include: [{
    model: Facility,
    as: 'CreatedFacilities'
  }]
});

console.log(user.CreatedFacilities.length); // Number of facilities
```

---

## 8. Querying Models

### Basic Queries

```javascript
// Find all users
const users = await User.findAll();

// Find one user
const user = await User.findOne({
  where: { email: 'john@example.com' }
});

// Find by primary key (id)
const user = await User.findByPk(123);

// Create new user
const user = await User.create({
  full_name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
  // ... more fields
});

// Update user
await user.update({
  full_name: 'John Smith'
});

// Or update directly
await User.update(
  { status: 'Active' },        // What to update
  { where: { id: 123 } }       // Which records
);

// Delete user
await user.destroy();

// Or delete directly
await User.destroy({
  where: { id: 123 }
});
```

### Advanced Queries

```javascript
const { Op } = require('sequelize');

// WHERE conditions
const users = await User.findAll({
  where: {
    status: 'Active',              // status = 'Active'
    role: 'Radiologist',           // AND role = 'Radiologist'
    is_deleted: false              // AND is_deleted = false
  }
});

// OR conditions
const users = await User.findAll({
  where: {
    [Op.or]: [
      { role: 'Radiologist' },
      { role: 'Technician' }
    ]
  }
});

// LIKE (search)
const users = await User.findAll({
  where: {
    full_name: {
      [Op.iLike]: '%john%'  // Case-insensitive search
    }
  }
});

// IN (multiple values)
const users = await User.findAll({
  where: {
    role: {
      [Op.in]: ['Radiologist', 'Technician']
    }
  }
});

// Comparison operators
const users = await User.findAll({
  where: {
    experience_years: {
      [Op.gte]: 5  // Greater than or equal to 5
    }
  }
});

// Pagination
const users = await User.findAll({
  limit: 10,      // How many records
  offset: 20,     // Skip first 20 (for page 3)
  order: [['created_at', 'DESC']]  // Sort by newest first
});

// Select specific fields
const users = await User.findAll({
  attributes: ['id', 'full_name', 'email']  // Only these fields
});

// Exclude fields
const users = await User.findAll({
  attributes: { exclude: ['password'] }  // Everything except password
});

// Count
const count = await User.count({
  where: { status: 'Active' }
});

// Find and count (for pagination)
const { count, rows } = await User.findAndCountAll({
  where: { status: 'Active' },
  limit: 10,
  offset: 0
});

console.log(`Total: ${count}, Fetched: ${rows.length}`);
```

### Operators Reference

```javascript
const { Op } = require('sequelize');

// Comparison
[Op.eq]: value          // = value
[Op.ne]: value          // != value
[Op.gt]: value          // > value
[Op.gte]: value         // >= value
[Op.lt]: value          // < value
[Op.lte]: value         // <= value

// Logical
[Op.and]: [...]         // AND
[Op.or]: [...]          // OR
[Op.not]: value         // NOT

// Strings
[Op.like]: '%value%'    // LIKE (case-sensitive)
[Op.iLike]: '%value%'   // ILIKE (case-insensitive)
[Op.startsWith]: 'value' // Starts with
[Op.endsWith]: 'value'  // Ends with

// Arrays
[Op.in]: [1, 2, 3]      // IN (1, 2, 3)
[Op.notIn]: [1, 2, 3]   // NOT IN (1, 2, 3)

// NULL
[Op.is]: null           // IS NULL
[Op.not]: null          // IS NOT NULL
```

---

## 9. Instance vs Class Methods

### Instance Methods
Run on a **single record** (instance).

```javascript
// Get a user (instance)
const user = await User.findByPk(1);

// Instance methods (built-in)
await user.update({ status: 'Active' });
await user.destroy();
await user.reload();

// Custom instance method
User.prototype.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

// Usage:
console.log(user.getFullName());  // "John Doe"
```

### Class Methods
Run on the **Model itself**.

```javascript
// Class methods (built-in)
await User.findAll();
await User.create({ ... });
await User.count();

// Custom class method
User.findActiveUsers = async function() {
  return await this.findAll({
    where: { status: 'Active', is_deleted: false }
  });
};

// Usage:
const activeUsers = await User.findActiveUsers();
```

### Your Model Could Have:

```javascript
// Add to User model:

// Instance method - for single user
User.prototype.isActive = function() {
  return this.status === 'Active' && !this.is_deleted;
};

// Instance method - check if radiologist
User.prototype.isRadiologist = function() {
  return this.role === 'Radiologist';
};

// Class method - find by role
User.findByRole = async function(role) {
  return await this.findAll({
    where: { role, is_deleted: false }
  });
};

// Usage:
const user = await User.findByPk(1);
console.log(user.isActive());        // true/false
console.log(user.isRadiologist());   // true/false

const radiologists = await User.findByRole('Radiologist');
```

---

## 10. Best Practices

### 1. Always Use Validations
```javascript
// ❌ Bad: No validation
email: {
  type: DataTypes.STRING
}

// ✅ Good: With validation
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: { msg: 'Invalid email format' }
  }
}
```

### 2. Use Hooks for Automation
```javascript
// ✅ Password auto-hashing
{
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
```

### 3. Always Paginate Large Queries
```javascript
// ❌ Bad: Load everything
const users = await User.findAll();

// ✅ Good: Paginate
const users = await User.findAll({
  limit: 20,
  offset: 0
});
```

### 4. Select Only Needed Fields
```javascript
// ❌ Bad: Load all fields
const users = await User.findAll();

// ✅ Good: Select specific fields
const users = await User.findAll({
  attributes: ['id', 'full_name', 'email']
});
```

### 5. Use Associations Wisely
```javascript
// ❌ Bad: N+1 query problem
const facilities = await Facility.findAll();
for (let facility of facilities) {
  const creator = await User.findByPk(facility.created_by);
  // Runs N queries!
}

// ✅ Good: Use include (eager loading)
const facilities = await Facility.findAll({
  include: [{
    model: User,
    as: 'CreatedBy'
  }]
  // Runs 1 query!
});
```

### 6. Use Transactions for Multiple Operations
```javascript
const t = await sequelize.transaction();

try {
  await User.create({ ... }, { transaction: t });
  await Facility.create({ ... }, { transaction: t });
  await t.commit();  // ✅ All succeed
} catch (error) {
  await t.rollback();  // ❌ All fail
  throw error;
}
```

### 7. Never Store Passwords in Plain Text
```javascript
// ✅ Use hooks to auto-hash
{
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
```

### 8. Use Soft Deletes
```javascript
// ❌ Hard delete (data lost forever)
await user.destroy();

// ✅ Soft delete (data preserved)
await user.update({
  is_deleted: true,
  deleted_at: new Date()
});
```

---

## 📝 Quick Reference

### Model Definition Template

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ModelName = sequelize.define('table_name', {
  // Primary Key (optional - auto-generated if omitted)
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Required field
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' }
    }
  },
  
  // Optional field with default
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
    allowNull: false
  },
  
  // Unique field
  email: {
    type: DataTypes.STRING,
    unique: { msg: 'Email already exists' },
    validate: {
      isEmail: { msg: 'Invalid email' }
    }
  },
  
  // Soft delete fields
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
  
}, {
  // Options
  timestamps: true,        // Auto createdAt/updatedAt
  underscored: true,       // Use snake_case
  tableName: 'table_name', // Explicit table name
  
  // Hooks
  hooks: {
    beforeCreate: async (record) => {
      // Do something before creating
    },
    afterCreate: async (record) => {
      // Do something after creating
    }
  },
  
  // Indexes
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = ModelName;
```

---

## 🎯 Summary

**Models are:**
- 📋 Blueprints for database tables
- ✅ Data validators
- 🔗 Relationship managers
- 🎣 Query builders
- 🛠️ Business logic containers

**Key Concepts:**
1. **Fields** = Table columns (name, email, etc.)
2. **DataTypes** = What kind of data (STRING, INTEGER, etc.)
3. **Validations** = Rules for data (email format, length, etc.)
4. **Hooks** = Auto-run code (hash password, log changes, etc.)
5. **Associations** = Relationships (User → Facility)
6. **Queries** = Getting data (find, create, update, delete)

**Your Models:**
- `User.js` - Represents users (staff)
- `Facility.js` - Represents facilities (hospitals, clinics)

Now you understand how models work! 🎉

