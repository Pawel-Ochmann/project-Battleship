const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.computer.board');

function appendBoards(board1) {
  for (const field of board1) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    playerBoard.appendChild(box);
  };
    for (const field of board1) {
      const box = document.createElement('div');
      box.dataset.x = field.x;
      box.dataset.y = field.y;
      computerBoard.appendChild(box);
    }
}

module.exports = { appendBoards };
