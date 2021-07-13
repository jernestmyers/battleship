const { hit, isSunk } = require("./shipModule");

describe("hit()", () => {
  test("test hit", () => {
    expect(hit(50)).toEqual([`submarine`, [40, 50, 60], 50]);
  });
  test("test miss", () => {
    expect(hit(66)).toEqual([null, null, 66]);
  });
});

describe("isSunk()", () => {
  test("not sunk", () => {
    expect(isSunk([`submarine`, [40, 50, 60], 50])).toEqual([
      false,
      `submarine`,
    ]);
  });
  test("ship is sunk with ship name", () => {
    const sinkShip = function () {
      let value = isSunk([`submarine`, [40, 50, 60], 50]);
      value = isSunk([`submarine`, [40, 50, 60], 40]);
      value = isSunk([`submarine`, [40, 50, 60], 60]);
      return value;
    };
    expect(sinkShip()).toEqual([true, `submarine`]);
  });
});
