<?php
session_start();
include 'firebase_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirm_password'];
    $username = $_POST['username'];

    if ($password !== $confirmPassword) {
        echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
        exit;
    }

    try {
        // Create user with Firebase Authentication
        $userProperties = [
            'email' => $email,
            'password' => $password,
        ];

        $createdUser = $auth->createUser($userProperties);

        // Save additional info to Realtime Database
        $database->getReference('users/' . $createdUser->uid)->set([
            'username' => $username,
            'email' => $email
        ]);

        echo "<script>alert('Signup successful!'); window.location.href='index.html';</script>";
    } catch (Exception $e) {
        echo "<script>alert('Error: " . $e->getMessage() . "'); window.history.back();</script>";
    }
}


        if ($_POST['password'] !== $_POST['confirm_password']) {
            echo "<script>alert('Passwords do not match!'); window.history.back();</script>";
            exit;
        }

?>
