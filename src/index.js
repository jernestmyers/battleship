const Ship = (fleetObject) => {
  const fleet = {
    carrier: fleetObject.carrier,
    battleship: fleetObject.battleship,
    destroyer: fleetObject.destroyer,
    submarine: fleetObject.submarine,
    patrol: fleetObject.patrol,
  };
  const hit = (coord) => {
    // map the ship arrays and search for a hit
    // if a hit is made, determine which ship and document in a hit array
    // send hit array and ship name to isSunk
    return `hi`;
  };
  const isSunk = (length) => {
    // if hit array === length of ship, then true
    // else false
  };
  return { fleet, hit };
};

const playerShips = Ship({
  carrier: [1, 2, 3, 4, 5],
  battleship: [10, 11, 12, 13],
  destroyer: [77, 87, 97],
  submarine: [40, 50, 60],
  patrol: [58, 59],
});

const hit = (coord) => {
  const fleetMap = new Map(Object.entries(playerShips.fleet));
  let attackOutcome = [null, null, coord];
  fleetMap.forEach((value, key) => {
    if (Array.from(value).includes(coord)) {
      attackOutcome = [key, value, coord];
      //   isSunk(attackOutcome);
    }
  });
  return attackOutcome;
};

const isSunk = (array) => {
  let isSunk = false;
  const hitsRemaining = new Map(Object.entries(playerShips.fleet));
  const arrayOfHitShip = hitsRemaining.get(array[0]);
  arrayOfHitShip.splice(arrayOfHitShip.indexOf(array[2]), 1);
  hitsRemaining.delete(array[0]);
  if (!arrayOfHitShip.length) {
    isSunk = true;
  } else {
    hitsRemaining.set(array[0], arrayOfHitShip);
  }
  console.log(hitsRemaining);
  console.log(isSunk);
  return isSunk;
};

hit(50);
hit(66);

isSunk([`submarine`, [40, 50, 60], 50]);
isSunk([`submarine`, [40, 50, 60], 40]);
isSunk([`submarine`, [40, 50, 60], 60]);

module.exports = hit;
module.exports = isSunk;
