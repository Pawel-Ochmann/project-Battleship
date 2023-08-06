const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.computer.board');

function appendBoards(board1, board2) {
  for (const field of board1) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    box.dataset.free = field.free;
    playerBoard.appendChild(box);
  }
  if (board2) {
    for (const field of board2) {
      const box = document.createElement('div');
      box.dataset.x = field.x;
      box.dataset.y = field.y;
      computerBoard.appendChild(box);
    }
  }
}

function placeShip(board) {
  const fields = document.querySelectorAll('.player.board>div');

  const ships = document.querySelectorAll('.fleet.player img');

  const rotateIcons = document.querySelectorAll('.fleet i');

  const freeFields = [...fields].filter((field) => field.dataset.free);

  function showFreeFields() {
    console.log(fields[0].dataset.free);
    freeFields.forEach((field) => {
      field.classList.add('fieldFree');
    });
  }
  function hideFreeFields() {
    freeFields.forEach((field) => {
      field.classList.remove('fieldFree');
    });
  }

  rotateIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const shipToRotate = icon.nextElementSibling;
      shipToRotate.classList.toggle('shipRotate');
    });
  });

  function dragend(e) {
    hideFreeFields();
    e.preventDefault();
    const element = document.elementFromPoint(
      e.pageX - window.scrollX,
      e.pageY - window.scrollY
    );
    if (!element.dataset.free) return;

    const shipToLoad = new Image();
    shipToLoad.src = this.src;
    shipToLoad.classList.add('shipToLoad');
    element.appendChild(shipToLoad);
  }
  ships.forEach((ship) => {
    ship.addEventListener('drag', showFreeFields);
    ship.addEventListener('dragend', dragend);
  });
}

module.exports = { appendBoards, placeShip };
