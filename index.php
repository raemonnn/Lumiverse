<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Lumiverse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/animate.css/animate.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lexend+Deca:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light-gray">

    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card p-5 shadow-lg rounded">
            <h1 class="text-center fw-bold">Lumiverse</h1>
            <h5 class="text-center text-muted">Welcome Back! Master :)</h5>
    
            <form id="loginForm" class="mt-4" method="POST" action="login.php">
    <div class="form-group">
        <div class="floating-label">
            <input type="text" name="email" id="username" class="form-control" required>
            <label for="username">Username or Email</label>
        </div>
    </div>

    <div class="form-group mt-3 position-relative">
    <div class="floating-label">
        <input type="password" name="password" id="password" class="form-control pe-5" required>
        <label for="password">Password</label>
        <span class="position-absolute top-50 end-0 translate-middle-y me-3" onclick="togglePassword()" style="cursor: pointer;">
            <i class="fas fa-eye" id="toggleIcon"></i>
        </span>
    </div>
</div>

    
                <div class="d-flex justify-content-between mt-3">
                <a href="#" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">Forgot Password?</a>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign Up</a>
                </div>
    
                <button type="submit" class="btn btn-dark w-100 mt-4">Login</button>
            </form>
        </div>
    </div>

    <!-- Sign Up Modal -->

                    <div class="modal fade" id="signUpModal" tabindex="-1" aria-labelledby="signUpModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <form id="signUpForm" action="signup.php" method="POST">
                            <div class="modal-header">
                            <h5 class="modal-title" id="signUpModalLabel">Sign Up</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" name="username" class="form-control" id="signupUsername" placeholder="Username" required>
                                <label for="signupUsername">Username</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email" name="email" class="form-control" id="signupEmail" placeholder="Email" required>
                                <label for="signupEmail">Email</label>
                            </div>
                            <div class="form-group mt-3 position-relative">
                            <div class="floating-label">
                                <input type="password" name="password" id="password" class="form-control pe-5" required>
                                <label for="password">Password</label>
                                <span class="position-absolute top-50 end-0 translate-middle-y me-3" style="cursor:pointer;" onclick="togglePassword()">
                                    👁️
                                </span>
                            </div>
                        </div>
                            <div class="form-floating mb-3">
                                <input type="password" name="confirm_password" class="form-control" id="signupConfirmPassword" placeholder="Confirm Password" required>
                                <label for="signupConfirmPassword">Confirm Password</label>
                            </div>
                            </div>
                            <div class="modal-footer">
                            <button type="submit" class="btn btn-dark w-100">Sign Up</button>
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

                    <!-- Forgot Password Modal -->
                <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <form id="forgotPasswordForm">
                        <div class="modal-header">
                        <h5 class="modal-title" id="forgotPasswordModalLabel">Reset Password</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="resetEmail" placeholder="Enter your email" required>
                            <label for="resetEmail">Enter your email</label>
                        </div>
                        </div>
                        <div class="modal-footer">
                        <button type="submit" class="btn btn-dark w-100">Send Reset Link</button>
                        </div>
                    </form>
                    </div>
                </div>
                </div>


                        <script type="module">
                        // Import Firebase SDK functions
                        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
                        import {
                            getAuth,
                            signInWithEmailAndPassword,
                            createUserWithEmailAndPassword,
                            sendEmailVerification,
                            sendPasswordResetEmail,
                            signOut
                        } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

                        // Your Firebase configuration
                        const firebaseConfig = {
                            apiKey: "AIzaSyACjiveSiqtCixwlRllx1jdRpHdZiXLuXE",
                            authDomain: "lumiverse-6083d.firebaseapp.com",
                            databaseURL: "https://lumiverse-6083d-default-rtdb.asia-southeast1.firebasedatabase.app",
                            projectId: "lumiverse-6083d",
                            storageBucket: "lumiverse-6083d.firebasestorage.app",
                            messagingSenderId: "1085951693240",
                            appId: "1:1085951693240:web:4e07da0739c8e829b97f4d",
                            measurementId: "G-N1G7ZNEDGK"
                        };

                        // Initialize Firebase
                        const app = initializeApp(firebaseConfig);
                        const auth = getAuth(app);

                        // Handle Login
                        const loginForm = document.getElementById('loginForm');
                        loginForm.addEventListener('submit', function (e) {
                            e.preventDefault();

                            const email = loginForm.email.value;
                            const password = loginForm.password.value;

                            signInWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                if (user.emailVerified) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Login Successful',
                                    showConfirmButton: false,
                                    timer: 1500
                                }).then(() => {
                                    window.location.href = "dashboard.php";
                                });
                                } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Email Not Verified',
                                    text: 'Please verify your email before logging in.'
                                });
                                signOut(auth);
                                }
                            })
                            .catch((error) => {
                                Swal.fire({
                                icon: 'error',
                                title: 'Login Failed',
                                text: error.message
                                });
                            });
                        });

                        // Handle Forgot Password
                        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
                        forgotPasswordForm.addEventListener('submit', function (e) {
                            e.preventDefault();

                            const email = document.getElementById('resetEmail').value;

                            sendPasswordResetEmail(auth, email)
                            .then(() => {
                                Swal.fire({
                                icon: 'success',
                                title: 'Reset Link Sent!',
                                text: 'Check your email to reset your password.',
                                });
                            })
                            .catch((error) => {
                                Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.message,
                                });
                            });
                        });

                        // ✅ Handle Sign-Up with Verification
                        const signUpForm = document.getElementById('signUpForm'); // Make sure your signup form has this ID
                        signUpForm.addEventListener('submit', function (e) {
                            e.preventDefault();

                            const email = signUpForm.email.value;
                            const password = signUpForm.password.value;

                            createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                sendEmailVerification(user)
                                .then(() => {
                                    Swal.fire({
                                    icon: 'success',
                                    title: 'Verification Email Sent',
                                    text: 'Please check your email to verify your account.'
                                    });
                                    signOut(auth); // logout immediately
                                });
                            })
                            .catch((error) => {
                                Swal.fire({
                                icon: 'error',
                                title: 'Sign Up Failed',
                                text: error.message
                                });
                            });
                        });

                        </script>

                    <script>
                    function togglePassword() {
                        const passwordInput = document.getElementById("password");
                        const toggleIcon = document.getElementById("toggleIcon");
                        if (passwordInput.type === "password") {
                        passwordInput.type = "text";
                        toggleIcon.classList.remove("fa-eye");
                        toggleIcon.classList.add("fa-eye-slash");
                        } else {
                        passwordInput.type = "password";
                        toggleIcon.classList.remove("fa-eye-slash");
                        toggleIcon.classList.add("fa-eye");
                        }
                    }
                    </script>


                        


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- <script src="js/index.js"></script> Link to the new JS file -->

</body>
</html>
