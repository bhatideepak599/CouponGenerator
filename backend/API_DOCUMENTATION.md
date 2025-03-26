# Coupon Generator API Documentation

## Authentication Endpoints

### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
    "email": "string",
    "password": "string",
    "name": "string"
}
```
- **Response:**
  - Success (200): "User registered successfully"
  - Error (400): Validation errors

### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```
- **Response:**
  - Success (200):
```json
{
    "token": "string",
    "type": "Bearer"
}
```
  - Error (401): Authentication failed

## User Endpoints

### 1. Get User's Coupons
- **Endpoint:** `GET /api/users/coupons`
- **Authentication:** Required (Bearer Token)
- **Response:**
  - Success (200):
```json
[
    {
        "id": "long",
        "code": "string",
        "description": "string",
        "discountAmount": "double",
        "expiryDate": "datetime",
        "used": "boolean",
        "createdAt": "datetime"
    }
]
```

### 2. Use Coupon
- **Endpoint:** `POST /api/users/coupons/{code}/use`
- **Authentication:** Required (Bearer Token)
- **Path Variables:**
  - code: Coupon code
- **Response:**
  - Success (200): "Coupon used successfully"
  - Error (404): Coupon not found
  - Error (400): Coupon already used/expired

## Admin Endpoints
All admin endpoints require authentication with ADMIN role.

### 1. Get All Users
- **Endpoint:** `GET /api/admin/users`
- **Authentication:** Required (Bearer Token + ADMIN role)
- **Response:**
  - Success (200):
```json
[
    {
        "id": "long",
        "email": "string",
        "name": "string",
        "approved": "boolean",
        "role": "string"
    }
]
```

### 2. Approve User
- **Endpoint:** `PUT /api/admin/users/{userId}/approve`
- **Authentication:** Required (Bearer Token + ADMIN role)
- **Path Variables:**
  - userId: User ID
- **Response:**
  - Success (200): "User approved successfully"
  - Error (404): User not found

### 3. Generate Coupon
- **Endpoint:** `POST /api/admin/coupons`
- **Authentication:** Required (Bearer Token + ADMIN role)
- **Request Parameters:**
  - description: string
  - discountAmount: double
  - expiryDate: datetime
- **Response:**
  - Success (200):
```json
{
    "id": "long",
    "code": "string",
    "description": "string",
    "discountAmount": "double",
    "expiryDate": "datetime",
    "used": false,
    "createdAt": "datetime"
}
```

### 4. Assign Coupon to User
- **Endpoint:** `POST /api/admin/coupons/{couponId}/assign`
- **Authentication:** Required (Bearer Token + ADMIN role)
- **Path Variables:**
  - couponId: Coupon ID
- **Request Parameters:**
  - userEmail: string
- **Response:**
  - Success (200): Coupon object
  - Error (404): Coupon/User not found

## Security
- All endpoints except `/api/auth/register` and `/api/auth/login` require authentication
- JWT token-based authentication is implemented
- Admin endpoints require ADMIN role
- CORS is configured for secure cross-origin requests
