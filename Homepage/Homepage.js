let recognition;
let isRecording = false;
const textArea = document.getElementById("noteText");
const toggleRecordingButton = document.getElementById("toggleRecording");
const saveNoteButton = document.getElementById("saveNote");
const savedNotesContainer = document.getElementById("savedNotes");

let userEmail = localStorage.getItem("userEmail") || null;

const API_URL = "http://localhost:5001";

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
  if (!noteContent || !userEmail) {
    alert("Invalid note or user.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, content: noteContent }),
    });

    const result = await response.json();

    if (response.ok) {
      displayNote(result.note.content);
      textArea.value = ""; // Clear input field
      saveNoteButton.disabled = true;
    } else {
      console.error("Failed to save note:", result.error);
    }
  } catch (error) {
    console.error("Error saving note:", error);
  }
});

textArea.addEventListener("input", () => {
  saveNoteButton.disabled = !textArea.value.trim();
});

const loadNotes = async () => {
  if (!userEmail) {
    console.error("No user email found in local storage.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes/${userEmail}`);
    const notes = await response.json();

    savedNotesContainer.innerHTML = ""; // Clear existing notes before rendering

    notes.forEach((note) => displayNote(note.content));

    console.log("notes -> ", notes);
  } catch (error) {
    console.error("Error loading notes:", error);
  }
};

// Display a note
const displayNote = (content) => {
  // Avoid duplicate notes by checking existing notes
  if (
    [...savedNotesContainer.children].some(
      (note) => note.textContent === content
    )
  ) {
    return; // Skip adding duplicate notes
  }

  const noteDiv = document.createElement("div");
  noteDiv.classList.add("saved-note");
  noteDiv.textContent = content;
  savedNotesContainer.appendChild(noteDiv);
};

document.addEventListener("DOMContentLoaded", loadNotes);
