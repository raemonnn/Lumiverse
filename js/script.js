// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// // Login Form Handling
// document.getElementById("login-form").addEventListener("submit", function(event) {
//     event.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//             const user = userCredential.user;
//             window.location.href = "dashboard.html";
//         })
//         .catch((error) => {
//             alert("Error: " + error.message);
//         });
// });

// // Fetch and Display User Count on Dashboard
// const userChartCtx = document.getElementById('userChart').getContext('2d');
// firebase.firestore().collection('users').get().then((snapshot) => {
//     const userCount = snapshot.size;
    
//     new Chart(userChartCtx, {
//         type: 'bar',
//         data: {
//             labels: ['Users'],
//             datasets: [{
//                 label: 'Total Users',
//                 data: [userCount],
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// });
