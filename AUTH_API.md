# Authentication API Documentation

## Overview
Complete API reference for the authentication system.

---

## Functions

### `getCurrentUser()`
Returns the currently logged-in user's information.

**Returns:**
```javascript
{
  id: number,           // User ID (timestamp)
  name: string,         // User's full name
  email: string         // User's email address
} | null
```

**Example:**
```javascript
import { getCurrentUser } from "./auth.js";

const user = getCurrentUser();
if (user) {
  console.log(`Logged in as: ${user.name}`);
} else {
  console.log("No user logged in");
}
```

---

### `isUserLoggedIn()`
Checks if a user is currently logged in and if their session is valid.

**Returns:** `boolean`

**Example:**
```javascript
import { isUserLoggedIn } from "./auth.js";

if (isUserLoggedIn()) {
  // Show dashboard
} else {
  // Redirect to sign in
  window.location.href = "signin.html";
}
```

---

### `logout()`
Logs out the current user and clears the session.

**Behavior:**
- Clears localStorage auth data
- Shows logout success notification
- Redirects to home page after 1.5 seconds

**Example:**
```javascript
import { logout } from "./auth.js";

// Call logout (button already handles this)
logout();
```

---

### `getAllUsers()` ⚠️
Returns array of all registered users (admin only in production).

**Returns:** `Array<User>`

**⚠️ SECURITY WARNING:** Only use for admin panels. Not for client-side in production.

**Example:**
```javascript
import { getAllUsers } from "./auth.js";

const allUsers = getAllUsers();
console.log(`Total users: ${allUsers.length}`);
```

---

### `updateHeaderWithUserInfo()`
Updates the page header to show user info or sign in/up links.

**Automatically Called:** 
- On every page load via main.js

**Manual Usage:**
```javascript
import { updateHeaderWithUserInfo } from "./auth.js";

// After user logs in/out
updateHeaderWithUserInfo();
```

---

### `initializeAuth()`
Initializes the authentication system on page load.

**Automatically Called:** 
- On DOMContentLoaded for auth pages
- In auth.js module

**Does:**
- Initializes user database
- Sets up form event listeners
- Sets up password strength indicator
- Populates remembered email

---

## Data Structures

### User Object
```javascript
{
  id: 1701432600000,                    // Unix timestamp
  name: "John Doe",
  email: "john@example.com",
  password: "UGFzc3dvcmQxMjMh",        // Base64 encoded
  createdAt: "2024-12-01T10:30:00Z"
}
```

### Authentication Token
```javascript
{
  userId: 1701432600000,
  email: "john@example.com",
  name: "John Doe",
  issuedAt: "2024-12-01T10:30:00Z",
  expiresAt: "2024-12-08T10:30:00Z"    // 7 days from issue
}
```

### Current User Info
```javascript
{
  id: 1701432600000,
  name: "John Doe",
  email: "john@example.com"
}
```

---

## localStorage Keys Reference

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `ecommerce_users` | JSON Array | All registered users | `[{id, name, email, ...}]` |
| `auth_token` | JSON Object | Active session token | `{userId, email, ...}` |
| `currentUser` | JSON Object | Logged-in user info | `{id, name, email}` |
| `remember_email` | String | Saved email for login | `"john@example.com"` |

---

## Form Events

### Sign Up Form
**ID:** `signUpForm`

**Validates:**
- Full name (required)
- Email (valid format, unique)
- Password (min 8 chars, strong)
- Confirm password (match)
- Terms accepted

**On Submit:**
- Creates new user
- Saves to localStorage
- Shows success toast
- Redirects to signin

---

### Sign In Form
**ID:** `signInForm`

**Validates:**
- Email (valid format)
- Password (not empty)

**On Submit:**
- Finds matching user
- Creates auth token
- Saves session
- Shows success toast
- Redirects to home

---

## Validation Helpers

### `validateEmail(email)`
Validates email format using regex.

```javascript
validateEmail("user@example.com");  // true
validateEmail("invalid.email");      // false
validateEmail("user@.com");          // false
```

---

### `validatePassword(password)`
Checks if password meets minimum requirements (8+ chars).

```javascript
validatePassword("password123");     // true
validatePassword("short");           // false
```

---

### `validatePasswordStrength(password)`
Returns strength score (0-5).

```javascript
// Score breakdown:
// 1 point: length >= 8
// 1 point: length >= 12
// 1 point: has uppercase
// 1 point: has number
// 1 point: has special char

validatePasswordStrength("pass");         // 0 (weak)
validatePasswordStrength("password");     // 2 (medium)
validatePasswordStrength("Pass123!word");  // 5 (strong)
```

---

## Error Handling

### Form Error Display
```javascript
// Errors show in red text below input fields
<small id="email-error" class="error-msg"></small>

// Error message displayed on validation failure
showError("email-error", "Please enter a valid email address");

// Errors automatically cleared on new form submission
clearAllErrors();
```

---

## Integration Examples

### Protect Routes
```javascript
import { isUserLoggedIn } from "./auth.js";

// Redirect if not logged in
if (!isUserLoggedIn()) {
  window.location.href = "signin.html";
}
```

### Check User Before Action
```javascript
import { getCurrentUser } from "./auth.js";

function addToCart(productId) {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = "signin.html";
    return;
  }
  
  // Proceed with adding to cart
  // You can also link cart data to user.id
}
```

### Display User-Specific Content
```javascript
import { getCurrentUser } from "./auth.js";

const user = getCurrentUser();
if (user) {
  document.getElementById("user-greeting").textContent = 
    `Welcome back, ${user.name}!`;
}
```

### Link Cart to User
```javascript
import { getCurrentUser } from "./auth.js";

// When saving cart
const user = getCurrentUser();
const cartData = {
  userId: user?.id,
  items: cartItems,
  timestamp: new Date()
};
localStorage.setItem("cart_" + user.id, JSON.stringify(cartData));
```

---

## CSS Classes Reference

| Class | Purpose | Notes |
|-------|---------|-------|
| `.section-auth` | Auth page wrapper | Full-height section |
| `.auth-card` | Form container | Centered card layout |
| `.auth-form` | Form element | Flex column layout |
| `.form-group` | Input wrapper | Groups label + input |
| `.error-msg` | Error text | Red color, hidden by default |
| `.auth-btn` | Submit button | Primary color, hover effect |
| `.social-btn` | Social login button | Outlined style |
| `.user-menu` | User info display | Shows in header |
| `.logout-btn` | Logout button | In user menu |
| `.active-auth` | Active auth link | Highlighted in header |

---

## Event Lifecycle

### Sign Up Flow
```
1. User submits form
   ↓
2. Form validation runs
   ↓
3. Check email uniqueness
   ↓
4. Create user object
   ↓
5. Save to localStorage
   ↓
6. Show success toast
   ↓
7. Redirect to signin
```

### Sign In Flow
```
1. User submits form
   ↓
2. Form validation runs
   ↓
3. Search for matching user
   ↓
4. Generate auth token
   ↓
5. Save token to localStorage
   ↓
6. Update user session
   ↓
7. Show success toast
   ↓
8. Redirect to home
```

### Logout Flow
```
1. User clicks logout
   ↓
2. Clear auth_token
   ↓
3. Clear currentUser
   ↓
4. Show logout toast
   ↓
5. Redirect to home
```

---

## Security Considerations

### Current (Development)
- Base64 password encoding (NOT secure)
- localStorage storage only
- Client-side validation only
- No HTTPS requirement
- No rate limiting
- No session timeout validation

### Production Checklist
- [ ] Move to backend database
- [ ] Implement bcrypt/Argon2 hashing
- [ ] Use HTTPS/TLS only
- [ ] Implement JWT signing
- [ ] Add rate limiting
- [ ] Add session timeout
- [ ] Add email verification
- [ ] Add CSRF protection
- [ ] Implement OAuth2
- [ ] Add 2FA support

---

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ❌ Not supported (ES6 modules)

---

## Performance Notes

- ~2KB gzipped (auth.js)
- ~3KB gzipped (auth styles)
- localStorage limited to 5-10MB per domain
- ~1000 users fit comfortably in localStorage
- For 10,000+ users, use backend database

---

## Troubleshooting API

### Debug Current Session
```javascript
// In browser console
console.log(localStorage.getItem("auth_token"));
console.log(localStorage.getItem("currentUser"));
console.log(localStorage.getItem("ecommerce_users"));
```

### Reset All Data
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Get User by Email
```javascript
import { getAllUsers } from "./auth.js";

const email = "john@example.com";
const user = getAllUsers().find(u => u.email === email);
console.log(user);
```

---

## Support & Examples

For more examples and testing guide, see:
- `AUTH_README.md` - Full documentation
- `AUTH_TEST_GUIDE.md` - Testing procedures
- `signin.html` - Sign in example
- `signup.html` - Sign up example

---

Last Updated: December 1, 2024
