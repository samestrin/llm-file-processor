API DOCUMENTATION
Author: Sarah Johnson
Last edited: 2023-01-05

# Introduction #

This documentation covers the RESTful API endpoints available in version 2.0.

## Authentication

API requests require authentication using JWT tokens.
To obtain a token:

1) Register at https://api.example.com/register
2) Request a token at https://api.example.com/token
3) Include the token in the Authorization header

Authentication Errors:
* 401 - Invalid token
* 403 - Insufficient permissions

## Endpoints

GET /api/v2/users
----------------
Returns a list of users.

Parameters:
* page (optional): Page number for pagination
* limit (optional): Results per page (default: 20)

Example Response:
`
{
  "users": [
    {"id": 1, "name": "User 1"},
    {"id": 2, "name": "User 2"}
  ],
  "total": 150,
  "pages": 8
}
`

POST /api/v2/users
-----------------
Creates a new user.

Required fields:
* username
* email
* password

Keywords: API, REST, documentation, endpoints, authentication