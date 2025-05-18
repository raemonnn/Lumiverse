<?php
session_start();
include 'firebase_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        // Sign in using email and password
        $signInResult = $auth->signInWithEmailAndPassword($email, $password);
        $uid = $signInResult->firebaseUserId();

        // Get additional user info from Realtime Database
        $userData = $database->getReference('users/' . $uid)->getValue();

        $_SESSION['username'] = $userData['username'];
        $_SESSION['email'] = $email;

        header('Location: dashboard.php');
        exit;
    } catch (Exception $e) {
        echo "<script>alert('Invalid credentials!'); window.location.href='index.html';</script>";
    }
}
?>
