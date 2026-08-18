
const push = document.getElementById("push");
const input = document.getElementById("input");

const pop = document.getElementById("pop");
const span = document.getElementById("span");

const stack = [];



push.addEventListener("click", () => {

  if (input.value.trim() === "") {
    alert("Input feltet trenger en verdi før du legger den til i stacken.");
    return;
  };

  stack.push(input.value.trim());
  input.value = "";
});

pop.addEventListener("click", () => {
  const value = stack.pop();
  span.textContent = value === undefined ? alert("stacken er tom") : value;
});
