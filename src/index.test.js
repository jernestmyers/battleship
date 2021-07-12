const hit = require("./index");
const isSunk = require("./index");

test("test hit", () => {
  expect(hit(50)).toEqual([`submarine`, [40, 50, 60], 50]);
});

test("test miss", () => {
  expect(hit(66)).toEqual([null, null, 66]);
});

test.only("not sunk", () => {
  expect(isSunk([`submarine`, [40, 50, 60], 50])).toEqual(false);
});
