# Coupon Code Generator System

A secure and scalable Coupon Management System with user authentication, admin control, and coupon redemption tracking.

## Features

### User Features
- Register (Name, Email, Mobile)
- Login & Authentication (JWT)
- View Assigned Coupon (After Admin Approval)
- Use Coupon (Once Only)
- See Coupon Status (Active / Expired)

### Admin Features
- Admin Login & Authentication
- View & Approve Registered Users
- Generate Coupon Codes
- Assign Coupons to Approved Users
- Track Coupon Usage & Expiry

## Tech Stack

### Backend
- Spring Boot 3.2.3
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- MapStruct for DTO Mapping
- Lombok

### Frontend
- React
- Bootstrap
- React Router
- Axios
- Formik + Yup
- Toast Notifications

## Prerequisites

- Java 17
- Maven
- MySQL
- Node.js & npm

## Setup & Installation

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd coupon-generator/backend
   ```
3. Update MySQL credentials in `src/main/resources/application.yml`
4. Build the project:
   ```bash
   mvn clean install
   ```
5. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:8080/api

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd coupon-generator/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend application will start on http://localhost:3000

## API Documentation

The API documentation will be available at http://localhost:8080/api/swagger-ui.html when the backend server is running.
