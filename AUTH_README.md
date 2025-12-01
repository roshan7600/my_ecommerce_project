# Authentication System Documentation

## Overview
A complete sign-in and sign-up system for the Thapa eCommerce project built with vanilla JavaScript and localStorage.

## Features

### Sign Up
- **Full Name validation**
- **Email validation** with duplicate checking
- **Password strength indicator**
  - Weak (red): < 2 strength criteria
  - Medium (orange): 2-3 strength criteria
  - Strong (green): 4+ strength criteria
- **Password confirmation** matching
- **Terms & Conditions** acceptance
- **Social signup** (Google - placeholder for integration)

### Sign In
- **Email & Password validation**
- **Remember me** option (stores email for auto-fill)
- **Social login** (Google - placeholder for integration)
- **Account linking** to cart and orders

### Features
- **Persistent authentication** (7-day token expiration)
- **User information** stored in localStorage
- **Secure password encoding** (Base64 - use proper hashing in production)
- **Automatic session management**
- **User menu** in header when logged in
- **Logout functionality**

## File Structure

```
signin.html          - Sign in page
signup.html          - Sign up page
auth.js              - Authentication logic and functions
style.css            - Updated with auth styles
index.html           - Updated with auth links
main.js              - Updated to import auth module
```

## How It Works

### Sign Up Flow
1. User fills in name, email, password, and accepts terms
2. Form validation checks all fields
3. System checks if email already exists
4. New user is created and stored in localStorage
5. User is redirected to sign in page

### Sign In Flow
1. User enters email and password
2. Form validation checks credentials format
3. System searches for matching user
4. If found, authentication token is generated
5. User information is stored for session
6. User is redirected to home page
7. Header displays user name and logout button

## Usage

### In Your HTML
```html
<!-- Links are already updated in index.html -->
<a href="signin.html">SIGN IN</a>
<a href="signup.html">SIGN UP</a>
```

### In Your JavaScript
```javascript
import { getCurrentUser, isUserLoggedIn, logout } from "./auth.js";

// Get current logged-in user
const user = getCurrentUser();
console.log(user); // { id, name, email }

// Check if user is logged in
if (isUserLoggedIn()) {
  console.log("User is logged in");
}

// Logout user
// logout(); // This is called from the logout button
```

## localStorage Keys

- `ecommerce_users` - Stores array of all registered users
- `auth_token` - Current user's authentication token (expires in 7 days)
- `currentUser` - Current logged-in user info
- `remember_email` - Email saved for "Remember me" option

## User Object Structure

```javascript
{
  id: 1700000000000,           // Unix timestamp
  name: "John Doe",
  email: "john@example.com",
  password: "base64encodedpassword",  // DO NOT use in production
  createdAt: "2024-12-01T10:30:00Z"
}
```

## Authentication Token Structure

```javascript
{
  userId: 1700000000000,
  email: "john@example.com",
  name: "John Doe",
  issuedAt: "2024-12-01T10:30:00Z",
  expiresAt: "2024-12-08T10:30:00Z"  // 7 days
}
```

## Validation Rules

### Email
- Must be valid email format (contains @ and .)
- Must be unique in the system
- Already registered emails show error message

### Password
- Minimum 8 characters
- Password strength based on:
  - Length ≥ 8 chars (1 point)
  - Length ≥ 12 chars (1 point)
  - Contains uppercase letter (1 point)
  - Contains number (1 point)
  - Contains special character (1 point)

### Name
- Required field
- Can contain letters, spaces, and special characters

### Terms
- Must be accepted during sign up

## Password Strength Indicator

The signup form includes a visual password strength indicator:
- Shows real-time feedback as user types
- Color-coded (red → orange → green)
- Displays strength level text

## Security Notes

⚠️ **IMPORTANT:** This implementation uses Base64 encoding for passwords, which is NOT secure for production!

For production, implement:
1. **Proper password hashing** (bcrypt, Argon2)
2. **HTTPS/TLS** for all communications
3. **Server-side validation** and authentication
4. **JWT tokens** with proper signing
5. **Database** instead of localStorage
6. **Rate limiting** on login attempts
7. **Two-factor authentication** (2FA)

## Error Handling

All forms include validation error messages that appear below input fields:
- Form-level validation before submission
- Field-specific error messages
- Toast notifications for major events
- Graceful error recovery

## Next Steps for Production

1. Move user data to backend database
2. Implement proper password hashing
3. Add email verification
4. Implement JWT or session-based auth
5. Add forgot password functionality
6. Integrate social OAuth providers
7. Add 2FA support
8. Implement rate limiting
9. Add password reset token system
10. Add user profile management

## Testing the System

### Test Sign Up
1. Go to `signup.html`
2. Fill in valid information
3. Create account - should redirect to sign in
4. Check browser DevTools → Application → localStorage

### Test Sign In
1. Go to `signin.html`
2. Enter credentials from test account
3. Sign in - should redirect to home page
4. Header should show user name
5. Try "Remember me" checkbox

### Test Session
1. Refresh the page - should stay logged in
2. Visit any page - user info persists
3. Click logout button - clears session
4. Refresh - returns to sign in state

## Troubleshooting

**Users not saving?**
- Check localStorage is not disabled
- Check browser DevTools for errors
- Verify localStorage keys exist

**Can't log in?**
- Verify email is registered (check localStorage)
- Check password matches exactly
- Clear cache and try again

**Session lost on refresh?**
- Verify token is stored in localStorage
- Check token expiration (7 days)
- Check currentUser data in localStorage

## Support

For issues or questions about the authentication system, check:
1. Browser console for error messages
2. localStorage data in DevTools
3. Network tab for form submissions
4. Toast notifications for user feedback
