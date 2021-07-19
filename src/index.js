import "./gameHandler";
import { renderPlayerShips } from "./renderGame";

// // ********* ----- HARD CODING THE CARRIER FOR NOW ******* !!!!!!!!!!!$$$$$$$$$$$$$$ --------

// const playerFleet = [];

// const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
// const placeShipsContainer = document.querySelector(`#place-ships-container`);
// const rotateBtn = document.querySelector(`#btn-rotate-ship`);
// const shipImgs = document.querySelectorAll(`.ships-to-place`);

// // hides all but the carrier on page load
// shipImgs.forEach((ship, index) => {
//   if (index !== 0) {
//     ship.classList.add(`hide-ship`);
//   }
// });

// rotateBtn.addEventListener(`click`, rotateShip);

// function rotateShip(e) {
//   shipImgs.forEach((image) => {
//     if (!image.style.rotate) {
//       image.style.rotate = `-90deg`;
//       image.style.top = 30 + ((5 - 1) / 2) * 35 + `px`;
//     } else {
//       image.style.rotate = ``;
//       image.style.top = 30 + `px`;
//     }
//   });
// }

// const carrier = document.querySelector(`#player-carrier`);
// const carrierContainer = document.querySelector(`#carrier-container`);
// console.log(carrierContainer.getBoundingClientRect());
// console.log(carrier.getBoundingClientRect());

// carrier.onmousedown = function (event) {
//   rotateBtn.style.display = `none`;
//   // (1) prepare to move element: make absolute and on top by z-index
//   carrier.style.position = "absolute";
//   carrier.style.zIndex = 1000;

//   // move it out of any current parents directly into cpuBoard
//   carrierContainer.append(carrier);

//   // centers the cursor in the first "square" of the ship image
//   function moveAt(pageX, pageY) {
//     if (!carrier.style.rotate) {
//       carrier.style.left =
//         pageX - (carrierContainer.getBoundingClientRect().x + 17.5) + "px";
//       carrier.style.top =
//         pageY - (carrierContainer.getBoundingClientRect().y + 17.5) + "px";
//     } else {
//       carrier.style.left =
//         pageX -
//         (carrierContainer.getBoundingClientRect().x + ((5 - 1) / 2) * 35) -
//         17.5 +
//         "px";
//       carrier.style.top =
//         pageY -
//         (carrierContainer.getBoundingClientRect().y - ((5 - 1) / 2) * 35) -
//         17.5 +
//         "px";
//     }
//   }

//   // move our absolutely positioned carrier under the pointer
//   moveAt(event.pageX, event.pageY);

//   // potential droppable that we're flying over right now
//   let currentDroppable = null;

//   function onMouseMove(event) {
//     moveAt(event.pageX, event.pageY);
//     carrier.hidden = true;
//     let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
//     carrier.hidden = false;

//     // mousemove events may trigger out of the window (when the ship is dragged off-screen)
//     // if clientX/clientY are out of the window, then elementFromPoint returns null
//     if (!elemBelow) return;

//     // potential droppables are labeled with the class "droppable" (can be other logic)
//     let droppableBelow = elemBelow.closest(".cpuSquare");

//     if (currentDroppable != droppableBelow) {
//       // we're flying in or out...
//       // note: both values can be null
//       //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
//       //   droppableBelow=null if we're not over a droppable now, during this event

//       if (currentDroppable) {
//         // the logic to process "flying out" of the droppable (remove highlight)
//         leaveDroppableArea(currentDroppable);
//       }
//       currentDroppable = droppableBelow;
//       if (currentDroppable) {
//         // the logic to process "flying in" of the droppable
//         enterDroppableArea(currentDroppable);
//       }
//     }
//   }

//   let shipCoords;
//   function enterDroppableArea(element) {
//     shipCoords = [];
//     // if (element) {
//     const indexOfInitialDropPoint = +element.dataset.indexNumber;
//     const maxHorizontal = (Math.floor(indexOfInitialDropPoint / 10) + 1) * 10;
//     const maxVertical =
//       indexOfInitialDropPoint -
//       Math.floor(indexOfInitialDropPoint / 10) * 10 +
//       90;
//     if (!carrier.style.rotate && indexOfInitialDropPoint + 4 < maxHorizontal) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
//           cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
//             "green";
//           shipCoords.push(indexOfInitialDropPoint + i);
//         }
//       }
//     } else if (
//       carrier.style.rotate &&
//       indexOfInitialDropPoint + 40 <= maxVertical
//     ) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
//           cpuBoardSquares[
//             indexOfInitialDropPoint + i * 10
//           ].style.backgroundColor = "green";
//           shipCoords.push(indexOfInitialDropPoint + i * 10);
//         }
//       }
//     }
//     // }
//     console.log(shipCoords);
//   }

//   function leaveDroppableArea(element) {
//     shipCoords = [];
//     const indexOfInitialDropPoint = +element.dataset.indexNumber;
//     if (!carrier.style.rotate) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
//           cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
//             "gray";
//         }
//       }
//     } else {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
//           cpuBoardSquares[
//             indexOfInitialDropPoint + i * 10
//           ].style.backgroundColor = "gray";
//         }
//       }
//     }
//   }

//   // (2) move the carrier on mousemove
//   document.addEventListener("mousemove", onMouseMove);

//   // (3) drop the carrier, remove unneeded handlers
//   carrier.onmouseup = function () {
//     document.removeEventListener("mousemove", onMouseMove);
//     carrier.onmouseup = null;
//     rotateBtn.style.display = ``;
//     console.log(shipCoords);
//     if (shipCoords) {
//       playerFleet.push({
//         name: `Carrier`,
//         shipPlacement: shipCoords,
//       });
//       carrierContainer.removeChild(carrier);
//       console.log(playerFleet);
//       renderPlayerShips(playerFleet);
//       cpuBoardSquares.forEach((square) => {
//         square.style.backgroundColor = `gray`;
//       });
//       console.log(shipImgs[1]);
//       shipImgs.forEach((ship, index) => {
//         console.log(index);
//         if (index === playerFleet.length) {
//           ship.classList.remove(`hide-ship`);
//         }
//       });
//     }
//   };
// };

// carrier.ondragstart = function () {
//   return false;
// };

// // // hard-coded instantiation of playerFleet
// // const playerFleet = [
// //   { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
// //   { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
// //   { name: "Destroyer", shipPlacement: [77, 87, 97] },
// //   { name: "Submarine", shipPlacement: [40, 50, 60] },
// //   { name: "Patrol Boat", shipPlacement: [58, 59] },
// // ];

// ASOFIJASOFIAJSOFIAJSOFAISJFOASIFJOASIFJAOSIFJAOSIFJASOFIJASOFAISJFOASIFJAOSFIJAOSIFJASOFIJASOFIASJFOASIJFAOSIFJAOSFIJASOiFJA

// ********* ----- HARD CODING THE CARRIER FOR NOW ******* !!!!!!!!!!!$$$$$$$$$$$$$$ --------

const playerFleet = [];
const shipNames = [
  `Carrier`,
  `Battleship`,
  `Destroyer`,
  `Submarine`,
  `Patrol Boat`,
];
const shipLengths = [5, 4, 3, 3, 2];

const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const shipImgs = document.querySelectorAll(`.ships-to-place`);

// hides all but the carrier on page load
shipImgs.forEach((ship, index) => {
  if (index !== 0) {
    ship.classList.add(`hide-ship`);
  }
});

rotateBtn.addEventListener(`click`, rotateShip);

function rotateShip(e) {
  shipImgs.forEach((image) => {
    if (!image.style.rotate) {
      image.style.rotate = `-90deg`;
      image.style.top = 30 + ((shipLengths[shipsPlaced] - 1) / 2) * 35 + `px`;
    } else {
      image.style.rotate = ``;
      image.style.top = 30 + `px`;
    }
  });
}

// const carrier = document.querySelector(`#player-carrier`);
// const carrierContainer = document.querySelector(`#carrier-container`);
const playerShipContainers = document.querySelectorAll(
  `.player-ships-container`
);

// console.log(carrierContainer.getBoundingClientRect());
// console.log(carrier.getBoundingClientRect());

let shipsPlaced = 0;

shipImgs.forEach((ship) => {
  ship.addEventListener(`mousedown`, beginShipPlacement);
  ship.ondragstart = function () {
    return false;
  };
});

function beginShipPlacement(event) {
  console.log(shipImgs[shipsPlaced]);
  rotateBtn.style.display = `none`;
  // (1) prepare to move element: make absolute and on top by z-index
  shipImgs[shipsPlaced].style.position = "absolute";
  shipImgs[shipsPlaced].style.zIndex = 1000;

  // move it out of any current parents directly into cpuBoard
  playerShipContainers[shipsPlaced].append(shipImgs[shipsPlaced]);

  // centers the cursor in the first "square" of the ship image
  function moveAt(pageX, pageY) {
    if (!shipImgs[shipsPlaced].style.rotate) {
      shipImgs[shipsPlaced].style.left =
        pageX -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().x + 17.5) +
        "px";
      shipImgs[shipsPlaced].style.top =
        pageY -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().y + 17.5) +
        "px";
    } else {
      shipImgs[shipsPlaced].style.left =
        pageX -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().x +
          ((shipLengths[shipsPlaced] - 1) / 2) * 35) -
        17.5 +
        "px";
      shipImgs[shipsPlaced].style.top =
        pageY -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().y -
          ((shipLengths[shipsPlaced] - 1) / 2) * 35) -
        17.5 +
        "px";
    }
  }

  // move our absolutely positioned carrier under the pointer
  moveAt(event.pageX, event.pageY);

  // potential droppable that we're flying over right now
  let currentDroppable = null;

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    shipImgs[shipsPlaced].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    shipImgs[shipsPlaced].hidden = false;

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    let droppableBelow = elemBelow.closest(".cpuSquare");

    if (currentDroppable != droppableBelow) {
      // we're flying in or out...
      // note: both values can be null
      //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
      //   droppableBelow=null if we're not over a droppable now, during this event

      if (currentDroppable) {
        // the logic to process "flying out" of the droppable (remove highlight)
        leaveDroppableArea(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        // the logic to process "flying in" of the droppable
        enterDroppableArea(currentDroppable);
      }
    }
  }

  let shipCoords;
  function enterDroppableArea(element) {
    shipCoords = [];
    // if (element) {
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    const maxHorizontal = (Math.floor(indexOfInitialDropPoint / 10) + 1) * 10;
    const maxVertical =
      indexOfInitialDropPoint -
      Math.floor(indexOfInitialDropPoint / 10) * 10 +
      90;
    if (
      !shipImgs[shipsPlaced].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[shipsPlaced] - 1) < maxHorizontal
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "green";
          shipCoords.push(indexOfInitialDropPoint + i);
        }
      }
    } else if (
      shipImgs[shipsPlaced].style.rotate &&
      indexOfInitialDropPoint + shipLengths[shipsPlaced] * 10 <= maxVertical
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "green";
          shipCoords.push(indexOfInitialDropPoint + i * 10);
        }
      }
    }
    // }
    console.log(shipCoords);
  }

  function leaveDroppableArea(element) {
    shipCoords = [];
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    if (!shipImgs[shipsPlaced].style.rotate) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "gray";
        }
      }
    } else {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "gray";
        }
      }
    }
  }

  // (2) move the carrier on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // (3) drop the carrier, remove unneeded handlers
  shipImgs[shipsPlaced].onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    shipImgs[shipsPlaced].onmouseup = null;
    rotateBtn.style.display = ``;
    console.log(shipCoords);
    if (shipCoords) {
      playerFleet.push({
        name: shipNames[shipsPlaced],
        shipPlacement: shipCoords,
      });
      playerShipContainers[shipsPlaced].removeChild(shipImgs[shipsPlaced]);
      console.log(playerFleet);
      renderPlayerShips(playerFleet);
      cpuBoardSquares.forEach((square) => {
        square.style.backgroundColor = `gray`;
      });
      console.log(shipImgs[1]);
      shipImgs.forEach((ship, index) => {
        console.log(index);
        if (index === playerFleet.length) {
          ship.classList.remove(`hide-ship`);
        }
      });
      shipsPlaced += 1;
    }
  };
}

// // hard-coded instantiation of playerFleet
// const playerFleet = [
//   { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
//   { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
//   { name: "Destroyer", shipPlacement: [77, 87, 97] },
//   { name: "Submarine", shipPlacement: [40, 50, 60] },
//   { name: "Patrol Boat", shipPlacement: [58, 59] },
// ];
