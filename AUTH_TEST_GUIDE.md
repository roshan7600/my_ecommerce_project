# Sign In & Sign Up Testing Guide

## Quick Start

The authentication system is now fully functional! Here's how to test it:

### Server Running At
**http://localhost:5174/**

---

## Test Case 1: Create a New Account (Sign Up)

### Steps:
1. Go to **http://localhost:5174/signup.html**
2. Fill in the form:
   - **Full Name:** John Doe
   - **Email:** john@example.com
   - **Password:** Password123!
   - **Confirm Password:** Password123!
3. Check the **Terms & Conditions** checkbox
4. Click **Create Account**
5. See the success toast notification
6. Should redirect to sign-in page

### Expected Results:
✅ Account created successfully
✅ Redirects to signin.html
✅ User data saved in localStorage

---

## Test Case 2: Sign In with Created Account

### Steps:
1. On signin page (auto-redirected), enter:
   - **Email:** john@example.com
   - **Password:** Password123!
2. Click **Sign In**
3. See success notification
4. Should redirect to index.html
5. Header should show "John Doe" and logout button

### Expected Results:
✅ Successfully signed in
✅ User name appears in header
✅ Logout button available
✅ Redirects to home page

---

## Test Case 3: Remember Me Feature

### Steps:
1. Go to signin.html
2. Enter email and password
3. **Check "Remember me"** checkbox
4. Click Sign In
5. Logout using the logout button
6. Return to signin.html

### Expected Results:
✅ Email field is pre-filled
✅ "Remember me" checkbox is checked
✅ Can quickly sign in again

---

## Test Case 4: Password Strength Indicator

### Steps:
1. Go to signup.html
2. Click on Password field
3. Type different passwords and observe:
   - `123` → Weak (red)
   - `password` → Medium (orange)
   - `Password123!` → Strong (green)

### Expected Results:
✅ Color changes based on password strength
✅ Text updates (Weak/Medium/Strong)
✅ Bar fills progressively

---

## Test Case 5: Validation Errors

### Test 5.1: Invalid Email
- **Email:** invalid.email
- Click Sign In
- Error: "Please enter a valid email address"

### Test 5.2: Short Password
- **Password:** 123
- Error: "Password must be at least 8 characters"

### Test 5.3: Password Mismatch
- **Password:** Password123!
- **Confirm:** Password123@
- Error: "Passwords do not match"

### Test 5.4: Duplicate Email
- Try signing up with: john@example.com (already exists)
- Error: "This email is already registered"

### Expected Results:
✅ All errors display below respective fields
✅ Form prevents submission
✅ Toast notification shows error

---

## Test Case 6: Duplicate Account Prevention

### Steps:
1. Go to signup.html
2. Enter same email as before: john@example.com
3. Fill other fields correctly
4. Click Create Account

### Expected Results:
✅ Error message: "This email is already registered"
❌ Account not created
❌ No redirect

---

## Test Case 7: Session Persistence

### Steps:
1. Sign in to account
2. Go to http://localhost:5174/ (home page)
3. Refresh the page (F5)
4. User info still shows in header
5. Navigate to other pages

### Expected Results:
✅ User stays logged in
✅ User info persists
✅ No need to sign in again

---

## Test Case 8: Logout Functionality

### Steps:
1. Sign in to account
2. Click "Logout" button in header
3. See logout success notification
4. Should redirect to index.html
5. Header shows SIGN IN/SIGN UP again

### Expected Results:
✅ Session cleared
✅ localStorage auth_token removed
✅ Redirects to home page
✅ Anonymous header restored

---

## Test Case 9: Form Navigation

### Steps:
1. On signup.html, click "Sign in here" link
   - Should go to signin.html
2. On signin.html, click "Sign up here" link
   - Should go to signup.html
3. Check header links work from both pages

### Expected Results:
✅ All navigation links work
✅ Active page is highlighted in header
✅ Smooth page transitions

---

## Test Case 10: Social Login Placeholder

### Steps:
1. On any auth page, click "Sign in/up with Google" button

### Expected Results:
✅ Toast notification: "Google authentication coming soon!"
❌ Does not process (placeholder for future integration)

---

## localStorage Inspection

### To View Stored Data:

**In Browser DevTools:**
1. Press F12 to open DevTools
2. Go to **Application** tab
3. Click **LocalStorage**
4. Select http://localhost:5174/

### You'll see:
```
ecommerce_users          → Array of registered users
auth_token              → Current session token
currentUser             → Logged-in user info
remember_email          → Saved email (if Remember Me checked)
```

---

## Testing Multiple Accounts

### Create Test Accounts:
1. **Account 1:**
   - Name: John Doe
   - Email: john@example.com
   - Password: Secure@123

2. **Account 2:**
   - Name: Jane Smith
   - Email: jane@example.com
   - Password: MyPassword456!

3. **Account 3:**
   - Name: Bob Wilson
   - Email: bob@example.com
   - Password: BobSecure789$

### Test Switching Between Accounts:
1. Sign in with Account 1
2. Logout
3. Sign in with Account 2
4. Check that correct user info displays
5. Logout and repeat with Account 3

---

## API Reference (For Integration)

### Import Functions:
```javascript
import {
  getCurrentUser,
  isUserLoggedIn,
  logout,
  getAllUsers
} from "./auth.js";
```

### Get Current User:
```javascript
const user = getCurrentUser();
// Returns: { id, name, email }
```

### Check Login Status:
```javascript
if (isUserLoggedIn()) {
  console.log("User is logged in");
}
```

### Get All Users (Admin):
```javascript
const allUsers = getAllUsers();
console.log(allUsers);
```

---

## Known Limitations

⚠️ **These are development/demo features:**

1. **Passwords stored in Base64** (not secure)
   - Use bcrypt in production
2. **localStorage only** (not persistent across devices)
   - Use backend database in production
3. **No email verification**
   - Add verification in production
4. **No forgot password** functionality
   - Implement password reset in production
5. **Google OAuth not integrated**
   - Connect to Google API in production
6. **No rate limiting**
   - Add in production for security

---

## Troubleshooting

### Issue: Can't sign up
**Solution:** Check browser console (F12) for errors

### Issue: Sign in not working
**Solution:**
1. Clear localStorage (DevTools → Application → Clear storage)
2. Create a new account
3. Sign in with new account

### Issue: User persists after logout
**Solution:** Clear cache and refresh

### Issue: Toast notifications not showing
**Solution:** Verify showToast.js is working (test by adding to cart)

---

## Next Steps (Future Enhancements)

- [ ] Email verification
- [ ] Password reset/recovery
- [ ] Google OAuth integration
- [ ] User profile page
- [ ] Account settings
- [ ] Change password
- [ ] Two-factor authentication
- [ ] Social media links
- [ ] Admin dashboard
- [ ] Backend integration

---

## Files Modified/Created

✅ **Created:**
- `signin.html` - Sign in page
- `signup.html` - Sign up page
- `auth.js` - Authentication logic
- `AUTH_README.md` - Full documentation
- `AUTH_TEST_GUIDE.md` - This file

✅ **Modified:**
- `index.html` - Updated auth links
- `main.js` - Added auth imports
- `style.css` - Added auth styles

---

## Questions?

Check `AUTH_README.md` for detailed technical documentation!
