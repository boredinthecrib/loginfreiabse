import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// Load saved notes
import {
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import { auth } from "./Firebase.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const login = document.getElementById("login");
const authPart = document.getElementById("authPart");

//hiding the top secret part initially
authPart.style.display = "none";

const routeToHomepage = () => {
  window.location.href = "Homepage.html";
};

const routeToSignup = () => {
  window.location.href = "Index.html";
};

//signup
const signUp = async () => {
  const signUpEmail = email.value;
  const signUpPassword = password.value;
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCreditional) => {
      // Signed in
      const user = userCreditional.user;
      console.log(user);

      routeToHomepage();
      console.log("user created successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
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
      routeToHomepage();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
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

      routeToSignup();
    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

signUpBtn.addEventListener("click", signUp);
signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", userSignOut);
