const start = document.querySelector(".start");
const squares = document.querySelectorAll(".square-input");

const boxs = [];
const rows = [];
const columns = [];
const fields = [];

for (let i = 1; i < 10; i++) {
  boxs.push(document.querySelectorAll(`[data-box="${i}"]`));
  rows.push(document.querySelectorAll(`[data-row="${i}"]`));
  columns.push(document.querySelectorAll(`[data-column="${i}"]`));

  fields.push(boxs);
  fields.push(rows);
  fields.push(columns);
}
initialize();

function solveSudoku() {
  checkIfContainsNumbers();

  // checking possibleNumbers

  updatePosibleNumbers();

  // checking if posible number is in only one in area

  fields.forEach((field) => {
    field.forEach((area) => {
      area.forEach((square) => {
        if (square.dataset.posibleNumbers !== []) {
          const posibleNumbers = Array.from(
            square.dataset.posibleNumbers.split(",")
          );

          for (let posibleNumber of posibleNumbers) {
            let count = 0;
            area.forEach((sqr) => {
              sqr.dataset.posibleNumbers.includes(posibleNumber)
                ? count++
                : null;
              sqr.dataset.number === posibleNumber ? (count = 99) : null;
            });
            if (count === 1) {
              square.dataset.number = posibleNumber;
              square.dataset.posibleNumbers = [];
              square.value = posibleNumber;
              removePosibleNumberHandler(square);
              break;
            }
          }
        }
      });
    });
  });

  // additional checkig if all posibleNumber in box is in the same row or col

  boxs.forEach((box) => {
    box.forEach((cell) => {
      if (cell.dataset.posibleNumbers !== []) {
        const posibleNumbers = Array.from(
          cell.dataset.posibleNumbers.split(",")
        );

        for (let posibleNumber of posibleNumbers) {
          let row = [];
          let col = [];

          box.forEach((sqr) => {
            if (sqr.dataset.posibleNumbers.includes(posibleNumber)) {
              row.push(sqr.dataset.row);
              col.push(sqr.dataset.column);
            }
          });

          if (row.every((rowID) => rowID === row[0]) && row.length > 1) {
            removeFromArea(rows[row[0] - 1], cell, posibleNumber, "box");
            break;
          }
          if (col.every((colID) => colID === col[0]) && col.length > 1) {
            removeFromArea(columns[col[0] - 1], cell, posibleNumber, "box");
            break;
          }
        }
      }
    });
  });
  rows.forEach((row) => {
    row.forEach((cell) => {
      if (cell.dataset.posibleNumbers !== []) {
        const posibleNumbers = Array.from(
          cell.dataset.posibleNumbers.split(",")
        );

        for (let posibleNumber of posibleNumbers) {
          let box = [];

          row.forEach((sqr) => {
            if (sqr.dataset.posibleNumbers.includes(posibleNumber)) {
              box.push(sqr.dataset.box);
            }
          });

          if (box.every((boxID) => boxID === box[0]) && box.length > 1) {
            removeFromArea(boxs[box[0] - 1], cell, posibleNumber, "row");
            break;
          }
        }
      }
    });
  });

  columns.forEach((col) => {
    col.forEach((cell) => {
      if (cell.dataset.posibleNumbers !== []) {
        const posibleNumbers = Array.from(
          cell.dataset.posibleNumbers.split(",")
        );

        for (let posibleNumber of posibleNumbers) {
          let box = [];

          col.forEach((sqr) => {
            if (sqr.dataset.posibleNumbers.includes(posibleNumber)) {
              box.push(sqr.dataset.box);
            }
          });

          if (box.every((boxID) => boxID === box[0]) && box.length > 1) {
            removeFromArea(boxs[box[0] - 1], cell, posibleNumber, "column");
            break;
          }
        }
      }
    });
  });
}

start.addEventListener("click", solveSudoku);

function initialize() {
  squares.forEach((square) => {
    square.dataset.posibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    square.onkeypress = (event) => (square.value = event.target.value);
    square.onchange = (event) =>
      (square.value = addingNumberHandler(event.target));
  });
}

function addingNumberHandler(value) {
  if (+value.value > 9) {
    value.dataset.number = value.value % 10;
    return value.value % 10;
  } else if (+value.value === 0) {
    value.dataset.number = "";
    value.dataset.posibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return null;
  } else {
    value.dataset.number = value.value;
    return value.value;
  }
}

function checkIfContainsNumbers() {
  squares.forEach((square) => {
    if (square.dataset.number === undefined || square.dataset.number === "") {
      return;
    } else {
      square.dataset.posibleNumbers = [];
    }
  });
}

function removePosibleNumberHandler(square) {
  squares.forEach((sqr) => {
    if (
      sqr.dataset.posibleNumbers !== [] &&
      sqr !== square &&
      (sqr.dataset.box === square.dataset.box ||
        sqr.dataset.row === square.dataset.row ||
        sqr.dataset.column === square.dataset.column)
    ) {
      removePosibleNumber(sqr, square.dataset.number);
    }
  });
}

function removeFromArea(type, cell, numberToRemove, areaType) {
  type.forEach((sqr) => {
    if (areaType === "box") {
      if (sqr.dataset.box !== cell.dataset.box)
        removePosibleNumber(sqr, numberToRemove);
    } else if (areaType === "column") {
      if (sqr.dataset.column !== cell.dataset.column)
        removePosibleNumber(sqr, numberToRemove);
    } else if (areaType === "row") {
      if (sqr.dataset.row !== cell.dataset.row)
        removePosibleNumber(sqr, numberToRemove);
    }
  });
}

function removePosibleNumber(square, numberToRemove) {
  if (square.dataset.posibleNumbers !== []) {
    if (square.dataset.posibleNumbers.includes(numberToRemove)) {
      let newPosibleNumbers = Array.from(
        square.dataset.posibleNumbers.split(",")
      );
      newPosibleNumbers.splice(newPosibleNumbers.indexOf(numberToRemove), 1);

      if (newPosibleNumbers.length === 1) {
        square.dataset.number = newPosibleNumbers[0];
        square.dataset.posibleNumbers = [];
        square.value = newPosibleNumbers[0];
        updatePosibleNumbers();
      } else {
        square.dataset.posibleNumbers = newPosibleNumbers;
      }
    }
  }
}

function updatePosibleNumbers() {
  fields.forEach((field) => {
    field.forEach((area) => {
      takenNumbers = [];
      area.forEach((square) => {
        if (
          square.dataset.number &&
          square.dataset.number !== null &&
          !takenNumbers.includes(square.dataset.number)
        ) {
          takenNumbers.push(square.dataset.number);
        }
      });
      takenNumbers.forEach((takenNumber) => {
        area.forEach((square) => {
          removePosibleNumber(square, takenNumber);
        });
      });
    });
  });
}
