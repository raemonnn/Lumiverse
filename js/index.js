import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9wYPKT2EWNlSiWWuAXYs3-GJLDw_ofUk",
  authDomain: "lumiverse-2dc12.firebaseapp.com",
  databaseURL: "https://lumiverse-2dc12-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lumiverse-2dc12",
  storageBucket: "lumiverse-2dc12.appspot.com",
  messagingSenderId: "450582016294",
  appId: "1:450582016294:web:52d6c8c533ce06b23191e7",
  measurementId: "G-GRD4XSE1VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// Admin Sign Up function with profile picture upload
document.getElementById("signUpForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("signUpUsername").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const profilePictureInput = document.getElementById("profilePicture");
  
  if (password !== confirmPassword) {
    Swal.fire("Oops", "Passwords do not match", "warning");
    return;
  }

  const file = profilePictureInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const base64Image = reader.result; // this is the Base64 string

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return set(ref(db, 'users/' + user.uid), {
          name: username,
          email: email,
          role: "admin", // since you're adding admins first
          profilePicture: base64Image // storing base64 string
        });
      })
      .then(() => {
        Swal.fire("Success", "Admin account created!", "success");
        document.getElementById("signUpForm").reset();
        document.getElementById("imagePreview").style.display = "none";
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  if (file) {
    reader.readAsDataURL(file); // start reading and call .onload
  } else {
    // No image selected
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return set(ref(db, 'users/' + user.uid), {
          name: username,
          email: email,
          role: "admin",
          profilePicture: null
        });
      })
      .then(() => {
        Swal.fire("Success", "Admin account created!", "success");
        document.getElementById("signUpForm").reset();
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  }
});


