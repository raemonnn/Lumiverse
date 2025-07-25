

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyBvh8K80mOALcqBI9YlBGqkuJZcrzP834I",
  authDomain: "lumiweb-394ab.firebaseapp.com",
  databaseURL: "https://lumiweb-394ab-default-rtdb.firebaseio.com",
  projectId: "lumiweb-394ab",
  storageBucket: "lumiweb-394ab.firebasestorage.app",
  messagingSenderId: "366924325649",
  appId: "1:366924325649:web:de05f0fa3c2878478362b0",
  measurementId: "G-XMXPS6CMV0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordLink = document.getElementById('forgotPassword');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const passwordStrength = document.querySelector('.password-strength .progress-bar');
const passwordRequirements = document.querySelector('.password-requirements');
const verificationAlert = document.getElementById('verificationAlert');
const resendVerificationBtn = document.getElementById('resendVerificationBtn');

// Password Strength Checker
passwordInputs.forEach(input => {
    input.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[a-zA-Z]/.test(password)) strength += 25;
        
        passwordStrength.style.width = strength + '%';
        
        if (strength < 50) {
            passwordStrength.classList.remove('bg-warning', 'bg-success');
            passwordStrength.classList.add('bg-danger');
        } else if (strength < 75) {
            passwordStrength.classList.remove('bg-danger', 'bg-success');
            passwordStrength.classList.add('bg-warning');
        } else {
            passwordStrength.classList.remove('bg-danger', 'bg-warning');
            passwordStrength.classList.add('bg-success');
        }
        
        if (password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password)) {
            passwordRequirements.style.color = 'green';
        } else {
            passwordRequirements.style.color = 'var(--gray)';
        }
    });
});

// Confirm Password Match
const confirmPassword = document.getElementById('signupConfirmPassword');
if (confirmPassword) {
    confirmPassword.addEventListener('input', function() {
        const password = document.getElementById('signupPassword').value;
        const passwordMatchError = document.getElementById('passwordMatchError');
        
        if (this.value !== password) {
            passwordMatchError.style.display = 'block';
        } else {
            passwordMatchError.style.display = 'none';
        }
    });
}

// Signup Form Submission
// Enhanced Signup Form Submission
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters', 'danger');
            return;
        }

        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
        submitBtn.disabled = true;

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. Update profile (displayName)
            await user.updateProfile({
                displayName: name,
                photoURL: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // default avatar
            });

            // 3. Save user data to Realtime Database
            const userData = {
                name: name,
                email: email,
                role: 'head',
                avatar: 'avatar1',
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                emailVerified: false,
                lastLogin: null,
                status: 'active'
            };

            // Use transaction to ensure atomic write
            await database.ref('users/' + user.uid).set(userData);

            // 4. Send verification email
            await user.sendEmailVerification();
            
            // Store verification timestamp
            await database.ref('users/' + user.uid + '/verificationSentAt')
                .set(firebase.database.ServerValue.TIMESTAMP);

            // 5. Show success message
            showAlert('✅ Account created successfully! Please check your email for verification instructions.', 'success');

            // 6. Clear form
            signupForm.reset();

            // 7. Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'login.html?email=' + encodeURIComponent(email);
            }, 3000);

        } catch (error) {
            console.error("Signup error:", error);
            
            // User-friendly error messages
            let errorMessage = "An error occurred. Please try again.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters with both letters and numbers.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled.';
            }
            
            showAlert(errorMessage, 'danger');
            
            // If user was created but DB write failed, delete the user
            if (auth.currentUser) {
                try {
                    await auth.currentUser.delete();
                } catch (deleteError) {
                    console.error("Error cleaning up user:", deleteError);
                }
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Login Form Submission
// Updated Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
        submitBtn.disabled = true;
        
        try {
            // 1. Sign in user
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // 2. Force refresh of user data (critical for verification status)
            await user.reload();
            
            // 3. Check verification status
            if (!user.emailVerified) {
                await auth.signOut();
                throw {
                    code: 'auth/email-not-verified',
                    message: 'Please verify your email first. Check your inbox or spam folder.'
                };
            }
            
            // 4. Check/update user data in database
            const userRef = database.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            
            if (!snapshot.exists()) {
                // Create user data if missing (shouldn't happen but safety net)
                await userRef.set({
                    name: user.displayName || email.split('@')[0],
                    email: user.email,
                    role: 'head',
                    avatar: 'avatar1',
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                    emailVerified: true,
                    lastLogin: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                // Update last login and verification status
                await userRef.update({
                    lastLogin: firebase.database.ServerValue.TIMESTAMP,
                    emailVerified: true
                });
            }
            
            // 5. Successful login - redirect
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error("Login error:", error);
            handleAuthError(error);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Forgot Password Link
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        if (email) {
            try {
                await auth.sendPasswordResetEmail(email);
                showAlert('Password reset email sent! Please check your inbox.', 'success');
            } catch (error) {
                console.error("Password reset error:", error);
                handleAuthError(error);
            }
        }
    });
}

// Resend Verification Email
if (resendVerificationBtn) {
    resendVerificationBtn.addEventListener('click', async function() {
        const user = auth.currentUser;
        if (!user) return;
        
        try {
            await user.sendEmailVerification();
            localStorage.setItem('lastVerificationEmail', Date.now());
            showAlert('Verification email resent! Please check your inbox.', 'success');
        } catch (error) {
            console.error("Resend verification error:", error);
            handleAuthError(error);
        }
    });
}

// Check auth state on dashboard pages
if (window.location.pathname.includes('dashboard.html')) {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        try {
            await user.reload();
            
            if (!user.emailVerified) {
                // Show verification alert
                if (verificationAlert) {
                    verificationAlert.style.display = 'block';
                }
                
                // Check if we recently sent verification
                const lastSent = localStorage.getItem('lastVerificationEmail');
                if (!lastSent || Date.now() - lastSent > 300000) { // 5 minutes
                    await user.sendEmailVerification();
                    localStorage.setItem('lastVerificationEmail', Date.now());
                }
                
                throw {
                    code: 'auth/email-not-verified',
                    message: 'Please verify your email to access the dashboard.'
                };
            }
            
            // Hide verification alert if shown
            if (verificationAlert) {
                verificationAlert.style.display = 'none';
            }
            
        } catch (error) {
            console.error("Auth state error:", error);
            if (error.code === 'auth/email-not-verified') {
                showAlert(error.message, 'warning');
            } else {
                showAlert('Authentication error. Please login again.', 'danger');
            }
            await auth.signOut();
            window.location.href = 'index.html';
        }
    });
}

// Helper Functions

function handleAuthError(error) {
    let errorMessage = error.message;
    
    // User-friendly error messages
    switch(error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please login instead.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
        case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters with both letters and numbers.';
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Account temporarily locked. Try again later or reset your password.';
            break;
        case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
        case 'auth/email-not-verified':
            // Message already user-friendly
            break;
        case 'auth/user-data-missing':
            // Message already user-friendly
            break;
        default:
            errorMessage = 'An error occurred. Please try again.';
    }
    
    showAlert(errorMessage, 'danger');
}

function showAlert(message, type) {
    // Remove any existing alerts first
    const existingAlert = document.getElementById('authAlert');
    if (existingAlert) existingAlert.remove();

    // Create new alert
    const alertElement = document.createElement('div');
    alertElement.id = 'authAlert';
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Prepend to the form (or body if no form)
    const form = document.querySelector('form') || document.body;
    form.prepend(alertElement);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000);
}
// Make auth available globally
window.auth = auth;
window.database = database;
