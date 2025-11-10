# API Endpoints Reference

This document lists all API endpoints used in the application.

## Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

## Expense Endpoints

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

## Request/Response Formats

### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register Request
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Auth Response
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

### Create Expense Request
```json
{
  "title": "Grocery run",
  "amount": 100.00,
  "category": "Food",
  "date": "2024-01-01"
}
```

### Expense Response
```json
{
  "id": "expense-id",
  "createdBy": "user-id",
  "title": "Grocery run",
  "amount": 100.00,
  "category": "Food",
  "date": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Expense Stats Response
```json
[
  {
    "category": "Food",
    "total": 500.00,
    "count": 5
  },
  {
    "category": "Transport",
    "total": 300.00,
    "count": 3
  },
  {
    "category": "Utilities",
    "total": 200.00,
    "count": 2
  },
  {
    "category": "Other",
    "total": 0,
    "count": 0
  }
]
```

