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
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import { auth, db } from "./Firebase.js";

let recognition;
let isRecording = false;
const textArea = document.getElementById("noteText");
const toggleRecordingButton = document.getElementById("toggleRecording");
const saveNoteButton = document.getElementById("saveNote");
const savedNotesContainer = document.getElementById("savedNotes");

if ("webkitSpeechRecognition" in window) {
  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = function (event) {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");
    textArea.value = transcript;
  };
} else {
  alert("Speech recognition is not supported in this browser.");
}

toggleRecordingButton.addEventListener("click", () => {
  if (isRecording) {
    recognition.stop();
    toggleRecordingButton.textContent = "Start Recording";
    toggleRecordingButton.classList.remove("stop");
    toggleRecordingButton.classList.add("start");
  } else {
    recognition.start();
    toggleRecordingButton.textContent = "Stop Recording";
    toggleRecordingButton.classList.remove("start");
    toggleRecordingButton.classList.add("stop");
  }
  isRecording = !isRecording;
});

saveNoteButton.addEventListener("click", async () => {
  const noteContent = textArea.value.trim();
  if (noteContent) {
    // Create a new div to append the saved note
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("saved-note");
    noteDiv.textContent = noteContent;
    // Append the saved note to the savedNotes container
    savedNotesContainer.appendChild(noteDiv);
    // Clear the textarea and disable the save button
    textArea.value = "";
    saveNoteButton.disabled = true;

    // Save to database;
    const user = auth.currentUser; // Get logged-in user
    if (!user) {
      alert("You must be logged in to save notes.");
      return;
    }

    try {
      await addDoc(collection(db, "notes"), {
        userId: user.uid, // Store note under the user's ID
        content: noteContent,
        timestamp: new Date(),
      });

      textArea.value = ""; // Clear input after saving
      alert("Note saved successfully!");
      saveNoteButton.disabled = true;
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  }

  // Save to database;
});

textArea.addEventListener("input", () => {
  saveNoteButton.disabled = !textArea.value.trim();
});

const loadNotes = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const notesQuery = query(
    collection(db, "notes"),
    where("userId", "==", user.uid)
  );
  const querySnapshot = await getDocs(notesQuery);

  savedNotesContainer.innerHTML = ""; // Clear previous notes

  querySnapshot.forEach((doc) => {
    const note = document.createElement("div");
    note.classList.add("saved-note");
    note.textContent = doc.data().content;
    savedNotesContainer.appendChild(note);
  });
};

// Load notes when user logs in
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadNotes();
  }
});
