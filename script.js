$(document).ready(() => {
    // Initialize the array
    let gameMap = [];
    // Initialize the turn
    let currentPlayer = "red";

    // Get the current situation of the table into an array for better operating with JS
    function getCurrentMap() {
        let rows = Array.from(document.querySelector(".gameContainer").children);
        rows.forEach((itemRow, indexRow) => {
            // We have to initialize each row as an array before assigning the values
            gameMap[indexRow] = [];
            let cols = Array.from(itemRow.children);
            cols.forEach((itemCol, indexCol) => {
                if([...itemCol.classList].includes("red")) {
                    gameMap[indexRow][indexCol] = "r";
                } else if ([...itemCol.classList].includes("blue")){
                    gameMap[indexRow][indexCol] = "b";
                } else {
                    gameMap[indexRow][indexCol] = "e";
                }
            });
        });
    };

    // Game Screen Functions 
    // ---------------------
    // Reset the game container
    function resetGameContainer() {
        // Get all colored cells and delete
        $(".red").removeClass("red");
        $(".blue").removeClass("blue");
        $(".turnTextRed").css("display", "block");
        $(".turnTextBlue").css("display", "none");
        $(".col").css("cursor", "pointer");
        currentPlayer = "red";
        getCurrentMap();
    }
    // Reset the scores
    function resetScores() {
        $(".redScoreText").html("0");
        $(".blueScoreText").html("0");
    }
    // Start the game
    function startGame() {
        $(".playOverlay").css("display", "none");
        $(".turnTextRed").css("display", "block");
    }
    // Play again
    function playAgain() {
        resetGameContainer();
        $(".restartOverlay").css("display", "none");
    }
    // Reset everything to start over
    function resetGame() {
        resetGameContainer();
        resetScores();
        $(".restartOverlay").css("display", "none");
        $(".playOverlay").css("display", "flex");
    }
    // ---------------------

    // Helper Functions
    // ---------------------
    // Function to get the row of the current cell
    function getRow(element) {
        return element.parent().attr("class").split(" ")[1] - 1;
    }
    // Function to get the column of the current cell
    function getCol(element) {
        return element.attr("class").split(" ")[1] - 1;
    }
    // Function to fill the cell
    function fillCell(cell) {
        cell.addClass(currentPlayer);
        cell.css("cursor", "not-allowed");
    }
    // Function set the winning condition
    function afterWinning(winner) {
        $(".upperRestart").html(`${winner.toUpperCase()} wins the round!`);
        $(".restartOverlay").css("display", "flex");

        if(winner === "red") {
            $(".redScoreText").html(parseInt($(".redScoreText").html()) + 1);
        } else {
            $(".blueScoreText").html(parseInt($(".blueScoreText").html()) + 1)
        }
    }
    // Function to switch turn
    function switchTurn() {
        if(currentPlayer === "red") {
            currentPlayer = "blue";
            $(".turnTextRed").css("display", "none");
            $(".turnTextBlue").css("display", "block");
        } else {
            currentPlayer = "red";
            $(".turnTextRed").css("display", "block");
            $(".turnTextBlue").css("display", "none");
        }
    }

    // Conditional check functions
    // ---------------------
    // Check if the cell is empty or colored
    function checkIsFull(cell) {
        return cell.hasClass("red") || cell.hasClass("blue");
    }
    // Check the condition of column to push the cell to bottom
    function checkIsUpper(indexRow, indexCol) {
        return gameMap.map(item => item[indexCol]).slice(indexRow + 1).some(item => item === "e");
    }
    // Check rows for the given color
    function checkRows(color) {
        for(let indexRow = 0; indexRow < gameMap.length; indexRow++) {
            for(let indexCol = 0; indexCol < gameMap[indexRow].length; indexCol++) {
                if(gameMap[indexRow][indexCol] === color && indexCol < gameMap[indexRow].length - 4) {
                    return gameMap[indexRow].slice(indexCol, indexCol + 5).every(item => item === color);
                }
            }
        }
    }
    // Check columns for the given color
    function checkColumns(color) {
        for(let indexRow = 0; indexRow < gameMap.length; indexRow++) {
            for(let indexCol = 0; indexCol < gameMap[indexRow].length; indexCol++) {
                if(gameMap[indexRow][indexCol] === color && indexRow < gameMap.length - 4) {
                    return gameMap.map(item => item[indexCol]).slice(indexRow, indexRow + 5).every(item => item === color);
                }
            }
        }
    }
    // Check diagonal for the given color
    function checkDiagonals(color) {
        for(let indexRow = 0; indexRow < gameMap.length; indexRow++) {
            for(let indexCol = 0; indexCol < gameMap[indexRow].length; indexCol++) {
                // Check negative slope diagonals
                if(gameMap[indexRow][indexCol] === color && indexCol < gameMap[indexRow].length - 4 && indexRow < gameMap.length - 4) {
                    let diagonal = [];
                    for(let i = 0; i < 5; i++) {
                        diagonal.push(gameMap[indexRow + i][indexCol + i]);
                    }
                    return diagonal.every(item => item === gameMap[indexRow][indexCol])
                }
                
                // Check positive slope diagonals
                if(gameMap[indexRow][indexCol] === color && indexCol > 3 && indexRow < gameMap.length - 4) {
                    let diagonal = [];
                    for(let i = 0; i < 5; i++) {
                        diagonal.push(gameMap[indexRow + i][indexCol - i]);
                    }
                    return diagonal.every(item => item === gameMap[indexRow][indexCol]);
                }
            }
        }
    }
    // Check the winning condition
    function checkWinning(color) {
        return checkRows(color) || checkColumns(color) || checkDiagonals(color);
    }

    function handleEventListenerSet() {
        // Start the game when user clicks the play button
        $(".lowerPlay").on("click", startGame);
        // Reset the game when user clicks reset button
        $(".restartGame").on("click", resetGame);
        // Continue playing when user clicks play again button
        $(".playAgain").on("click", playAgain);


        // When user clicks a cell
        $(".col").on("click", function () {
            // Check if the cell is empty
            if(checkIsFull($(this))) {
                console.log("Cell is full!");
            } else {
                if(!checkIsUpper(getRow($(this)), getCol($(this)))) {
                    fillCell($(this));
                    getCurrentMap();
                    checkWinning(currentPlayer[0]) ? afterWinning(currentPlayer) : "";
                    switchTurn();
                } else {
                    alert("You have empty cells below!");
                }
            }
        });
    }

    (function init() {
        resetGame();
        handleEventListenerSet();
    })();
});