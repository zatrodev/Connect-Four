import { computerMove } from "./computer.js";
import { arrayToLinkedList, checkIfHasAdjacentNodes } from "./logic.js";

export let columns = 7;
let rows = 6;
let numOfRequiredAdjacentCirclesToWin = 4;
let currPlayer = 0;
let gameContinue = true;

let board = new Array();
let linkedBoard = new Array();
const gameBoard = document.getElementById("gameBoard");

const mode = document.getElementById("mode");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const colSlider = document.getElementById("col");
const rowSlider = document.getElementById("row");
const colInput = document.getElementById("col-text");
const rowInput = document.getElementById("row-text");
const showPlayer = document.querySelector("p");
const restart = document.querySelector("button");

mode.oninput = () => {
    numOfRequiredAdjacentCirclesToWin = parseInt(mode.value);
    console.log(numOfRequiredAdjacentCirclesToWin);
}

p1.oninput = () => {
    showPlayerTurn();
};

p2.oninput = () => {
    showPlayerTurn();
};

colSlider.oninput = () => {
    colInput.value = colSlider.value;
    columns = colInput.value;
    removeAllChildNodes(gameBoard);
    setupGameBoard();
};

rowSlider.oninput = () => {
    rowInput.value = rowSlider.value;
    rows = rowInput.value;
    removeAllChildNodes(gameBoard);
    setupGameBoard();
};

colInput.oninput = () => {
    colSlider.value = colInput.value;
    columns = colInput.value;
    removeAllChildNodes(gameBoard);
    setupGameBoard();
};

rowInput.oninput = () => {
    rowSlider.value = rowInput.value;
    rows = rowInput.value;
    removeAllChildNodes(gameBoard);
    setupGameBoard();
};

restart.onclick = () => {
    gameContinue = true;
    const gameOver = document.getElementById("gameOver");
    const gameOverText = document.getElementById("gameOverText");
    gameOver.style.visibility = "hidden";
    gameOver.style.opacity = 0;

    gameOverText.style.visibility = "hidden";
    gameOverText.style.opacity = 0;

    currPlayer = 0;
    showPlayerTurn();

    removeAllChildNodes(gameBoard);
    setupGameBoard();
};

function setupGameBoard() {
    board = [];

    // set board array
    // looks like this:
    // [
    //     [0, 0, 0, 0, 0, 0, 0]
    //     [0, 0, 0, 0, 0, 0, 0]
    //     [0, 0, 0, 0, 0, 0, 0]
    //     [0, 0, 0, 0, 0, 0, 0]
    //     [0, 0, 0, 0, 0, 0, 0]
    //     [0, 0, 0, 0, 0, 0, 0]
    // ]
    for (let i = 0; i < rows; i++) {
        board[i] = Array(columns);
        for (let j = 0; j < columns; j++) {
            board[i][j] = 0;
        }
    }

    linkedBoard = arrayToLinkedList(board);

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const circle = document.createElement("div");
            circle.classList.add("circle");
            gameBoard.appendChild(circle);
        }
    }

    let circles = document.querySelectorAll(".circle");

    circles.forEach((circle) => {
        // for responsiveness purposes regarding the
        // customization of columns and rows
        const newWidth = `${Math.floor(700 / columns)}px`;
        const newHeight = `${Math.floor(600 / rows)}px`;

        // change --circle-width and --circle-height 
        // variable located at main.css
        circle.style.setProperty("--circle-width", newWidth);
        circle.style.setProperty("--circle-height", newHeight);

        circle.addEventListener("click", (e) => {
            const index = Array.prototype.indexOf.call(
                gameBoard.children,
                e.target
            );

            const columnOfCircle = getColumnOfCircle(index);
            addCircleToColumn(columnOfCircle, currPlayer);
            playerMove();
            showPlayerTurn();
        });

        circle.addEventListener("mouseover", (e) => {
            console.log("hello");
            const index = Array.prototype.indexOf.call(
                gameBoard.children,
                e.target
            );

            const columnOfCircle = getColumnOfCircle(index);
            const [rowIndex, columnIndex] =
                getIndexOfPlayableCircle(columnOfCircle);

            const color =
                currPlayer == 0 ? "rgb(255, 255, 190)" : "rgb(255, 190, 190)";

            gameBoard.childNodes[
                columnIndex + rowIndex * columns
            ].style.setProperty("--circle-background", color);
        });

        circle.addEventListener("mouseleave", (e) => {
            const index = Array.prototype.indexOf.call(
                gameBoard.children,
                e.target
            );

            const columnOfCircle = getColumnOfCircle(index);
            const [rowIndex, columnIndex] =
                getIndexOfPlayableCircle(columnOfCircle);

            gameBoard.childNodes[
                columnIndex + rowIndex * columns
            ].style.setProperty("--circle-background", "white");
        });
    });
}

function addCircleToColumn(column, currPlayer) {
    const [rowIndex, columnIndex] = getIndexOfPlayableCircle(column);

    let color = "";
    if (currPlayer === 0) {
        board[rowIndex][columnIndex] = 1;
        linkedBoard[rowIndex].set(columnIndex, 1);
        color = "yellow";
    } else {
        board[rowIndex][columnIndex] = 2;
        linkedBoard[rowIndex].set(columnIndex, 2);
        color = "red";
    }

    gameBoard.childNodes[columnIndex + rowIndex * columns].style.setProperty(
        "--circle-background",
        color
    );
    
    checkWin();
}

function checkWin() {
loop1:
    for (let i = linkedBoard.length - 1; i >= 0; i--) {
        for (let j = 0; j < linkedBoard[i].size; j++) {
            let currNode = linkedBoard[i].get(j);
            if (currPlayer == 0 && currNode.data === 1) {
                let adjacentIndexes = checkIfHasAdjacentNodes(
                    currNode,
                    1,
                    numOfRequiredAdjacentCirclesToWin,
                    [[i, j]]
                );
                if (adjacentIndexes) {
                    gameOver();
                    highlightWonCircles(adjacentIndexes);
                    break loop1;
                }
            } else if (currPlayer == 1 && currNode.data === 2) {
                let adjacentIndexes = checkIfHasAdjacentNodes(
                    currNode,
                    2,
                    numOfRequiredAdjacentCirclesToWin,
                    [[i, j]]
                );
                if (adjacentIndexes) {
                    gameOver();
                    highlightWonCircles(adjacentIndexes);
                    break loop1;
                }
            }
        }
    }
}

function showPlayerTurn() {
    let name = "";
    if (currPlayer === 0) {
        name = p1.value.length === 0 ? "Player 1" : p1.value;
    } else {
        name = p2.value.length === 0 ? "Computer" : p2.value;
    }

    showPlayer.textContent = `${name}'s Turn`;
}

function gameOver() {
    gameContinue = false;
    const gameOver = document.getElementById("gameOver");
    const gameOverText = document.getElementById("gameOverText");

    gameOver.style.visibility = "visible";
    gameOver.style.opacity = 0.9;

    gameOverText.style.visibility = "visible";
    gameOverText.style.opacity = 0.9;

    const playerWon =
        currPlayer == 0
            ? p1.value.length === 0
            ? "Player 1"
            : p1.value
            : p2.value.length === 0
            ? "Computer"    
            : p2.value;
    gameOverText.childNodes[1].textContent = `${playerWon} wins`;
}

function playerMove() {
    if (!gameContinue) 
        return;

    if (currPlayer == 0) {
        currPlayer = 1;
        if (p2.value.length === 0) {
            addCircleToColumn(computerMove(columns), currPlayer);
            currPlayer = 0;
        }
    } else {
        currPlayer = 0;
    }
}

function getIndexOfPlayableCircle(column) {
    for (let i = 0; i < rows; i++) {
        if (board[i][column] === 1 || board[i][column] === 2) {
            return [i - 1, column];
        }
    }

    return [rows - 1, column];
}

function getColumnOfCircle(circleIndex) {
    return circleIndex % columns;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    return true;
}

function highlightWonCircles(indexes) {
    const gameBoard = document.getElementById("gameBoard");
    for (let i = 0; i < indexes.length; i++) {
        gameBoard.childNodes[
            indexes[i][1] + indexes[i][0] * columns
        ].style.setProperty("--circle-zIndex", 2);
    }
}

setupGameBoard();
