const countElement = document.getElementById("count");
const incrementButton = document.getElementById("incrementBtn");
const nameInput = document.getElementById("nameInput");
const greetingElement = document.getElementById("greeting");

let count = 0;

incrementButton.addEventListener("click", () => {
  count += 1;
  countElement.textContent = count;
});

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();

  if (name === "") {
    greetingElement.textContent = "Skriv noe i feltet over.";
    return;
  }

  greetingElement.textContent = `Hei, ${name}! Dette fungerer.`;
});
