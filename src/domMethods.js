const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.computer.board');

function appendBoards(board1, board2) {
  for (const field of board1) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    playerBoard.appendChild(box);
  }
  for (const field of board2) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    computerBoard.appendChild(box);
  }
}

function placeShip() {
  const fields = document.querySelectorAll('.player.board>div');

  const destroyer = document.querySelector('#destroyer');

  function drag(e) {
    e.preventDefault();
    console.log(e);
    const element = document.elementFromPoint(e.pageX, e.pageY-window.scrollY);
    element.style.border = '2px solid red';
    const shipToLoad = new Image();
    shipToLoad.src = './images/boat.png';
    console.log(shipToLoad);
    element.appendChild(shipToLoad);
    console.log(e, window.scrollY);
  }

  destroyer.addEventListener('dragend', drag);
}

module.exports = { appendBoards, placeShip };

// style=background-image
