const textarea = document.getElementById("note");
const calcInput = document.getElementById("calc-input");
const calcHistory = document.getElementById("calc-history");

// Load notes on startup
chrome.storage.local.get(["noteText"], (result) => {
  if (result.noteText) {
    textarea.value = result.noteText;
  }
});

// Listen and store notes
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ noteText: textarea.value });
});

// Load calc history
chrome.storage.local.get(["history"], (result) => {
  if (result.history) {
    result.history.forEach((line) => addHistory(line));
  }
});

// Listen and calc values
calcInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const expression = calcInput.value.trim();
    if (expression) {
      try {
        const result = math.evaluate(expression);
        const line = `${expression} = ${result}`;
        addHistory(line);
        saveHistory();
      } catch {
        addHistory(`${expression} = ERROR`);
        saveHistory();
      }
    }
    calcInput.value = "";
  }
});

function addHistory(text) {
  const div = document.createElement("div");
  div.textContent = text;
  calcHistory.appendChild(div);
  calcHistory.scrollTop = calcHistory.scrollHeight;
}

function saveHistory() {
  const lines = Array.from(calcHistory.children).map((div) => div.textContent);
  chrome.storage.local.set({ history: lines });
}
