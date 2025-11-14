# API Testing Guide

## Base URL
```
http://localhost:5000/ris/api
```

## 1. Register User (POST /ris/api/auth/register)

### Register Radiologist
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Sarah Johnson",
    "gender": "Female",
    "date_of_birth": "1985-06-15",
    "username": "sarah_radiologist",
    "email": "sarah@hospital.com",
    "mobile_number": "9123456789",
    "password": "Sarah@123",
    "role": "Radiologist",
    "facility_id": "FAC001",
    "doctor_id": "DOC002",
    "registration_number": "REG789012",
    "specialty": "MRI Specialist",
    "peer_reviewer": true,
    "reporting_modality_access": ["MRI", "CT"]
  }'
```

### Register Technician
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "gender": "Male",
    "date_of_birth": "1992-03-20",
    "username": "john_tech",
    "email": "john@hospital.com",
    "mobile_number": "9123456790",
    "password": "Tech@1234",
    "role": "Technician",
    "facility_id": "FAC001",
    "employee_id": "EMP002",
    "department": ["X-Ray", "CT"],
    "qualification": "B.Sc Radiology Technology",
    "experience_years": 3
  }'
```

### Register FrontDesk
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Emily Brown",
    "gender": "Female",
    "date_of_birth": "1998-12-05",
    "username": "emily_desk",
    "email": "emily@hospital.com",
    "mobile_number": "9123456791",
    "password": "Emily@456",
    "role": "FrontDesk",
    "facility_id": "FAC001",
    "assigned_counter": "Counter 2",
    "shift_timing": "10:00 AM - 6:00 PM"
  }'
```

## 2. Login (POST /ris/api/auth/login)

### Login with Radiologist
```bash
curl -X POST http://localhost:5000/ris/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "radiologist",
    "password": "radio123"
  }'
```

### Login with Technician
```bash
curl -X POST http://localhost:5000/ris/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "technician",
    "password": "tech123"
  }'
```

### Login with FrontDesk
```bash
curl -X POST http://localhost:5000/ris/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "frontdesk",
    "password": "front123"
  }'
```

## 3. Test Duplicate Email (Should Fail)
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "gender": "Male",
    "date_of_birth": "1990-01-01",
    "username": "testuser",
    "email": "radiologist@example.com",
    "mobile_number": "9999999999",
    "password": "Test@123",
    "role": "Technician",
    "facility_id": "FAC001"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

## 4. Test Duplicate Mobile (Should Fail)
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "gender": "Male",
    "date_of_birth": "1990-01-01",
    "username": "testuser2",
    "email": "unique@example.com",
    "mobile_number": "9876543210",
    "password": "Test@123",
    "role": "Technician",
    "facility_id": "FAC001"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Mobile number already exists"
}
```

## 5. Test Invalid Password (Should Fail)
```bash
curl -X POST http://localhost:5000/ris/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "gender": "Male",
    "date_of_birth": "1990-01-01",
    "username": "testuser3",
    "email": "test3@example.com",
    "mobile_number": "9999999998",
    "password": "weak",
    "role": "Technician",
    "facility_id": "FAC001"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "errors": [
    {"msg": "Password must be at least 8 characters"},
    {"msg": "Password must contain an uppercase letter"},
    {"msg": "Password must contain a number"},
    {"msg": "Password must contain a special character"}
  ]
}
```

## 6. Test Wrong Credentials (Should Fail)
```bash
curl -X POST http://localhost:5000/ris/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "radiologist",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Success Response Examples

### Successful Registration
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-here",
    "full_name": "Dr. Sarah Johnson",
    "gender": "Female",
    "date_of_birth": "1985-06-15",
    "username": "sarah_radiologist",
    "email": "sarah@hospital.com",
    "mobile_number": "9123456789",
    "role": "Radiologist",
    "facility_id": "FAC001",
    "status": "Active",
    "doctor_id": "DOC002",
    "registration_number": "REG789012",
    "specialty": "MRI Specialist",
    "peer_reviewer": true,
    "reporting_modality_access": ["MRI", "CT"],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "token": "your_jwt_token_here",
  "data": {
    "id": "uuid-here",
    "full_name": "Dr. John Smith",
    "gender": "Male",
    "username": "radiologist",
    "email": "radiologist@example.com",
    "mobile_number": "9876543210",
    "role": "Radiologist",
    "facility_id": "FAC001",
    "status": "Active",
    "doctor_id": "DOC001",
    "registration_number": "REG123456",
    "specialty": "Radiology",
    "peer_reviewer": true
  }
}
```

## Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&#)

## Valid Roles
- `Radiologist`
- `Technician`
- `FrontDesk`

## Mobile Number Format
- Must be exactly 10 digits
- Only numeric characters
- No spaces or special characters

