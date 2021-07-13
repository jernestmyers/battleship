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

module.exports = { hit, isSunk };
// export { hit, isSunk };
