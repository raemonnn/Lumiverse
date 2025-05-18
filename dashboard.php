<?php
include 'firebase_config.php';

// $ref = $database->getReference('users');
// $users = $ref->getValue(); // Get all user data

// foreach ($users as $key => $user) {
//     echo "Username: " . $user['username'] . "<br>";
//     echo "Email: " . $user['email'] . "<br>";
// }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Lumiverse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/animate.css/animate.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lexend+Deca:wght@100..900&display=swap" rel="stylesheet">
</head>
<body class="bg-light">

   <!-- Sidebar -->
   <div id="sidebar-wrapper">
    <div class="sidebar-heading">Admin Panel</div>
    <ul class="list-group">
        <a href="#" class="list-group-item" onclick="showSection('dashboardSection')">Dashboard</a>
        <a href="#" class="list-group-item" onclick="showSection('feedbackSection')">User's Feedback</a>
        <a href="#" class="list-group-item" onclick="showSection('commandsSection')">Personalized Voice Commands</a>
        <a href="#" class="list-group-item" onclick="showSection('teamSection')">Team Members</a>
    </ul>
</div>

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand ms-3">Lumiverse</a>
        <div class="d-flex align-items-center">
            <a href="http://voice.ai-thinker.com/#/" class="me-3">Voice SDK List</a>
            <div class="d-flex align-items-center">
                <a href="http://voice.ai-thinker.com/#/" class="me-3">Voice.ai-thinker</a>
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                        <img src="img/profile3.jpg" alt="Profile" class="profileimg">
                        <span class="ms-2">Nezuko</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <!-- Updated Account Settings Link -->
                        <li><a class="dropdown-item" href="account-settings.php">Account Settings</a></li>
                        <li><a href="logout.php">Logout</a></li>
                    </ul>
                </div>                
            </div>
        </div>
    </nav>

<!-- Dashboard Section (Visible by Default) -->
<div id="dashboardSection" class="section">
    <div class="container mt-4 text-center">
        <h1 class="fw-bold display-4">Lumiverse is ready to serve you</h1>
        <div class="row justify-content-center mt-4">
            <div class="col-lg-6">
                <div class="card p-3 shadow-lg">
                    <h5 class="text-center">Total Number of Users:</h5>
                    <canvas id="userChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- User's Feedback Section -->
<div id="feedbackSection" class="section">
    <div class="container mt-4">
        <h3 class="text-center">User's Feedback</h3>
        <div class="feedback-container">
            <!-- Feedback 1 -->
            <div class="feedback">
                <img src="img/profile.jpg" alt="User 1">
                <div class="feedback-content">
                    <div class="feedback-header">
                        <div>
                            <h5>Rossel</h5>
                            <span class="date">March 22, 2025</span>
                        </div>
                        <div class="feedback-actions">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <p>This system is amazing! It makes my tasks so much easier.</p>
                </div>
            </div>

            <!-- Feedback 2 -->
            <div class="feedback">
                <img src="img/profile2.jpg" alt="User 2">
                <div class="feedback-content">
                    <div class="feedback-header">
                        <div>
                            <h5>Doraemon</h5>
                            <span class="date">March 21, 2025</span>
                        </div>
                        <div class="feedback-actions">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <p>I love how simple and user-friendly this is. Great job!</p>
                </div>
            </div>

            <!-- Feedback 3 -->
            <div class="feedback">
                <img src="img/leo.png" alt="User 3">
                <div class="feedback-content">
                    <div class="feedback-header">
                        <div>
                            <h5>Leo Vincent</h5>
                            <span class="date">March 20, 2025</span>
                        </div>
                        <div class="feedback-actions">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <p>It really helps me stay on top of things. Highly recommend!</p>
                </div>
            </div>

            <!-- Feedback 4 -->
            <div class="feedback">
                <img src="img/cassey.png" alt="User 4">
                <div class="feedback-content">
                    <div class="feedback-header">
                        <div>
                            <h5>Cassey</h5>
                            <span class="date">March 19, 2025</span>
                        </div>
                        <div class="feedback-actions">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <p>This app is a game-changer. It saves so much time!</p>
                </div>
            </div>

            <!-- Feedback 5 -->
            <div class="feedback">
                <img src="img/profile4.jpg" alt="User 5">
                <div class="feedback-content">
                    <div class="feedback-header">
                        <div>
                            <h5>Rein Ong</h5>
                            <span class="date">March 18, 2025</span>
                        </div>
                        <div class="feedback-actions">
                            <button class="btn-edit">Edit</button>
                            <button class="btn-delete">Delete</button>
                        </div>
                    </div>
                    <p>Super helpful and easy to use. Love the interface!</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Personalized Voice Commands Section -->
<div id="commandsSection" class="section" style="display: none;">
    <div class="container mt-4">
        <h3 class="text-center">Personalized Voice Commands</h3>
        <p>Manage your voice commands here.</p>
    </div>
</div>

<!-- Team Members Section -->
<div id="teamSection" class="section" style="display: none;">
    <div class="container mt-4">
        <!-- Title Section with smaller text -->
        <h4 class="text-center">Our Development Team</h4>
        <p class="text-center text-muted">Meet the talented individuals behind Lumiverse</p>
        <div class="row justify-content-center">
            <!-- Team Member 1 -->
            <div class="col-md-6 mb-4">
                <div class="card text-center shadow-lg">
                    <img src="img/rein.jpg" class="card-img-top profile-img" alt="Team Member 1">
                    <div class="card-body">
                        <h5 class="card-title">John Mark Lagrosas</h5>
                        <p class="card-text">Programmer</p>
                    </div>
                </div>
            </div>
            <!-- Team Member 2 -->
            <div class="col-md-6 mb-4">
                <div class="card text-center shadow-lg">
                    <img src="img/cassey.png" class="card-img-top profile-img" alt="Team Member 2">
                    <div class="card-body">
                        <h5 class="card-title">Cassey Wynn Daniel Robles</h5>
                        <p class="card-text">Project Manager</p>
                    </div>
                </div>
            </div>
            <!-- Team Member 3 -->
            <div class="col-md-6 mb-4">
                <div class="card text-center shadow-lg">
                    <img src="img/leo.png" class="card-img-top profile-img" alt="Team Member 3">
                    <div class="card-body">
                        <h5 class="card-title">Leo Vincent Santos</h5>
                        <p class="card-text">UX/UI Designer</p>
                    </div>
                </div>
            </div>
            <!-- Team Member 4 -->
            <div class="col-md-6 mb-4">
                <div class="card text-center shadow-lg">
                    <img src="img/profile2.jpg" class="card-img-top profile-img" alt="Team Member 4">
                    <div class="card-body">
                        <h5 class="card-title">Raemon Miguel P. Tablada</h5>
                        <p class="card-text">Database Manager</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCzLXaKutODmg66jsLCNrS6pLOVd44vafU",
      authDomain: "lumiverseweb.firebaseapp.com",
      projectId: "lumiverseweb",
      storageBucket: "lumiverseweb.firebasestorage.app",
      messagingSenderId: "282929070368",
      appId: "1:282929070368:web:fcbd522b369dda38505745",
      measurementId: "G-3P7TZ12S9H"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  </script>

<script>
    // Show the selected section and hide others
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    // Function for delete button confirmation
    function confirmDelete(event) {
        const feedbackElement = event.target.closest('.feedback');
        const isConfirmed = confirm('Are you sure you want to delete this feedback?');

        if (isConfirmed) {
            feedbackElement.remove(); // Remove the feedback from the DOM if confirmed
            alert('Feedback deleted successfully!');
        }
    }

    window.onload = function() {
        // Show the dashboard section by default
        showSection('dashboardSection');

        // Add event listener for delete buttons
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', confirmDelete);
        });
    };
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/chart.min.js"></script>
</body>
</html>
