const textarea = document.getElementById("notes");
const calcInput = document.getElementById("calc-input");

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

// Listen and calc values
calcInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const expression = calcInput.value.trim();
    if (expression) {
      let line;
      try {
        const result = math.evaluate(expression);
        line = `${expression} = ${result}`;
      } catch {
        line = `${expression} = ERROR`;
      }
      textarea.value += (textarea.value ? "\n" : "") + line;
      chrome.storage.local.set({ noteText: textarea.value });
    }
    calcInput.value = "";
  }
});

// Listen clicks on text area, and load values back to calc input
textarea.addEventListener("click", () => {
  const pos = textarea.selectionStart;
  const textBefore = textarea.value.slice(0, pos);
  const linesBefore = textBefore.split("\n");
  const lineIndex = linesBefore.length - 1;
  const lines = textarea.value.split("\n");
  const clickedLine = lines[lineIndex] || "";
  calcInput.value = clickedLine.trim();
  calcInput.select();
});
