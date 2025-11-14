# 📚 Complete Models Documentation

Welcome to the complete guide for understanding and using Sequelize models in your Express.js backend!

---

## 📑 Documentation Index

### 1. **UNDERSTANDING_MODELS.md** 📖
**Complete theoretical guide** - Start here if you're new to models.

**What you'll learn:**
- What models are and how they work
- Model structure and anatomy
- Data types (STRING, INTEGER, BOOLEAN, etc.)
- Field options (allowNull, unique, defaultValue)
- Validations (email, length, custom)
- Hooks (lifecycle events)
- Associations (relationships between models)
- Querying (find, create, update, delete)
- Instance vs Class methods
- Best practices

**Read this when:** You want to understand the fundamentals

---

### 2. **MODEL_EXAMPLES.md** 💻
**Practical examples** - Real code you can copy and use.

**What you'll find:**
- Creating records (users, facilities)
- Reading records (find, search, filter)
- Updating records (single, multiple, partial)
- Deleting records (soft delete, hard delete)
- Searching & filtering with operators
- Working with associations
- Common patterns (authentication, duplicate check, transactions)
- Error handling

**Read this when:** You need code examples for specific tasks

---

### 3. **MODELS_QUICK_REFERENCE.md** ⚡
**Quick lookup card** - Fast reference for common operations.

**What's included:**
- CRUD operations cheat sheet
- Query examples
- Where clause patterns
- Validation examples
- Hook examples
- Common patterns
- Best practices DO/DON'T
- Most frequently used operations

**Use this when:** You need a quick reminder or syntax lookup

---

## 🗺️ Learning Path

### For Beginners:
```
1. Read: UNDERSTANDING_MODELS.md (Sections 1-5)
   ↓ Learn what models are and basic concepts
   
2. Try: MODEL_EXAMPLES.md (Section 1-4)
   ↓ Practice CRUD operations
   
3. Keep: MODELS_QUICK_REFERENCE.md handy
   ↓ Use as reference while coding
```

### For Quick Reference:
```
1. Check: MODELS_QUICK_REFERENCE.md first
   ↓ Find the operation you need
   
2. If need more detail: MODEL_EXAMPLES.md
   ↓ See complete examples
   
3. If still confused: UNDERSTANDING_MODELS.md
   ↓ Understand the concept
```

### For Mastery:
```
1. Read all three documents
2. Try examples in your controller
3. Experiment with your own queries
4. Check User.js and Facility.js models
```

---

## 🎯 Your Current Models

### User Model (`models/User.js`)
Represents system users (staff members).

**Roles:**
- Radiologist (doctors who review scans)
- Technician (operate imaging equipment)
- FrontDesk (reception staff)

**Key Fields:**
- Authentication: username, email, password (auto-hashed!)
- Personal: full_name, gender, date_of_birth, mobile_number
- System: role, status, facility_id
- Role-specific: department, specialty, employee_id, etc.
- Audit: is_deleted, deleted_at, created_at, updated_at

**Special Features:**
- Password auto-hashing (before create/update)
- Soft delete support
- Role-based fields
- Email validation
- Mobile number validation

### Facility Model (`models/Facility.js`)
Represents healthcare facilities.

**Types:**
- Hospital
- Diagnostic Center
- Clinic

**Key Fields:**
- Basic: facility_name, facility_code, facility_type
- Address: address_line_1, city, state, country, pincode
- Contact: contact_number, email_id
- PACS/RIS: pacs_ip_address, pacs_port, integration_status
- Audit: created_by, modified_by, status

**Special Features:**
- Belongs to User (created_by, modified_by)
- ENUM types for constrained values
- PACS/RIS integration tracking

---

## 🔍 Common Tasks & Where to Find Them

### Task: Create a new user
**Go to:** `MODEL_EXAMPLES.md` → Section 1 → "Create a Simple User"

### Task: Find users by role
**Go to:** `MODEL_EXAMPLES.md` → Section 5 → "Filter by Role"

### Task: Search users by name
**Go to:** `MODEL_EXAMPLES.md` → Section 5 → "Search by Name"

### Task: Update user password
**Go to:** `MODEL_EXAMPLES.md` → Section 3 → "Update Password"

### Task: Soft delete user
**Go to:** `MODEL_EXAMPLES.md` → Section 4 → "Soft Delete"

### Task: Get facility with creator info
**Go to:** `MODEL_EXAMPLES.md` → Section 6 → "Get Facility with Creator Info"

### Task: Paginate results
**Go to:** `MODEL_EXAMPLES.md` → Section 5 → "Filter with Pagination"

### Task: Check if email exists
**Go to:** `MODEL_EXAMPLES.md` → Section 7 → "Duplicate Check Before Create"

### Task: Handle validation errors
**Go to:** `MODEL_EXAMPLES.md` → Section 8 → "Validation Errors"

### Task: Quick syntax lookup
**Go to:** `MODELS_QUICK_REFERENCE.md` → Find the operation

---

## 📊 Architecture Overview

```
Your Application Flow:

Client Request
    ↓
Routes (routes/userRoutes.js)
    ↓
Controller (controllers/userController.js)
    ↓
Model (models/User.js) ← YOU ARE HERE
    ↓
Database (PostgreSQL)
    ↓
Response back to Client
```

### Model's Role:
- 📋 **Define** what data looks like (schema)
- ✅ **Validate** data before saving
- 🔗 **Manage** relationships with other models
- 🎣 **Automate** tasks (hooks)
- 🔍 **Query** database easily
- 🛡️ **Protect** data integrity

---

## 💡 Quick Start Examples

### Example 1: Create a Radiologist
```javascript
const User = require('./models/User');

const radiologist = await User.create({
  full_name: 'Dr. Sarah Johnson',
  gender: 'Female',
  date_of_birth: '1985-06-15',
  username: 'dr_sarah',
  email: 'sarah@hospital.com',
  mobile_number: '9876543210',
  password: 'SecurePass@123',  // Auto-hashed!
  role: 'Radiologist',
  facility_id: 'FAC001',
  specialty: 'MRI Specialist',
  peer_reviewer: true
});

console.log('Created:', radiologist.id);
```

### Example 2: Find Active Users
```javascript
const activeUsers = await User.findAll({
  where: {
    status: 'Active',
    is_deleted: false
  },
  attributes: ['id', 'full_name', 'email', 'role'],
  order: [['created_at', 'DESC']],
  limit: 20
});

console.log(`Found ${activeUsers.length} active users`);
```

### Example 3: Search Users
```javascript
const { Op } = require('sequelize');

const users = await User.findAll({
  where: {
    [Op.or]: [
      { full_name: { [Op.iLike]: '%john%' } },
      { email: { [Op.iLike]: '%john%' } }
    ],
    is_deleted: false
  }
});
```

---

## 🎓 Learning Resources

### Built into This Project:
1. `models/User.js` - See actual model code
2. `models/Facility.js` - See actual model code
3. `controllers/userController.js` - See how controllers use models
4. `controllers/authController.js` - See authentication flow

### External Resources:
- [Sequelize Official Docs](https://sequelize.org/docs/v6/)
- [Sequelize Cheat Sheet](https://github.com/sequelize/sequelize-cheat-sheet)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

---

## 🐛 Debugging Tips

### Common Issues:

**1. "validation error"**
→ Check `UNDERSTANDING_MODELS.md` Section 5 (Validations)
→ Make sure all required fields are provided

**2. "unique constraint error"**
→ Email/username/mobile already exists
→ Check `MODEL_EXAMPLES.md` Section 7 (Duplicate Check)

**3. "cannot read property of null"**
→ Record not found
→ Check if user exists before accessing properties

**4. "password not hashing"**
→ Check hooks in `models/User.js`
→ Make sure `beforeCreate` and `beforeUpdate` hooks are present

**5. "association not found"**
→ Check `models/index.js` for associations
→ Make sure models are properly imported

---

## 🎯 Next Steps

### After Understanding Models:

1. **Read**: `USER_API_GUIDE.md` - See how models are used in API
2. **Read**: `IMPLEMENTATION_SUMMARY.md` - See complete auth system
3. **Practice**: Modify `userController.js` to add new features
4. **Create**: New models (Patient, Appointment, etc.)
5. **Test**: Write tests for your models

---

## 🆘 Need Help?

### If You're Stuck:

1. **Check this README** for navigation
2. **Search the docs** for your specific task
3. **Look at examples** in `MODEL_EXAMPLES.md`
4. **Check your models** (`User.js`, `Facility.js`)
5. **Review controllers** to see usage

### Common Questions:

**Q: How do I create a user?**
A: See `MODEL_EXAMPLES.md` → Section 1

**Q: How do I search by name?**
A: See `MODEL_EXAMPLES.md` → Section 5

**Q: What's the difference between findAll and findOne?**
A: See `UNDERSTANDING_MODELS.md` → Section 8

**Q: How do I add validation?**
A: See `UNDERSTANDING_MODELS.md` → Section 5

**Q: What are hooks?**
A: See `UNDERSTANDING_MODELS.md` → Section 6

**Q: How do relationships work?**
A: See `UNDERSTANDING_MODELS.md` → Section 7

---

## 📝 Summary

You now have:
- ✅ Complete conceptual understanding (UNDERSTANDING_MODELS.md)
- ✅ Practical code examples (MODEL_EXAMPLES.md)
- ✅ Quick reference card (MODELS_QUICK_REFERENCE.md)
- ✅ Navigation guide (this file)

**Total Documentation: ~100 pages of comprehensive guidance!**

---

## 🚀 Get Started

**Recommended Reading Order:**

1. **First 30 minutes**: Read this file (README_MODELS.md)
2. **Next 60 minutes**: Read UNDERSTANDING_MODELS.md Sections 1-7
3. **Next 60 minutes**: Try examples from MODEL_EXAMPLES.md
4. **Keep handy**: MODELS_QUICK_REFERENCE.md for quick lookup

**Happy Coding! 🎉**

---

**Last Updated:** January 2025
**Your Models:** User, Facility
**Framework:** Sequelize 6.x with PostgreSQL
**Documentation Version:** 1.0

