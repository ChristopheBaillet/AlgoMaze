let maze = data["25"]["ex-2"]
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const numberOfCellsPerRow = calculateCellSize(maze);
const width = 500;
const height = 500;
const cellSize = Math.floor(width / numberOfCellsPerRow);
const delayInMs = 20;
setup(width, height);

drawPathToExit(BFS(maze, maze[0]))

async function iterativeDFS(maze, start) {
    let stack = [];
    stack.push(start);
    let displayPath = [];

    while (!isEmpty(stack)) {
        let v = stack.pop();
        displayPath.push(v);
        drawPathToExit(displayPath);
        await delay(delayInMs);
        if (!v.visited) {
            v.visited = true;
            if (v.exit) {
                const result = []
                while (v.parent) {
                    result.push(v)
                    v = v.parent;
                }
                result.push(start);
                return result;
            }
        }
        const neighbors = findNeighborsWitouthWalls(v);
        for (let neighbor of neighbors) {
            if (!neighbor.visited) {
                neighbor.parent = v;
                stack.push(neighbor);
            }
        }
    }

    return undefined;
}

async function BFS(maze, start) {
    let queue = [];
    queue.push(start)
    let displayPath = [];

    while (!isEmpty(queue)) {
        let v = queue.splice(0, 1)[0];
        displayPath.push(v);
        drawPathToExit(displayPath)
        await delay(delayInMs)
        if (!v.visited) {
            v.visited = true;
            if (v.exit) {
                const result = []
                while (v.parent) {
                    result.push(v)
                    v = v.parent;
                }
                result.push(start);
                return result;
            }
        }

        const neighbors = findNeighborsWitouthWalls(v);
        for (let neighbor of neighbors) {
            if (!neighbor.visited) {
                neighbor.parent = v;
                queue.push(neighbor);
            }
        }
    }
    return undefined;
}


function findNeighborsWitouthWalls(cell) {
    const neighbors = [];
    for (let i = 0; i < cell.walls.length; i++) {
        if (!cell.walls[i]) {
            let element;
            switch (i) {
                case 0:
                    element = maze[translateCoordonatesToSingle(cell.posX, cell.posY - 1)]
                    break;
                case 1:
                    element = maze[translateCoordonatesToSingle(cell.posX + 1, cell.posY)]
                    break;
                case 2:
                    element = maze[translateCoordonatesToSingle(cell.posX, cell.posY + 1)]
                    break;
                case 3:
                    element = maze[translateCoordonatesToSingle(cell.posX - 1, cell.posY)]
                    break;
            }
            neighbors.push(element);
        }
    }
    return neighbors;
}

function findNeighbours(maze){
    const neighbors = [];

}

function isEmpty(stack) {
    return stack.length === 0
}

function setup(width, height) {
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    drawMaze(maze);
    ctx.closePath();
}

function drawCell(cell) {
    ctx.fillStyle = cell.entrance ? "orange" : cell.exit ? "green" : "black";
    drawWalls(cell);
    ctx.fillRect(cell.posX * cellSize, cell.posY * cellSize, cellSize, cellSize);
}

function drawWalls(cell) {
    for (let i = 0; i < cell.walls.length; i++) {
        ctx.moveTo(cell.posX * cellSize, cell.posY * cellSize);
        drawWall(cell, i);
    }
}

function drawWall(cell, wallIndex) {
    if (cell.walls[wallIndex]) {
        ctx.strokeStyle = "red";
        switch (wallIndex) {
            case 0:
                drawTopWall(cell)
                break;
            case 1:
                drawRightWall(cell)
                break;
            case 2:
                drawBottomWall(cell)
                break;
            case 3:
                drawLeftWall(cell)
                break;
        }
        ctx.stroke();
    }
}


function drawTopWall(cell) {
    ctx.lineTo((cell.posX * cellSize) + cellSize, cell.posY * cellSize);
}

function drawRightWall(cell) {
    ctx.moveTo((cell.posX * cellSize) + cellSize, (cell.posY * cellSize));
    ctx.lineTo((cell.posX * cellSize) + cellSize, (cell.posY * cellSize) + cellSize);
}

function drawBottomWall(cell) {
    ctx.moveTo(cell.posX * cellSize + cellSize, cell.posY * cellSize + cellSize)
    ctx.lineTo(cell.posX * cellSize, (cell.posY * cellSize) + cellSize);
}

function drawLeftWall(cell) {
    ctx.lineTo(cell.posX * cellSize, (cell.posY * cellSize) + cellSize);
}

function drawMaze(maze) {
    maze.forEach((cell) => {
        ctx.moveTo(cell.posX * cellSize, cell.posY * cellSize);
        drawCell(cell);
    })
}

function calculateCellSize(maze) {
    return Math.sqrt(maze.length);
}

function translateCoordonatesToSingle(posX, posY) {
    return (posY * numberOfCellsPerRow) + posX
}

function delay(timeInMs) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, timeInMs);
    })
}

/*
function translateCoordonatesToDuo(index){
    return {
        posX : index % numberOfCellsPerRow,
        posY : Math.floor(index / numberOfCellsPerRow),
    }
}
*/
function drawPathToExit(path) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    const entrance = path[path.length - 1]
    ctx.moveTo(entrance.posX * cellSize + cellSize / 2, entrance.posY * cellSize + cellSize / 2)
    for (let i = path.length - 1; i >= 0; i--) {
        ctx.lineTo((path[i].posX * cellSize) + cellSize / 2, (path[i].posY * cellSize) + cellSize / 2);
    }
    ctx.stroke();
    ctx.closePath();
}

function generateBlankMaze(size) {
    const result = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            result.push({
                posX: j,
                posY: i,
                walls: [
                    true, true, true, true
                ],
                visited: false,
            })
        }
    }

    result[0].entrance = true;
    result[result.length - 1].exit = true;

    return result;
}

function generateMaze(size) {
    const maze = generateBlankMaze(size);
    const stack = [];
    const entrance = findEntrance(maze);
    entrance.visited = true;
    stack.push(entrance);

    while (!isEmpty(stack)) {
        const current = stack.pop();

    }
}

function hasUnvisitedNeighbours(neighbors) {
    for (const neighbor of neighbors) {
        if (neighbor.visited) return true;
    }
    return false;
}

function findEntrance(maze) {
    for (let i = 0; i < maze.length; i++) {
        if (maze[i].entrance) return maze[i];
    }
}

/*
applyGrid(maze)
drawMaze(maze)

function createDiv(box, id){
    const div = document.createElement('div')
    let classes = ["box"];
    const type = box["entrance"] ? "entrance" : box["exit"] ? "exit" : ""
    if (type){
        classes.push(type);
    }
    div.id = id;
    classes.push(...calculateWallsForCSS(box.walls));
    for (let i = 0; i < classes.length; i++){
        div.classList.add(classes[i])
    }
    document.getElementById('maze').append(div)
}

function drawMaze(maze){
    for (let i = 0; i < maze.length; i++){
        createDiv(maze[i], i);
    }
}

function applyGrid(maze){
    let size = Math.sqrt(maze.length);
    const div = document.getElementById('maze');
    div.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    div.style.gridTemplateRows = `repeat${size}, 1fr)`
}

function calculateWallsForCSS(walls){
    let result = [];
    if (walls[0]){
        result.push("top")
    }
    if (walls[1]){
        result.push("right")
    }
    if (walls[2]){
        result.push("bottom")
    }
    if (walls[3]){
        result.push("left")
    }

    return result;
}

*/