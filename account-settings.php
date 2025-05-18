<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Settings - Lumiverse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/animate.css/animate.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> <!-- SweetAlert2 Library -->
</head>
<body class="bg-light-gray">

    <!-- Account Settings Page Content -->
    <div class="container mt-5">
        <h1 class="text-center fw-bold">Account Settings</h1>

        <!-- Profile Picture Upload Section -->
        <div class="d-flex justify-content-center mt-4">
            <img id="profilePreview" src="img/profile3.jpg" alt="Profile Picture" class="img-thumbnail" style="width: 150px; height: 150px;">
        </div>
        <div class="form-group mt-3 text-center">
            <label for="profilePicture" class="btn btn-secondary">Change Profile Picture</label>
            <input type="file" id="profilePicture" class="form-control d-none" accept="image/*" onchange="previewImage(event)">
        </div>

        <!-- Account Information Form -->
        <form id="accountSettingsForm" class="mt-5">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" class="form-control" value="Nezuko" required>
            </div>

            <div class="form-group mt-3">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" value="nezuko@example.com" required>
            </div>

            <div class="form-group mt-3">
                <label for="password">New Password</label>
                <input type="password" id="password" class="form-control" placeholder="Enter new password">
            </div>

            <div class="form-group mt-3">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm new password">
            </div>

            <button type="submit" class="btn btn-dark w-100 mt-4">Save Changes</button>
        </form>

        <!-- Back Button -->
        <div class="mt-4">
            <button class="btn btn-outline-secondary" onclick="confirmExit()">Back to Dashboard</button>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/account-settings.js"></script> <!-- External JS for Account Settings -->

    <script>
        // Function to preview the image before upload
        function previewImage(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function() {
                const preview = document.getElementById('profilePreview');
                preview.src = reader.result;
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        // Confirmation popup before navigating away
        function confirmExit() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to exit without saving changes?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'dashboard.php';  // Redirect to dashboard
                }
            });
        }
    </script>

</body>
</html>
