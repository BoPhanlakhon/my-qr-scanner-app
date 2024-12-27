window.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".app");
  for (const element of elements) {
    element.innerHTML = `Hello, Electron!`;
  }
});
