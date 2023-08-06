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

function placeShip(board) {
  const fields = document.querySelectorAll('.player.board>div');

  const ships = document.querySelectorAll('.fleet.player img');

  const rotateIcons = document.querySelectorAll('.fleet i');

  const freeFields = [...fields];

  function showFreeFields() {
    console.log(freeFields);
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

  

  function drag(e) {
    hideFreeFields();
    e.preventDefault();
    const element = document.elementFromPoint(
      e.pageX - window.scrollX,
      e.pageY - window.scrollY
    );
    const shipToLoad = new Image();
    shipToLoad.src = this.src;
    shipToLoad.classList.add('shipToLoad');
    element.appendChild(shipToLoad);
  }
  ships.forEach((ship) => {
    ship.addEventListener('drag', showFreeFields);
    ship.addEventListener('dragend', drag);
  });
}

module.exports = { appendBoards, placeShip };

// style=background-image
