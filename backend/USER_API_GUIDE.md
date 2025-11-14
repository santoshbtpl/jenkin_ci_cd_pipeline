# User Management API Guide

Complete guide for User CRUD operations.

## Base URL
```
http://localhost:5000/ris/api/users
```

---

## 1. Get All Users (with Pagination & Filtering)

### Endpoint
```
GET /ris/api/users
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Results per page (default: 10) | `?limit=20` |
| `role` | string | Filter by role | `?role=Radiologist` |
| `status` | string | Filter by status | `?status=Active` |
| `facility_id` | string | Filter by facility | `?facility_id=FAC001` |
| `search` | string | Search in name, email, username | `?search=john` |

### Examples

#### Get All Users (Default - Page 1, 10 per page)
```bash
curl -X GET http://localhost:5000/ris/api/users
```

#### Get Users with Pagination
```bash
# Page 2, 20 users per page
curl -X GET "http://localhost:5000/ris/api/users?page=2&limit=20"
```

#### Filter by Role
```bash
# Get all Radiologists
curl -X GET "http://localhost:5000/ris/api/users?role=Radiologist"

# Get all Technicians
curl -X GET "http://localhost:5000/ris/api/users?role=Technician"

# Get all FrontDesk staff
curl -X GET "http://localhost:5000/ris/api/users?role=FrontDesk"
```

#### Filter by Status
```bash
# Get only active users
curl -X GET "http://localhost:5000/ris/api/users?status=Active"

# Get only inactive users
curl -X GET "http://localhost:5000/ris/api/users?status=Inactive"
```

#### Filter by Facility
```bash
curl -X GET "http://localhost:5000/ris/api/users?facility_id=FAC001"
```

#### Search Users
```bash
# Search by name, email, or username
curl -X GET "http://localhost:5000/ris/api/users?search=john"
```

#### Combined Filters
```bash
# Active Radiologists in FAC001, Page 1
curl -X GET "http://localhost:5000/ris/api/users?role=Radiologist&status=Active&facility_id=FAC001&page=1&limit=10"
```

### Success Response
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid-here",
      "full_name": "Dr. John Smith",
      "gender": "Male",
      "date_of_birth": "1980-05-15",
      "username": "radiologist",
      "email": "radiologist@example.com",
      "mobile_number": "9876543210",
      "role": "Radiologist",
      "facility_id": "FAC001",
      "status": "Active",
      "doctor_id": "DOC001",
      "registration_number": "REG123456",
      "specialty": "Radiology",
      "peer_reviewer": true,
      "reporting_modality_access": ["CT", "MRI", "X-Ray"],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "usersPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 2. Get User by ID

### Endpoint
```
GET /ris/api/users/:id
```

### Example
```bash
curl -X GET http://localhost:5000/ris/api/users/USER_ID_HERE
```

### Success Response
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-here",
    "full_name": "Dr. John Smith",
    "gender": "Male",
    "date_of_birth": "1980-05-15",
    "username": "radiologist",
    "email": "radiologist@example.com",
    "mobile_number": "9876543210",
    "role": "Radiologist",
    "facility_id": "FAC001",
    "status": "Active",
    "doctor_id": "DOC001",
    "registration_number": "REG123456",
    "specialty": "Radiology",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 3. Create User

### Endpoint
```
POST /ris/api/users
```

### Create Radiologist
```bash
curl -X POST http://localhost:5000/ris/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Emily Watson",
    "gender": "Female",
    "date_of_birth": "1982-08-20",
    "username": "emily_rad",
    "email": "emily@hospital.com",
    "mobile_number": "9123456700",
    "password": "Emily@123",
    "role": "Radiologist",
    "facility_id": "FAC001",
    "doctor_id": "DOC003",
    "registration_number": "REG345678",
    "specialty": "CT Scan Specialist",
    "peer_reviewer": false,
    "reporting_modality_access": ["CT", "X-Ray"]
  }'
```

### Create Technician
```bash
curl -X POST http://localhost:5000/ris/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Robert Brown",
    "gender": "Male",
    "date_of_birth": "1995-03-10",
    "username": "robert_tech",
    "email": "robert@hospital.com",
    "mobile_number": "9123456701",
    "password": "Robert@123",
    "role": "Technician",
    "facility_id": "FAC001",
    "employee_id": "EMP003",
    "department": ["MRI", "X-Ray"],
    "qualification": "B.Sc Medical Imaging",
    "experience_years": 2,
    "reporting_supervisor": "supervisor_id_here"
  }'
```

### Create FrontDesk
```bash
curl -X POST http://localhost:5000/ris/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Lisa Anderson",
    "gender": "Female",
    "date_of_birth": "1997-11-25",
    "username": "lisa_desk",
    "email": "lisa@hospital.com",
    "mobile_number": "9123456702",
    "password": "Lisa@123",
    "role": "FrontDesk",
    "facility_id": "FAC001",
    "assigned_counter": "Counter 3",
    "shift_timing": "8:00 AM - 4:00 PM"
  }'
```

### Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "new-uuid-here",
    "full_name": "Dr. Emily Watson",
    "username": "emily_rad",
    "email": "emily@hospital.com",
    "role": "Radiologist",
    "status": "Active",
    "createdAt": "2025-01-15T11:00:00.000Z"
  }
}
```

### Error Responses

#### Duplicate Email
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

#### Duplicate Mobile
```json
{
  "success": false,
  "message": "Mobile number already exists"
}
```

#### Duplicate Username
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

## 4. Update User

### Endpoint
```
PUT /ris/api/users/:id
```

### Examples

#### Update Basic Info
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. John Smith Jr.",
    "mobile_number": "9999999999"
  }'
```

#### Update Status
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Inactive"
  }'
```

#### Update Password
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewPassword@123"
  }'
```

#### Update Role-Specific Fields (Radiologist)
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "MRI Specialist",
    "peer_reviewer": true,
    "reporting_modality_access": ["MRI", "CT", "X-Ray", "Ultrasound"]
  }'
```

#### Update Multiple Fields
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Updated Name",
    "email": "newemail@hospital.com",
    "mobile_number": "9111111111",
    "status": "Active"
  }'
```

### Success Response
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-here",
    "full_name": "Dr. Updated Name",
    "email": "newemail@hospital.com",
    "mobile_number": "9111111111",
    "status": "Active",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

### Error Responses

#### User Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Email Already Exists
```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### Mobile Already Exists
```json
{
  "success": false,
  "message": "Mobile number already exists"
}
```

#### Username Already Exists
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

## 5. Delete User (Soft Delete)

### Endpoint
```
DELETE /ris/api/users/:id
```

### Example
```bash
curl -X DELETE http://localhost:5000/ris/api/users/USER_ID_HERE
```

### Success Response
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found"
}
```

### Note
This is a **soft delete** - the user is marked as deleted but not removed from the database:
- `is_deleted` is set to `true`
- `deleted_at` is set to current timestamp
- `status` is set to `Inactive`
- User won't appear in normal queries

---

## Complete CRUD Workflow Example

### Step 1: Create a User
```bash
curl -X POST http://localhost:5000/ris/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "gender": "Male",
    "date_of_birth": "1990-01-01",
    "username": "testuser123",
    "email": "testuser@example.com",
    "mobile_number": "9000000000",
    "password": "Test@1234",
    "role": "Technician",
    "facility_id": "FAC001",
    "employee_id": "EMP999",
    "qualification": "Test Qualification"
  }'
```

**Response:** Note the `id` from the response.

### Step 2: Get All Users (verify creation)
```bash
curl -X GET "http://localhost:5000/ris/api/users?search=testuser"
```

### Step 3: Get User by ID
```bash
curl -X GET http://localhost:5000/ris/api/users/USER_ID_FROM_STEP1
```

### Step 4: Update User
```bash
curl -X PUT http://localhost:5000/ris/api/users/USER_ID_FROM_STEP1 \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Test User",
    "qualification": "Updated Qualification"
  }'
```

### Step 5: Delete User
```bash
curl -X DELETE http://localhost:5000/ris/api/users/USER_ID_FROM_STEP1
```

### Step 6: Verify Deletion (should not appear)
```bash
curl -X GET "http://localhost:5000/ris/api/users?search=testuser"
```

---

## Advanced Query Examples

### Get Active Radiologists at Facility FAC001
```bash
curl -X GET "http://localhost:5000/ris/api/users?role=Radiologist&status=Active&facility_id=FAC001"
```

### Search and Paginate
```bash
# Search for "john" with 20 results per page, get page 1
curl -X GET "http://localhost:5000/ris/api/users?search=john&page=1&limit=20"
```

### Get All Inactive Users
```bash
curl -X GET "http://localhost:5000/ris/api/users?status=Inactive"
```

### Get Users by Facility with Pagination
```bash
curl -X GET "http://localhost:5000/ris/api/users?facility_id=FAC001&page=1&limit=50"
```

---

## Field Reference

### Common Fields (All Roles)
- `full_name` *(required)*
- `gender` *(required)* - Male, Female, Other
- `date_of_birth` *(required)* - Format: YYYY-MM-DD
- `username` *(required, unique)*
- `email` *(required, unique)*
- `mobile_number` *(required, unique)* - 10 digits
- `password` *(required)* - Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- `role` *(required)* - Radiologist, Technician, FrontDesk
- `facility_id` *(required)*
- `status` - Active, Inactive (default: Inactive)
- `profile_picture` *(optional)*

### Radiologist-Specific Fields
- `doctor_id`
- `registration_number`
- `specialty`
- `signature`
- `peer_reviewer` (boolean)
- `reporting_modality_access` (array)

### Technician-Specific Fields
- `employee_id`
- `department` (array)
- `qualification`
- `experience_years` (number)
- `reporting_supervisor`

### FrontDesk-Specific Fields
- `assigned_counter`
- `shift_timing`

---

## Security Notes

1. **Passwords** are automatically hashed before storage
2. **Passwords** are never returned in API responses
3. **Soft delete** prevents accidental data loss
4. **Duplicate checking** prevents duplicate emails, mobiles, and usernames
5. **Authentication required** for all user management endpoints (add JWT token in headers)

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, duplicate data)
- `404` - Not Found
- `500` - Internal Server Error

