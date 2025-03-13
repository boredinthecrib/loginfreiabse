import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlZYl5QR9-B2NA-KBG9wjAj12TbxaNdYQ",
  authDomain: "logindemo-7f901.firebaseapp.com",
  projectId: "logindemo-7f901",
  storageBucket: "logindemo-7f901.firebasestorage.app",
  messagingSenderId: "705051436506",
  appId: "1:705051436506:web:545f430fa5d1671ddd8ce3",
  measurementId: "G-GEVTCPVTYZ",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const login = document.getElementById("login");
const authPart = document.getElementById("authPart");

//hiding the top secret part initially
authPart.style.display = "none";

//signup
const signUp = async () => {
  const signUpEmail = email.value;
  const signUpPassword = password.value;
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCreditional) => {
      // Signed in
      const user = userCreditional.user;
      console.log(user);
      alert("user created successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
};

//signin
const signIn = async () => {
  const signInEmail = email.value;
  const signInPassword = password.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      alert("user signed in successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
};
//check auth state
const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      login.style.display = "none";
      authPart.style.display = "flex";
      console.log("user is signed in");
    } else {
      login.style.display = "block";
      authPart.style.display = "none";
      console.log("user is signed out");
    }
  });
};
checkAuthState();
//signout
const userSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
      alert("user signed out successfully");
    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
};

signUpBtn.addEventListener("click", signUp);
signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", userSignOut);
