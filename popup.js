const textarea = document.getElementById("note")
const calcInput = document.getElementById("calc-input")
const calcHistory = document.getElementById("calc-history")

// Load notes on startup
chrome.storage.local.get(["noteText"], (result) => {
  if (result.noteText) { textarea.value = result.noteText }
})

// Listen and store notes
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ noteText: textarea.value })
})
