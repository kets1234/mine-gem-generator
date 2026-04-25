function generateGridPattern(rows = 5, cols = 5, picks = 5) {
  let total = rows * cols;
  let selected = new Set();

  while (selected.size < picks) {
    selected.add(Math.floor(Math.random() * total));
  }

  let grid = [];
  let index = 0;

  for (let i = 0; i < rows; i++) {
    let row = [];

    for (let j = 0; j < cols; j++) {
      row.push(selected.has(index) ? "💎" : "⬜");
      index++;
    }

    grid.push(row);
  }

  return grid;
}

const rows = 10;
const cols = 3;
const playableRows = [7, 8, 9];

function createBoardData() {
  const board = [];

  for (let r = 0; r < rows; r++) {
    const row = [];

    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        suggested: false,
        alt: false,
      });
    }

    board.push(row);
  }

  return board;
}

function generateSuggestions(mode = "easy") {
  const board = createBoardData();

  playableRows.forEach((r) => {
    const mainPick = Math.floor(Math.random() * cols);
    board[r][mainPick].suggested = true;

    if (mode === "medium") {
      const altPick = (mainPick + 1 + Math.floor(Math.random() * 2)) % cols;
      board[r][altPick].alt = true;
    }

    if (mode === "hard") {
      for (let c = 0; c < cols; c++) {
        if (c !== mainPick) {
          board[r][c].alt = true;
        }
      }
    }
  });

  return board;
}

function getPressPositions(board) {
  const positions = [];

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.suggested) {
        positions.push({
          row: cell.row + 1,
          col: cell.col + 1,
        });
      }
    });
  });

  return positions;
}

function changeGame() {
  const game = document.getElementById("gameSelect").value;
  const modeSelect = document.getElementById("modeSelect");

  if (game === "press") {
    modeSelect.classList.remove("hidden");
  } else {
    modeSelect.classList.add("hidden");
  }

  generateGame();
}

function generateGame() {
  const game = document.getElementById("gameSelect").value;
  const gridContainer = document.getElementById("grid");
  const pressList = document.getElementById("pressList");

  gridContainer.innerHTML = "";
  pressList.innerHTML = "";
  pressList.classList.add("hidden");

  if (game === "gem") {
    gridContainer.className = "grid grid-5";

    const pattern = generateGridPattern();

    pattern.forEach((row) => {
      row.forEach((cell) => {
        const div = document.createElement("div");
        div.className = "cell";
        div.textContent = cell;
        gridContainer.appendChild(div);
      });
    });
  }

  if (game === "press") {
    gridContainer.className = "grid grid-3";

    const mode = document.getElementById("modeSelect").value;
    const board = generateSuggestions(mode);

    board.forEach((row) => {
      row.forEach((cell) => {
        const div = document.createElement("div");
        div.className = "cell";

        if (cell.suggested) {
          div.textContent = "💎";
        } else if (cell.alt) {
          div.textContent = "🔸";
        } else {
          div.textContent = "⬜";
        }

        gridContainer.appendChild(div);
      });
    });

    const positions = getPressPositions(board)
      .map((pos) => `Row ${pos.row}, Column ${pos.col}`)
      .join("<br>");

    pressList.classList.remove("hidden");
    pressList.innerHTML = `<strong>Suggested positions:</strong><br>${positions}`;
  }
}

generateGame();
