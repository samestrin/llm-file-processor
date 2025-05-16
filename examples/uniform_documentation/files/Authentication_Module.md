# Authentication Module

This module handles user authentication including login, registration, and permission management.

## API Reference

### register(username, email, password)
Creates a new user account.

**Parameters:**
- `username` (string): The user's display name
- `email` (string): Valid email address
- `password` (string): Password meeting security requirements

**Returns:**
- User object containing ID and access token

**Example:**
```javascript
const user = await auth.register('johndoe', 'john@example.com', 'secureP@ss123');
```

### login(email, password)
Authenticates a user and creates a session.

**Parameters:**
- `email` (string): The user's email
- `password` (string): User password

**Returns:**
- Session object with token and expiration

**Example:**
```javascript
const session = await auth.login('john@example.com', 'secureP@ss123');
```

### validateToken(token)
Verifies if a token is valid and not expired.

**Parameters:**
- `token` (string): JWT token to validate

**Returns:**
- Boolean indicating validity

## Security Notes

The authentication module implements the following security measures:
- Password hashing using bcrypt
- Rate limiting for login attempts
- CSRF protection tokens
- HttpOnly secure cookies