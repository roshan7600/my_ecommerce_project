import { showToast } from "./showToast.js";

// ==================== USER STORAGE ====================
const USER_DB_KEY = "ecommerce_users";
const AUTH_TOKEN_KEY = "auth_token";

// Initialize users database if not exists
const initializeUserDB = () => {
  if (!localStorage.getItem(USER_DB_KEY)) {
    localStorage.setItem(USER_DB_KEY, JSON.stringify([]));
  }
};

// Get all users
const getAllUsers = () => {
  return JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
};

// Save users
const saveUsers = (users) => {
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
};

// ==================== VALIDATION FUNCTIONS ====================

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

// ==================== SIGN UP LOGIC ====================

const handleSignUp = async (e) => {
  e.preventDefault();
  clearAllErrors();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm").value;
  const termsAccepted = document.getElementById("terms").checked;

  let hasError = false;

  // Validation
  if (!name) {
    showError("name-error", "Please enter your full name");
    hasError = true;
  }

  if (!validateEmail(email)) {
    showError("signup-email-error", "Please enter a valid email address");
    hasError = true;
  }

  if (!validatePassword(password)) {
    showError("signup-password-error", "Password must be at least 8 characters");
    hasError = true;
  }

  if (password !== confirmPassword) {
    showError("confirm-error", "Passwords do not match");
    hasError = true;
  }

  if (!termsAccepted) {
    showError("terms-error", "Please accept the terms and conditions");
    hasError = true;
  }

  if (hasError) return;

  // Check if user already exists
  const users = getAllUsers();
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    showError("signup-email-error", "This email is already registered");
    showToast("Email already registered!", "error");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: btoa(password), // Simple encoding (use proper hashing in production)
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Show success message and redirect
  showToast("Account created successfully!", "success");
  document.getElementById("signUpForm").reset();

  setTimeout(() => {
    window.location.href = "signin.html";
  }, 2000);
};

// ==================== SIGN IN LOGIC ====================

const handleSignIn = async (e) => {
  e.preventDefault();
  clearAllErrors();

  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  let hasError = false;

  // Validation
  if (!validateEmail(email)) {
    showError("email-error", "Please enter a valid email address");
    hasError = true;
  }

  if (!password) {
    showError("password-error", "Please enter your password");
    hasError = true;
  }

  if (hasError) return;

  // Find user
  const users = getAllUsers();
  const user = users.find(
    (u) => u.email === email && u.password === btoa(password)
  );

  if (!user) {
    showError("password-error", "Invalid email or password");
    showToast("Invalid credentials!", "error");
    return;
  }

  // Create authentication token
  const token = generateAuthToken(user);
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));

  if (rememberMe) {
    localStorage.setItem("remember_email", email);
  } else {
    localStorage.removeItem("remember_email");
  }

  // Store current user info
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  );

  showToast("Sign in successful!", "success");
  document.getElementById("signInForm").reset();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
};

// ==================== AUTHENTICATION HELPERS ====================

const generateAuthToken = (user) => {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };
};

const getCurrentUser = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (e) {
      console.error("Failed to parse current user:", e);
      return null;
    }
  }
  return null;
};

const isUserLoggedIn = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;

  try {
    const parsedToken = JSON.parse(token);
    const expiresAt = new Date(parsedToken.expiresAt);
    return expiresAt > new Date();
  } catch (e) {
    return false;
  }
};

const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("currentUser");
  localStorage.removeItem("remember_email");
  showToast("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
};

// ==================== UI HELPERS ====================

const showError = (elementId, message) => {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
};

const clearAllErrors = () => {
  const errorElements = document.querySelectorAll(".error-msg");
  errorElements.forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });
};

// ==================== PASSWORD STRENGTH INDICATOR ====================

const setupPasswordStrengthIndicator = () => {
  const passwordInput = document.getElementById("signup-password");
  if (!passwordInput) return;

  passwordInput.addEventListener("input", () => {
    const strength = validatePasswordStrength(passwordInput.value);
    const strengthBar = document.querySelector(".strength-bar");
    const strengthText = document.querySelector(".strength-text");

    if (!strengthBar || !strengthText) return;

    const strengthPercentage = (strength / 5) * 100;
    strengthBar.style.width = strengthPercentage + "%";

    if (strength < 2) {
      strengthBar.style.backgroundColor = "#e74c3c";
      strengthText.textContent = "Weak password";
    } else if (strength < 4) {
      strengthBar.style.backgroundColor = "#f39c12";
      strengthText.textContent = "Medium password";
    } else {
      strengthBar.style.backgroundColor = "#27ae60";
      strengthText.textContent = "Strong password";
    }
  });
};

// ==================== INITIALIZE ====================

const initializeAuth = () => {
  initializeUserDB();

  // Setup Sign Up form
  const signUpForm = document.getElementById("signUpForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", handleSignUp);
    setupPasswordStrengthIndicator();
  }

  // Setup Sign In form
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    signInForm.addEventListener("submit", handleSignIn);

    // Populate remembered email
    const rememberEmail = localStorage.getItem("remember_email");
    if (rememberEmail) {
      document.getElementById("signin-email").value = rememberEmail;
      document.getElementById("remember-me").checked = true;
    }
  }

  // Setup Social buttons (placeholder)
  const googleBtns = document.querySelectorAll(".google-btn");
  googleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Google authentication coming soon!", "info");
    });
  });
};

// ==================== UPDATE HEADER WITH USER INFO ====================

const updateHeaderWithUserInfo = () => {
  const currentUser = getCurrentUser();
  const singInUpDiv = document.querySelector(".sing_in_up");

  if (singInUpDiv && currentUser) {
    singInUpDiv.innerHTML = `
      <div class="user-menu">
        <span class="user-name">${currentUser.name}</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    `;
  } else if (singInUpDiv && !currentUser) {
    singInUpDiv.innerHTML = `
      <a href="signin.html">SIGN IN</a>
      <a href="signup.html">SIGN UP</a>
    `;
  }
};

// ==================== EXPORT FUNCTIONS ====================

export {
  getCurrentUser,
  isUserLoggedIn,
  logout,
  initializeAuth,
  updateHeaderWithUserInfo,
  getAllUsers,
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth();
  updateHeaderWithUserInfo();
});
