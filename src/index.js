import "./gameHandler";
import "./renderGame";

function dragstart_handler(e) {
  // Add the target element's id to the data transfer object
  e.dataTransfer.setData("text/plain", e.target.src);
  console.log(e.target.src);
}

function allowDrag(e) {
  e.preventDefault();
}

function dragdrop_handler(e) {
  e.preventDefault();
  console.log(`drop here`);
  console.log(e.target.dataset.indexNumber);
  const data = e.dataTransfer.getData("text/plain", e.target.src);
  console.log(data);
}

window.addEventListener("DOMContentLoaded", () => {
  // Get the element by id
  const element = document.querySelectorAll("img");
  // Add the ondragstart event listener
  element.forEach((img) => {
    img.addEventListener("dragstart", dragstart_handler);
  });
});

const playerBoard = document.querySelector(`#player-board`);
playerBoard.addEventListener("dragover", allowDrag);
playerBoard.addEventListener("drop", dragdrop_handler);
