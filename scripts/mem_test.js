const numNodes = 16; // Equal to # of levels
const defaultBoard = [];
for (let i = 1; i <= numNodes; i++) {
    defaultBoard.push(i);
}

let nodeOrder = [];
let currentOrder = 0;
let level = 2;
let gameOver = false;
let firstNodeClicked = false;
let leveltemp = 0;

// Given image
let image = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
];
function splitGameField() {
    // Here you can write logic to split the game field into two sections
    // For example, you can create another <div> and append it to the main container
    // or you can modify the existing game field div to occupy only half of the width
}

$(document).ready(function() {
    let startButton = $("#start-button");
    let startButtonContainer = $("#start-button-container");

    // Hide "Start" button when pressed
    startButtonContainer.on("click", "#start-button", function() {
        startButton.hide();
        startGame();
    });

    /*
    Handle when a valid node is clicked. Delegate event to gameBoard div since
    templated elements don't have event handlers.
    */
    $('#game-board').on("click", ".node", function() {
        if (gameOver) return; // Ignore clicks when the game is over

        let id = $(this).attr("id");
        let node = document.getElementById(id);

        if (node.classList.contains("node-f")) {
            endGame(level);
            startButton.show();
            gameOver = true;
            return;
        }

        node.className = "node-clicked"; // Change class to indicate node has been clicked
        node.innerText = (0).toString();

        // Check if all nodes have been clicked
        if ($('.node-t').length === 0) {
            level++;
            firstNodeClicked = false;
            // End game if max score beat
            if (level > numNodes) {
                endGame(level);
                startButton.show();
                return;
            }
            playLevel(defaultBoard.slice());
        }
    });

    function startGame() {
        resetAll();
        let roll = defaultBoard.slice();
        // Template the blank nodes before starting game loop
        emptyBoard(defaultBoard);
        playLevel(roll);
    }
});

/* Main game loop */
function playLevel(nodeNums) {
    let rollCopy = nodeNums.slice();
    let nextNodeOrder = generateNextLevel(level, rollCopy);
    nodeOrder = nextNodeOrder;
    renderLevelBoard(nextNodeOrder);
}



function generateNextLevel(levelNum, nodeNums) {
    emptyBoard(defaultBoard);
    let nodesToRender = [];
    let image = [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
    ];
	
	// Split the image into 4x4 sections
	const sections = splitImageIntoSections(image);

/*
    // Iterate through the image and add nodes at positions where there are pixels with value 1
    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
            // If the pixel value is 1, add the corresponding node number
            if (image[y][x] === 1) {
                // Add the node number at position (x, y) to the nodesToRender array
                nodesToRender.push(nodeNums[x + y * image[y].length]);
                levelNum--; // Decrease the level count
            }
        }
    }
	*/
	sections.sort((a, b) => countOnes(a) - countOnes(b));
	for(let y = 0; y < sections[leveltemp].length; y++)
	{
		for (let x = 0; x < sections[leveltemp][y].length; x++)
		{
			if(sections[leveltemp][y][x] === 1)
			{
				nodesToRender.push(nodeNums[x+y*sections[leveltemp][y].length]);
				levelNum--;
			}
			
		}
		
	}
	leveltemp++;
    return nodesToRender;
}


/* Game helper functions */
/*
function generateNextLevel(levelNum, nodeNums) {
    emptyBoard(defaultBoard);
    let nodesToRender = [];
    let imageWidth = 16; // Width of your image (assuming it's a 16x16 image)
    let imageHeight = 16; // Height of your image

    // Assuming your image is represented as a two-dimensional array of pixel values
	    let image = [
		[0,0,0,1],
		[1,1,1,1],
		[1,1,1,0],
		[0,1,0,0]
];
	/*
    let image = [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
    ];
	*//*
    // Determine the number of nodes to render based on the level
    let nodesCount = Math.min(levelNum, nodeNums.length);
    let hasPixelWithValueOne = false; // Flag to track if the 4x4 section contains a pixel with a value of 1

    // Loop through the image pixels to determine the nodes to render and check if the 4x4 section contains a pixel with a value of 1
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let pixelValue = image[y][x];
            if (pixelValue === 1 && nodesCount > 0) {
                nodesToRender.push(nodeNums.pop());
                nodesCount--;
                hasPixelWithValueOne = true;
            }
        }
    }

    // If the 4x4 section doesn't contain any pixel with a value of 1, skip rendering nodes
    if (!hasPixelWithValueOne) {
        nodesToRender = [];
    }

    // Fill in remaining nodes if the level requires more nodes than the image provides
    while (nodesCount > 0) {
        nodesToRender.push(nodeNums.pop());
        nodesCount--;
    }

    return nodesToRender;
}
*/



function renderLevelBoard(boardNodes) {
    for (let i = 0; i < boardNodes.length; i++) {
        let boardNode = document.getElementById(boardNodes[i].toString());
        let originalClass = boardNode.className; // Store the original class name

        // Set the initial class and text content
        boardNode.className = "node node-t-alternate";
        boardNode.innerText = (i + 1).toString();

        // Disable click events for the first second
        boardNode.style.pointerEvents = "none";

        // Switch colors after a delay
        setTimeout(function() {
            // Toggle between two classes to switch colors
            if (boardNode.classList.contains("node-t-alternate")) {
                boardNode.classList.remove("node-t-alternate");
                boardNode.classList.add("node-t");
            } else {
                boardNode.classList.remove("node-f");
                boardNode.classList.add("node-t");
            }

            // Re-enable click events after switching colors
            boardNode.style.pointerEvents = "auto";
        }, 1 * 1000); // Switch colors after 1 second       
    }
}


function emptyBoard(board) {
    let templateString = "";
    let gameBoard = document.getElementById("game-board");
    let gameMessage = document.getElementById("game-message");

    for (let i = 0; i < board.length; i++) {
        templateString += "<button class=\"node node-f\" id=" + (i + 1) + "> 0 </button>";
    }
    gameBoard.innerHTML = templateString;
    gameMessage.innerHTML = "";
}

function endGame(score) {
    let gameBoard = document.getElementById("game-board");
    let gameMessage = document.getElementById("game-message");

    gameBoard.innerHTML = "";
    if (score > 25) {
        gameMessage.innerHTML =
            "<h2> You have reached the maximum score of " + (score - 1).toString() + "</h2>";
    } else {
        gameMessage.innerHTML =
            "<h2> Your score is " + (score - 1).toString() + ". Try again to beat your score! </h2>";
    }
}

function resetAll() {
    nodeOrder = [];
    currentOrder = 0;
    level = 2;
    gameOver = false;
    firstNodeClicked = false;
}


function splitImageIntoSections(image) {
    const sections = [];

    // Iterate over the image in steps of 4 pixels both horizontally and vertically
    for (let y = 0; y < image.length; y += 4) {
        for (let x = 0; x < image[y].length; x += 4) {
            const section = [];

            // Extract a 4x4 section from the image
            for (let offsetY = 0; offsetY < 4; offsetY++) {
                const row = [];
                for (let offsetX = 0; offsetX < 4; offsetX++) {
                    // Handle edge case where the image dimensions might not be divisible by 4
                    const pixelValue = (image[y + offsetY] && image[y + offsetY][x + offsetX]) || 0;
                    row.push(pixelValue);
                }
                section.push(row);
            }
            sections.push(section);
        }
    }
    return sections;
}

function isEmptySection(section) {
    return section.every(row => row.every(pixel => pixel === 0));
}

function countOnes(section) {
    let count = 0;
    for (let row of section) {
        for (let pixel of row) {
            if (pixel === 1) {
                count++;
            }
        }
    }
    return count;
}