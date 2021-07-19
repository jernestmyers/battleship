import "./gameHandler";
import "./renderGame";

// function dragstart_handler(e) {
//   // Add the target element's id to the data transfer object
//   e.dataTransfer.setData("text/plain", e.target.src);
//   console.log(e.target.src);
// }

// function allowDrag(e) {
//   e.preventDefault();
// }

// function dragdrop_handler(e) {
//   e.preventDefault();
//   console.log(`drop here`);
//   console.log(e.target.dataset.indexNumber);
//   const data = e.dataTransfer.getData("text/plain", e.target.src);
//   console.log(data);
// }

// window.addEventListener("DOMContentLoaded", () => {
//   // Get the element by id
//   const element = document.querySelectorAll("img");
//   // Add the ondragstart event listener
//   element.forEach((img) => {
//     img.addEventListener("dragstart", dragstart_handler);
//   });
// });

const cpuBoard = document.querySelector(`#cpu-board`);
// cpuBoard.addEventListener("dragover", allowDrag);
// cpuBoard.addEventListener("drop", dragdrop_handler);

const carrier = document.querySelector(`#player-carrier`);
const carrierContainer = document.querySelector(`#carrier-container`);
console.log(carrierContainer.getBoundingClientRect());
console.log(carrier.getBoundingClientRect());
const carrierContainerPosition = carrierContainer.getBoundingClientRect();
const carrierPosition = carrier.getBoundingClientRect();
// console.log(carrierContainer.offsetWidth);
// console.log(carrierContainer.offsetHeight);
// console.log(carrier.offsetWidth);
// console.log(carrier.offsetHeight);

carrier.onmousedown = function (event) {
  // (1) prepare to moving: make absolute and on top by z-index
  carrier.style.position = "absolute";
  carrier.style.zIndex = 1000;

  // move it out of any current parents directly into body
  // to make it positioned relative to the body
  carrierContainer.append(carrier);

  // centers the carrier at (pageX, pageY) coordinates
  function moveAt(pageX, pageY) {
    carrier.style.left =
      pageX - (carrierContainer.getBoundingClientRect().x + 17.5) + "px";
    carrier.style.top =
      pageY - (carrierContainer.getBoundingClientRect().y + 17.5) + "px";
    // carrier.style.left = pageX - (carrierContainerPosition.x + 17.5) + "px";
    // carrier.style.top = pageY - (carrierContainerPosition.y + 17.5) + "px";
  }

  // move our absolutely positioned carrier under the pointer
  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    console.log([event.pageX, event.pageY]);
  }

  // (2) move the carrier on mousemove
  document.addEventListener("mousemove", onMouseMove);
  // document.addEventListener("mousemove", onMouseMove);

  // (3) drop the carrier, remove unneeded handlers
  carrier.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    // document.removeEventListener("mousemove", onMouseMove);
    carrier.onmouseup = null;
  };
};

carrier.ondragstart = function () {
  return false;
};
