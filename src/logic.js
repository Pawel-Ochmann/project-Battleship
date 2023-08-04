function createShip(length) {
  return {
    length: length,
    hitsTaken: 0,
    hit: function () {
      this.hitsTaken++;
    },
    isSunk: function () {
      return this.length > this.hitsTaken ? false : true;
    },
  };
}

function createGameboard() {
  function getField(x, y) {
    return { x: x, y: y };
  }
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  function getBoard() {
    const board = [];
    for (const column of columns) {
      for (let i = 1; i <= 10; i++) {
        board.push(getField(i, column));
      }
    }
    return board;
  }

  return {
    board: getBoard(),
    placeShip: function () {
      return false;
    },
    receiveAttack: function (x, y) {
      return false;
    },
  };
}

// console.log(createGameboard().board);

module.exports = { createShip, createGameboard };
