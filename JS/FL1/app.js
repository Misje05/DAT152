const message = document.getElementById("message");
const nameInput = document.getElementById("nameInput");
const preview = document.getElementById("preview");
const button = document.getElementById("button");
const headline = document.querySelector("H1");

let toggled = false;

nameInput.addEventListener("input", () => {
  const value = nameInput.value.trim();

  if (value === "") {
    preview.innerHTML = "";
    return;
  }

  preview.innerHTML = `Du skrev: <strong>${value}</strong>`;
});

button.addEventListener("click", () => {
  toggled = !toggled;

  if (toggled) {
    message.textContent = "JavaScript fungerer!";
    headline.textContent = "Hei";
    button.textContent = "Tilbakestill";
    return;
  }

  message.textContent = "Trykk på knappen for å teste JavaScript.";
  headline.textContent = "Basic JavaScript";
  button.textContent = "Klikk meg";
});



