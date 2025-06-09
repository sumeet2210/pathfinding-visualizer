// This file contains the main JavaScript logic for the pathfinding visualizer. 
// It handles user interactions, grid rendering, and integrates the selected pathfinding algorithms.

const grid = document.getElementById('grid');
const algorithmSelect = document.getElementById('algorithm');
const clearButton = document.getElementById('clear');
const visualizeButton = document.getElementById('visualize');
const addStartNodeButton = document.getElementById('add-start-node');
const addEndNodeButton = document.getElementById('add-end-node');
const speedSelect = document.getElementById('speed');
const darkModeToggle = document.getElementById('darkModeToggle');

let gridData = [];
let startNode = null;
let endNode = null;
let isMouseDown = false;
let selectMode = null; // 'start' | 'end' | null

function createGrid() {
    // Calculate grid dimensions based on available screen space
    const headerHeight = document.querySelector('header').offsetHeight;
    const controlsHeight = document.querySelector('.node-selection').offsetHeight;
    const availableHeight = window.innerHeight - headerHeight - controlsHeight - 20;
    const availableWidth = window.innerWidth - 20; // Take into account the padding

    const maxNodeSize = 25;
    let nodeSize = Math.min(availableWidth / 60, availableHeight / 30, maxNodeSize);

    const rows = Math.floor(availableHeight / nodeSize);
    const cols = Math.floor(availableWidth / nodeSize);

    grid.style.display = 'grid';
    grid.style.gridTemplateRows = `repeat(${rows}, ${nodeSize}px)`;
    grid.style.gridTemplateColumns = `repeat(${cols}, ${nodeSize}px)`;
    grid.style.gap = '0';
    grid.style.background = 'transparent';
    grid.style.width = `${cols * nodeSize}px`;
    grid.style.height = `${rows * nodeSize}px`;
    grid.style.userSelect = 'none';
    grid.innerHTML = '';
    gridData = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const node = document.createElement('div');
            node.classList.add('node');
            node.dataset.row = i;
            node.dataset.col = j;
            node.style.width = `${nodeSize}px`;
            node.style.height = `${nodeSize}px`;
            node.style.border = 'none';
            node.style.background = '#fff';
            node.style.boxSizing = 'border-box';
            node.style.cursor = 'pointer';
            node.addEventListener('click', () => selectNode(i, j));
            node.addEventListener('mousedown', (e) => {
                if (selectMode) return;
                isMouseDown = true;
                toggleWall(i, j);
                e.preventDefault();
            });
            node.addEventListener('mouseover', (e) => {
                if (isMouseDown && !selectMode) {
                    toggleWall(i, j);
                }
            });
            grid.appendChild(node);
        }
    }
    // Listen for mouseup on the whole document (only once)
    if (!createGrid.mouseUpListenerAdded) {
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        createGrid.mouseUpListenerAdded = true;
    }
    renderGrid();
}

// Toggle wall: add if empty, remove if wall
function toggleWall(row, col) {
    // Prevent walling start/end nodes
    if (
        (startNode && startNode.row === row && startNode.col === col) ||
        (endNode && endNode.row === row && endNode.col === col)
    ) {
        return;
    }
    gridData[row][col] = gridData[row][col] === 'wall' ? 0 : 'wall';
    renderGrid();
}

function selectNode(row, col) {
    if (selectMode === 'start') {
        if (startNode) gridData[startNode.row][startNode.col] = 0;
        startNode = { row, col };
        gridData[row][col] = 'start';
        selectMode = null;
    } else if (selectMode === 'end') {
        if (endNode) gridData[endNode.row][endNode.col] = 0;
        endNode = { row, col };
        gridData[row][col] = 'end';
        selectMode = null;
    } else {
        // Prevent walling start/end nodes
        if (
            (startNode && startNode.row === row && startNode.col === col) ||
            (endNode && endNode.row === row && endNode.col === col)
        ) {
            return;
        }
        gridData[row][col] = gridData[row][col] === 'wall' ? 0 : 'wall';
    }
    renderGrid();
}

function renderGrid() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        const row = node.dataset.row;
        const col = node.dataset.col;
        node.className = 'node';
        // Reset background for all nodes
        node.style.background = '#fff';
        if (gridData[row][col] === 'start') {
            node.classList.add('start');
            node.style.background = '#4caf50'; // green
        } else if (gridData[row][col] === 'end') {
            node.classList.add('end');
            node.style.background = '#f44336'; // red
        } else if (gridData[row][col] === 'wall') {
            node.classList.add('wall');
            node.style.background = '#222'; // dark wall
        }
    });
}

function clearGrid() {
    gridData = [];
    startNode = null;
    endNode = null;
    createGrid(20, 20); // Example grid size
}

// Add a message element for user feedback
let messageDiv = document.getElementById('message');
if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    messageDiv.style.margin = '10px 0';
    messageDiv.style.color = '#d32f2f';
    messageDiv.style.fontWeight = 'bold';
    grid.parentNode.insertBefore(messageDiv, grid);
}

function showMessage(msg) {
    messageDiv.textContent = msg;
}

function clearMessage() {
    messageDiv.textContent = '';
}

function visualizePathfinding() {
    // Show message if start or end node is not selected
    if (!startNode && !endNode) {
        showMessage('Start node and End node are not selected!');
        return;
    }
    if (!startNode) {
        showMessage('Start node is not selected!');
        return;
    }
    if (!endNode) {
        showMessage('End node is not selected!');
        return;
    }
    clearMessage();
    const algorithm = algorithmSelect.value;
    switch (algorithm) {
        case 'dijkstra':
            const {visitedNodes, shortestPath} = dijkstra(gridData, startNode, endNode);
            animateDijkstra(visitedNodes, shortestPath);
            break;
        case 'bfs':
            const {visitedNodes: bfsVisited, shortestPath: bfsPath} = bfs(gridData, startNode, endNode);
            animateDijkstra(bfsVisited, bfsPath);
            break;
        case 'dfs':
            const {visitedNodes: dfsVisited, shortestPath: dfsPath} = dfs(gridData, startNode, endNode);
            animateDijkstra(dfsVisited, dfsPath);
            break;
        case 'astar':
            const {visitedNodes: astarVisited, shortestPath: astarPath} = astar(gridData, startNode, endNode);
            animateDijkstra(astarVisited, astarPath);
            break;
        default:
            break;
    }
}

// Dijkstra's algorithm implementation
function dijkstra(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({length: rows}, () => Array(cols).fill(false));
    const distance = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    const prev = Array.from({length: rows}, () => Array(cols).fill(null));
    const visitedNodes = [];
    const pq = [];

    distance[start.row][start.col] = 0;
    pq.push({row: start.row, col: start.col, dist: 0});

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    while (pq.length > 0) {
        // Get node with smallest distance
        pq.sort((a, b) => a.dist - b.dist);
        const {row, col, dist} = pq.shift();
        if (visited[row][col]) continue;
        visited[row][col] = true;
        visitedNodes.push({row, col});

        if (row === end.row && col === end.col) break;

        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                if (distance[row][col] + 1 < distance[nr][nc]) {
                    distance[nr][nc] = distance[row][col] + 1;
                    prev[nr][nc] = {row, col};
                    pq.push({row: nr, col: nc, dist: distance[nr][nc]});
                }
            }
        }
    }

    // Reconstruct shortest path
    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}

function animateDijkstra(visitedNodes, shortestPath) {
    let animationSpeed = parseInt(speedSelect.value);
    for (let i = 0; i < visitedNodes.length; i++) {
        setTimeout(() => {
            const {row, col} = visitedNodes[i];
            const node = document.querySelector(`.node[data-row="${row}"][data-col="${col}"]`);
            if (
                gridData[row][col] !== 'start' &&
                gridData[row][col] !== 'end'
            ) {
                node.classList.add('visited');
            }
            if (i === visitedNodes.length - 1) {
                animateShortestPath(shortestPath);
            }
        }, animationSpeed * i);
    }
}

function animateShortestPath(path) {
    let animationSpeed = parseInt(speedSelect.value);
    for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
            const {row, col} = path[i];
            const node = document.querySelector(`.node[data-row="${row}"][data-col="${col}"]`);
            if (
                gridData[row][col] !== 'start' &&
                gridData[row][col] !== 'end'
            ) {
                node.classList.add('shortest-path');
            }
        }, animationSpeed * i);
    }
}

// Breadth-First Search (BFS) implementation
function bfs(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({length: rows}, () => Array(cols).fill(false));
    const prev = Array.from({length: rows}, () => Array(cols).fill(null));
    const visitedNodes = [];
    const queue = [];

    queue.push({row: start.row, col: start.col});
    visited[start.row][start.col] = true;

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    while (queue.length > 0) {
        const {row, col} = queue.shift();
        visitedNodes.push({row, col});

        if (row === end.row && col === end.col) break;

        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                visited[nr][nc] = true;
                prev[nr][nc] = {row, col};
                queue.push({row: nr, col: nc});
            }
        }
    }

    // Reconstruct shortest path
    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}

// Depth-First Search (DFS) implementation
function dfs(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({length: rows}, () => Array(cols).fill(false));
    const prev = Array.from({length: rows}, () => Array(cols).fill(null));
    const visitedNodes = [];
    let found = false;

    function dfsVisit(row, col) {
        if (
            row < 0 || row >= rows ||
            col < 0 || col >= cols ||
            visited[row][col] ||
            grid[row][col] === 'wall' ||
            found
        ) {
            return;
        }
        visited[row][col] = true;
        visitedNodes.push({row, col});
        if (row === end.row && col === end.col) {
            found = true;
            return;
        }
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];
        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                prev[nr][nc] = {row, col};
                dfsVisit(nr, nc);
            }
        }
    }

    dfsVisit(start.row, start.col);

    // Reconstruct path
    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}

// A* (A-star) algorithm implementation
function astar(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({length: rows}, () => Array(cols).fill(false));
    const distance = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    const prev = Array.from({length: rows}, () => Array(cols).fill(null));
    const visitedNodes = [];
    const pq = [];

    function heuristic(a, b) {
        // Manhattan distance
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    distance[start.row][start.col] = 0;
    pq.push({
        row: start.row,
        col: start.col,
        f: heuristic(start, end)
    });

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    while (pq.length > 0) {
        // Get node with smallest f value
        pq.sort((a, b) => a.f - b.f);
        const {row, col} = pq.shift();
        if (visited[row][col]) continue;
        visited[row][col] = true;
        visitedNodes.push({row, col});

        if (row === end.row && col === end.col) break;

        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visited[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                const tentative_g = distance[row][col] + 1;
                if (tentative_g < distance[nr][nc]) {
                    distance[nr][nc] = tentative_g;
                    prev[nr][nc] = {row, col};
                    pq.push({
                        row: nr,
                        col: nc,
                        f: tentative_g + heuristic({row: nr, col: nc}, end)
                    });
                }
            }
        }
    }

    // Reconstruct shortest path
    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}

// Add event listeners for select mode on the new buttons
addStartNodeButton.addEventListener('click', () => {
    selectMode = 'start';
});
addEndNodeButton.addEventListener('click', () => {
    selectMode = 'end';
});

clearButton.addEventListener('click', clearGrid);
visualizeButton.addEventListener('click', visualizePathfinding);

// Dark mode functionality
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', null);
}

// Check local storage for dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
    darkModeToggle.checked = true;
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

createGrid(20, 20); // Example grid size on initialization