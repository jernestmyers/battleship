/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shipModule.js":
/*!***************************!*\
  !*** ./src/shipModule.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hit": () => (/* binding */ hit),
/* harmony export */   "isSunk": () => (/* binding */ isSunk)
/* harmony export */ });
const Ship = (fleetObject) => {
  const fleet = {
    carrier: fleetObject.carrier,
    battleship: fleetObject.battleship,
    destroyer: fleetObject.destroyer,
    submarine: fleetObject.submarine,
    patrol: fleetObject.patrol,
  };
  return { fleet };
};

const playerShips = Ship({
  carrier: [1, 2, 3, 4, 5],
  battleship: [10, 11, 12, 13],
  destroyer: [77, 87, 97],
  submarine: [40, 50, 60],
  patrol: [58, 59],
});

const hit = (attackCoord) => {
  const fleetMap = new Map(Object.entries(playerShips.fleet));
  let attackOutcome = [null, null, attackCoord];
  fleetMap.forEach((shipCoordinates, ship) => {
    if (Array.from(shipCoordinates).includes(attackCoord)) {
      attackOutcome = [ship, shipCoordinates, attackCoord];
      //   isSunk(attackOutcome);
    }
  });
  return attackOutcome;
};

const isSunk = (array) => {
  if (!array[0]) {
    return;
  } else {
    let isSunk = false;
    const fleetHitsRemaining = new Map(Object.entries(playerShips.fleet));
    const shipHitsRemaining = fleetHitsRemaining.get(array[0]);
    shipHitsRemaining.splice(shipHitsRemaining.indexOf(array[2]), 1);
    fleetHitsRemaining.delete(array[0]);
    if (!shipHitsRemaining.length) {
      isSunk = true;
    } else {
      fleetHitsRemaining.set(array[0], shipHitsRemaining);
    }
    // console.log(fleetHitsRemaining);
    console.log(isSunk);
    return [isSunk, array[0]];
  }
};

// console.log(hit(50));
// console.log(hit(66));

// console.log(isSunk([`submarine`, [40, 50, 60], 50]));
// console.log(isSunk([`submarine`, [40, 50, 60], 40]));
// console.log(isSunk([`submarine`, [40, 50, 60], 60]));

// module.exports = hit;
// module.exports = isSunk;




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shipModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipModule */ "./src/shipModule.js");


console.log((0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.hit)(50));
console.log((0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.hit)(66));

console.log((0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.isSunk)([`submarine`, [40, 50, 60], 50]));
console.log((0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.isSunk)([`submarine`, [40, 50, 60], 40]));
console.log((0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.isSunk)([`submarine`, [40, 50, 60], 60]));

// const Ship = (fleetObject) => {
//   const fleet = {
//     carrier: fleetObject.carrier,
//     battleship: fleetObject.battleship,
//     destroyer: fleetObject.destroyer,
//     submarine: fleetObject.submarine,
//     patrol: fleetObject.patrol,
//   };
//   // const hit = (coord) => {
//   //   // map the ship arrays and search for a hit
//   //   // if a hit is made, determine which ship and document in a hit array
//   //   // send hit array and ship name to isSunk
//   //   return `hi`;
//   // };
//   // const isSunk = (length) => {
//   //   // if hit array === length of ship, then true
//   //   // else false
//   // };
//   // return { fleet, hit };
//   return { fleet };
// };

// const playerShips = Ship({
//   carrier: [1, 2, 3, 4, 5],
//   battleship: [10, 11, 12, 13],
//   destroyer: [77, 87, 97],
//   submarine: [40, 50, 60],
//   patrol: [58, 59],
// });

// const hit = (attackCoord) => {
//   const fleetMap = new Map(Object.entries(playerShips.fleet));
//   let attackOutcome = [null, null, attackCoord];
//   fleetMap.forEach((shipCoordinates, ship) => {
//     if (Array.from(shipCoordinates).includes(attackCoord)) {
//       attackOutcome = [ship, shipCoordinates, attackCoord];
//       //   isSunk(attackOutcome);
//     }
//   });
//   return attackOutcome;
// };

// // const isSunk = (array) => {
// //   if (!array[0]) {
// //     return;
// //   } else {
// //     let isSunk = false;
// //     const fleetHitsRemaining = new Map(Object.entries(playerShips.fleet));
// //     const shipHitsRemaining = fleetHitsRemaining.get(array[0]);
// //     shipHitsRemaining.splice(shipHitsRemaining.indexOf(array[2]), 1);
// //     fleetHitsRemaining.delete(array[0]);
// //     if (!shipHitsRemaining.length) {
// //       isSunk = true;
// //     } else {
// //       fleetHitsRemaining.set(array[0], shipHitsRemaining);
// //     }
// //     // console.log(fleetHitsRemaining);
// //     console.log(isSunk);
// //     return [isSunk, array[0]];
// //   }
// // };

// console.log(hit(50));
// console.log(hit(66));

// // console.log(isSunk([`submarine`, [40, 50, 60], 50]));
// // console.log(isSunk([`submarine`, [40, 50, 60], 40]));
// // console.log(isSunk([`submarine`, [40, 50, 60], 60]));

// module.exports = hit;
// // module.exports = isSunk;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFdUI7Ozs7Ozs7VUM3RHZCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTjJDOztBQUUzQyxZQUFZLGdEQUFHO0FBQ2YsWUFBWSxnREFBRzs7QUFFZixZQUFZLG1EQUFNO0FBQ2xCLFlBQVksbURBQU07QUFDbEIsWUFBWSxtREFBTTs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgU2hpcCA9IChmbGVldE9iamVjdCkgPT4ge1xuICBjb25zdCBmbGVldCA9IHtcbiAgICBjYXJyaWVyOiBmbGVldE9iamVjdC5jYXJyaWVyLFxuICAgIGJhdHRsZXNoaXA6IGZsZWV0T2JqZWN0LmJhdHRsZXNoaXAsXG4gICAgZGVzdHJveWVyOiBmbGVldE9iamVjdC5kZXN0cm95ZXIsXG4gICAgc3VibWFyaW5lOiBmbGVldE9iamVjdC5zdWJtYXJpbmUsXG4gICAgcGF0cm9sOiBmbGVldE9iamVjdC5wYXRyb2wsXG4gIH07XG4gIHJldHVybiB7IGZsZWV0IH07XG59O1xuXG5jb25zdCBwbGF5ZXJTaGlwcyA9IFNoaXAoe1xuICBjYXJyaWVyOiBbMSwgMiwgMywgNCwgNV0sXG4gIGJhdHRsZXNoaXA6IFsxMCwgMTEsIDEyLCAxM10sXG4gIGRlc3Ryb3llcjogWzc3LCA4NywgOTddLFxuICBzdWJtYXJpbmU6IFs0MCwgNTAsIDYwXSxcbiAgcGF0cm9sOiBbNTgsIDU5XSxcbn0pO1xuXG5jb25zdCBoaXQgPSAoYXR0YWNrQ29vcmQpID0+IHtcbiAgY29uc3QgZmxlZXRNYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHBsYXllclNoaXBzLmZsZWV0KSk7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIG51bGwsIGF0dGFja0Nvb3JkXTtcbiAgZmxlZXRNYXAuZm9yRWFjaCgoc2hpcENvb3JkaW5hdGVzLCBzaGlwKSA9PiB7XG4gICAgaWYgKEFycmF5LmZyb20oc2hpcENvb3JkaW5hdGVzKS5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbc2hpcCwgc2hpcENvb3JkaW5hdGVzLCBhdHRhY2tDb29yZF07XG4gICAgICAvLyAgIGlzU3VuayhhdHRhY2tPdXRjb21lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbmNvbnN0IGlzU3VuayA9IChhcnJheSkgPT4ge1xuICBpZiAoIWFycmF5WzBdKSB7XG4gICAgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIGxldCBpc1N1bmsgPSBmYWxzZTtcbiAgICBjb25zdCBmbGVldEhpdHNSZW1haW5pbmcgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHBsYXllclNoaXBzLmZsZWV0KSk7XG4gICAgY29uc3Qgc2hpcEhpdHNSZW1haW5pbmcgPSBmbGVldEhpdHNSZW1haW5pbmcuZ2V0KGFycmF5WzBdKTtcbiAgICBzaGlwSGl0c1JlbWFpbmluZy5zcGxpY2Uoc2hpcEhpdHNSZW1haW5pbmcuaW5kZXhPZihhcnJheVsyXSksIDEpO1xuICAgIGZsZWV0SGl0c1JlbWFpbmluZy5kZWxldGUoYXJyYXlbMF0pO1xuICAgIGlmICghc2hpcEhpdHNSZW1haW5pbmcubGVuZ3RoKSB7XG4gICAgICBpc1N1bmsgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGVldEhpdHNSZW1haW5pbmcuc2V0KGFycmF5WzBdLCBzaGlwSGl0c1JlbWFpbmluZyk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGZsZWV0SGl0c1JlbWFpbmluZyk7XG4gICAgY29uc29sZS5sb2coaXNTdW5rKTtcbiAgICByZXR1cm4gW2lzU3VuaywgYXJyYXlbMF1dO1xuICB9XG59O1xuXG4vLyBjb25zb2xlLmxvZyhoaXQoNTApKTtcbi8vIGNvbnNvbGUubG9nKGhpdCg2NikpO1xuXG4vLyBjb25zb2xlLmxvZyhpc1N1bmsoW2BzdWJtYXJpbmVgLCBbNDAsIDUwLCA2MF0sIDUwXSkpO1xuLy8gY29uc29sZS5sb2coaXNTdW5rKFtgc3VibWFyaW5lYCwgWzQwLCA1MCwgNjBdLCA0MF0pKTtcbi8vIGNvbnNvbGUubG9nKGlzU3VuayhbYHN1Ym1hcmluZWAsIFs0MCwgNTAsIDYwXSwgNjBdKSk7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gaGl0O1xuLy8gbW9kdWxlLmV4cG9ydHMgPSBpc1N1bms7XG5cbmV4cG9ydCB7IGhpdCwgaXNTdW5rIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGhpdCwgaXNTdW5rIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuXG5jb25zb2xlLmxvZyhoaXQoNTApKTtcbmNvbnNvbGUubG9nKGhpdCg2NikpO1xuXG5jb25zb2xlLmxvZyhpc1N1bmsoW2BzdWJtYXJpbmVgLCBbNDAsIDUwLCA2MF0sIDUwXSkpO1xuY29uc29sZS5sb2coaXNTdW5rKFtgc3VibWFyaW5lYCwgWzQwLCA1MCwgNjBdLCA0MF0pKTtcbmNvbnNvbGUubG9nKGlzU3VuayhbYHN1Ym1hcmluZWAsIFs0MCwgNTAsIDYwXSwgNjBdKSk7XG5cbi8vIGNvbnN0IFNoaXAgPSAoZmxlZXRPYmplY3QpID0+IHtcbi8vICAgY29uc3QgZmxlZXQgPSB7XG4vLyAgICAgY2FycmllcjogZmxlZXRPYmplY3QuY2Fycmllcixcbi8vICAgICBiYXR0bGVzaGlwOiBmbGVldE9iamVjdC5iYXR0bGVzaGlwLFxuLy8gICAgIGRlc3Ryb3llcjogZmxlZXRPYmplY3QuZGVzdHJveWVyLFxuLy8gICAgIHN1Ym1hcmluZTogZmxlZXRPYmplY3Quc3VibWFyaW5lLFxuLy8gICAgIHBhdHJvbDogZmxlZXRPYmplY3QucGF0cm9sLFxuLy8gICB9O1xuLy8gICAvLyBjb25zdCBoaXQgPSAoY29vcmQpID0+IHtcbi8vICAgLy8gICAvLyBtYXAgdGhlIHNoaXAgYXJyYXlzIGFuZCBzZWFyY2ggZm9yIGEgaGl0XG4vLyAgIC8vICAgLy8gaWYgYSBoaXQgaXMgbWFkZSwgZGV0ZXJtaW5lIHdoaWNoIHNoaXAgYW5kIGRvY3VtZW50IGluIGEgaGl0IGFycmF5XG4vLyAgIC8vICAgLy8gc2VuZCBoaXQgYXJyYXkgYW5kIHNoaXAgbmFtZSB0byBpc1N1bmtcbi8vICAgLy8gICByZXR1cm4gYGhpYDtcbi8vICAgLy8gfTtcbi8vICAgLy8gY29uc3QgaXNTdW5rID0gKGxlbmd0aCkgPT4ge1xuLy8gICAvLyAgIC8vIGlmIGhpdCBhcnJheSA9PT0gbGVuZ3RoIG9mIHNoaXAsIHRoZW4gdHJ1ZVxuLy8gICAvLyAgIC8vIGVsc2UgZmFsc2Vcbi8vICAgLy8gfTtcbi8vICAgLy8gcmV0dXJuIHsgZmxlZXQsIGhpdCB9O1xuLy8gICByZXR1cm4geyBmbGVldCB9O1xuLy8gfTtcblxuLy8gY29uc3QgcGxheWVyU2hpcHMgPSBTaGlwKHtcbi8vICAgY2FycmllcjogWzEsIDIsIDMsIDQsIDVdLFxuLy8gICBiYXR0bGVzaGlwOiBbMTAsIDExLCAxMiwgMTNdLFxuLy8gICBkZXN0cm95ZXI6IFs3NywgODcsIDk3XSxcbi8vICAgc3VibWFyaW5lOiBbNDAsIDUwLCA2MF0sXG4vLyAgIHBhdHJvbDogWzU4LCA1OV0sXG4vLyB9KTtcblxuLy8gY29uc3QgaGl0ID0gKGF0dGFja0Nvb3JkKSA9PiB7XG4vLyAgIGNvbnN0IGZsZWV0TWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhwbGF5ZXJTaGlwcy5mbGVldCkpO1xuLy8gICBsZXQgYXR0YWNrT3V0Y29tZSA9IFtudWxsLCBudWxsLCBhdHRhY2tDb29yZF07XG4vLyAgIGZsZWV0TWFwLmZvckVhY2goKHNoaXBDb29yZGluYXRlcywgc2hpcCkgPT4ge1xuLy8gICAgIGlmIChBcnJheS5mcm9tKHNoaXBDb29yZGluYXRlcykuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4vLyAgICAgICBhdHRhY2tPdXRjb21lID0gW3NoaXAsIHNoaXBDb29yZGluYXRlcywgYXR0YWNrQ29vcmRdO1xuLy8gICAgICAgLy8gICBpc1N1bmsoYXR0YWNrT3V0Y29tZSk7XG4vLyAgICAgfVxuLy8gICB9KTtcbi8vICAgcmV0dXJuIGF0dGFja091dGNvbWU7XG4vLyB9O1xuXG4vLyAvLyBjb25zdCBpc1N1bmsgPSAoYXJyYXkpID0+IHtcbi8vIC8vICAgaWYgKCFhcnJheVswXSkge1xuLy8gLy8gICAgIHJldHVybjtcbi8vIC8vICAgfSBlbHNlIHtcbi8vIC8vICAgICBsZXQgaXNTdW5rID0gZmFsc2U7XG4vLyAvLyAgICAgY29uc3QgZmxlZXRIaXRzUmVtYWluaW5nID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhwbGF5ZXJTaGlwcy5mbGVldCkpO1xuLy8gLy8gICAgIGNvbnN0IHNoaXBIaXRzUmVtYWluaW5nID0gZmxlZXRIaXRzUmVtYWluaW5nLmdldChhcnJheVswXSk7XG4vLyAvLyAgICAgc2hpcEhpdHNSZW1haW5pbmcuc3BsaWNlKHNoaXBIaXRzUmVtYWluaW5nLmluZGV4T2YoYXJyYXlbMl0pLCAxKTtcbi8vIC8vICAgICBmbGVldEhpdHNSZW1haW5pbmcuZGVsZXRlKGFycmF5WzBdKTtcbi8vIC8vICAgICBpZiAoIXNoaXBIaXRzUmVtYWluaW5nLmxlbmd0aCkge1xuLy8gLy8gICAgICAgaXNTdW5rID0gdHJ1ZTtcbi8vIC8vICAgICB9IGVsc2Uge1xuLy8gLy8gICAgICAgZmxlZXRIaXRzUmVtYWluaW5nLnNldChhcnJheVswXSwgc2hpcEhpdHNSZW1haW5pbmcpO1xuLy8gLy8gICAgIH1cbi8vIC8vICAgICAvLyBjb25zb2xlLmxvZyhmbGVldEhpdHNSZW1haW5pbmcpO1xuLy8gLy8gICAgIGNvbnNvbGUubG9nKGlzU3Vuayk7XG4vLyAvLyAgICAgcmV0dXJuIFtpc1N1bmssIGFycmF5WzBdXTtcbi8vIC8vICAgfVxuLy8gLy8gfTtcblxuLy8gY29uc29sZS5sb2coaGl0KDUwKSk7XG4vLyBjb25zb2xlLmxvZyhoaXQoNjYpKTtcblxuLy8gLy8gY29uc29sZS5sb2coaXNTdW5rKFtgc3VibWFyaW5lYCwgWzQwLCA1MCwgNjBdLCA1MF0pKTtcbi8vIC8vIGNvbnNvbGUubG9nKGlzU3VuayhbYHN1Ym1hcmluZWAsIFs0MCwgNTAsIDYwXSwgNDBdKSk7XG4vLyAvLyBjb25zb2xlLmxvZyhpc1N1bmsoW2BzdWJtYXJpbmVgLCBbNDAsIDUwLCA2MF0sIDYwXSkpO1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IGhpdDtcbi8vIC8vIG1vZHVsZS5leHBvcnRzID0gaXNTdW5rO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==