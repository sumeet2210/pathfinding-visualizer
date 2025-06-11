// This file contains the main JavaScript logic for the pathfinding visualizer. 
// It handles user interactions, grid rendering, and integrates the selected pathfinding algorithms.

import createMaze from './mazegenerators/recursive.js';
import { bidirectionalDijkstra } from './algorithms/bidirectional.js';
import { dfs } from './algorithms/dfs.js';
import { dijkstra } from './algorithms/dijkstra.js';
import { bfs } from './algorithms/bfs.js';
import { astar } from './algorithms/astar.js';
import recursiveDivisionMaze from './mazegenerators/recursive.js';
import randomMaze from './mazegenerators/randommaze.js';


const grid = document.getElementById('grid');
const algorithmSelect = document.getElementById('algorithm');
const clearButton = document.getElementById('clear');
const visualizeButton = document.getElementById('visualize');
const addStartNodeButton = document.getElementById('add-start-node');
const addEndNodeButton = document.getElementById('add-end-node');
const speedSelect = document.getElementById('speed');
const darkModeToggle = document.getElementById('darkModeToggle');
const generateMazeButton = document.getElementById('generateMaze');

let gridData = [];
let startNode = null;
let endNode = null;
let isMouseDown = false;
let selectMode = null; // 'start' | 'end' | null
let isRunning = false;
let animationTimeouts = [];

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
    // Stop any running animation
    if (isRunning) {
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
        animationTimeouts = [];
        isRunning = false;
    }
    
    // Clear the grid
    gridData = [];
    startNode = null;
    endNode = null;
    createGrid();
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
            animatePathfinding(visitedNodes, shortestPath);
            break;
        case 'bfs':
            const {visitedNodes: bfsVisited, shortestPath: bfsPath} = bfs(gridData, startNode, endNode);
            animatePathfinding(bfsVisited, bfsPath);
            break;
        case 'dfs':
            const {visitedNodes: dfsVisited, shortestPath: dfsPath} = dfs(gridData, startNode, endNode);
            animatePathfinding(dfsVisited, dfsPath);
            break;
        case 'astar':
            const {visitedNodes: astarVisited, shortestPath: astarPath} = astar(gridData, startNode, endNode);
            animatePathfinding(astarVisited, astarPath);
            break;
        case 'bidijkstra':
            const {visitedNodes: biVisited, shortestPath: biPath} = bidirectionalDijkstra(gridData, startNode, endNode);
            animatePathfinding(biVisited, biPath);
            break;
        default:
            break;
    }
}

function animatePathfinding(visitedNodes, shortestPath) {
    isRunning = true;
    for (let i = 0; i < visitedNodes.length; i++) {
        const timeout = setTimeout(() => {
            const {row, col} = visitedNodes[i];
            const node = document.querySelector(`.node[data-row="${row}"][data-col="${col}"]`);
            if (
                gridData[row][col] !== 'start' &&
                gridData[row][col] !== 'end'
            ) {
                node.classList.add('visited');
            }
            if (i === visitedNodes.length - 1) {
                if (shortestPath.length === 0) {
                    showNoPathPopup();
                    isRunning = false;
                } else {
                    animateShortestPath(shortestPath);
                }
            }
        }, speedSelect.value * i);
        animationTimeouts.push(timeout);
    }
}

function animateShortestPath(path) {
    for (let i = 0; i < path.length; i++) {
        const timeout = setTimeout(() => {
            const {row, col} = path[i];
            const node = document.querySelector(`.node[data-row="${row}"][data-col="${col}"]`);
            if (
                gridData[row][col] !== 'start' &&
                gridData[row][col] !== 'end'
            ) {
                node.classList.add('shortest-path');
            }
            if (i === path.length - 1) {
                isRunning = false;
            }
        }, speedSelect.value * i);
        animationTimeouts.push(timeout);
    }
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

function animateMazeWalls(walls, callback) {
    let i = 0;
    isRunning = true;
    function next() {
        if (!isRunning) return;
        if (i >= walls.length) {
            isRunning = false;
            if (callback) callback();
            return;
        }
        const { row, col } = walls[i];
        if (
            gridData[row] &&
            gridData[row][col] !== 'start' &&
            gridData[row][col] !== 'end'
        ) {
            gridData[row][col] = 'wall';
            renderGrid();
        }
        i++;
        const timeout = setTimeout(next, 10); // Adjust speed here (ms)
        animationTimeouts.push(timeout);
    }
    next();
}

function generateMaze() {
    const mazeType = document.getElementById('maze').value;

    if (mazeType === 'recursive') {
        clearGrid();
        const rows = gridData.length;
        const cols = gridData[0].length;

        const walls = recursiveDivisionMaze(rows, cols);

        // Animate wall creation
        animateMazeWalls(walls);
    } else if (mazeType === 'random') {
        // Implement random maze generation
        // ...existing random maze code if any...
    } else if (mazeType === 'staircase') {
        // Implement staircase maze generation
        // ...existing staircase code if any...
    }
}

// Popup handling
function showNoPathPopup() {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('noPathPopup').classList.add('show');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('noPathPopup').classList.remove('show');
}

// Add this to window object to make it accessible from HTML
window.closePopup = closePopup;

// Close popup when clicking outside of it
window.addEventListener('click', (event) => {
    const popup = document.getElementById('noPathPopup');
    if (event.target === popup) {
        popup.classList.remove('show');
    }
});

// Clear current walls but keep start/end nodes
if (generateMazeButton) {
    generateMazeButton.addEventListener('click', () => {
        // Clear current walls but keep start/end nodes
        for (let i = 0; i < gridData.length; i++) {
            for (let j = 0; j < gridData[0].length; j++) {
                if (gridData[i][j] === 'wall') {
                    gridData[i][j] = 0;
                }
            }
        }
        renderGrid();

        const rows = gridData.length;
        const cols = gridData[0].length;
        const mazeType = document.getElementById('maze').value;
        const speed = Number(speedSelect.value);

        let walls = [];
        if (mazeType === 'recursive') {
            walls = recursiveDivisionMaze(rows, cols);
        } else if (mazeType === 'random') {
            walls = randomMaze(rows, cols, 0.33);
        } else if (mazeType === 'staircase') {
            // Simple staircase pattern
            for (let i = 1; i < Math.min(rows, cols) - 1; i++) {
                walls.push({ row: i, col: i });
            }
        }

        let idx = 0;
        function animate() {
            if (idx >= walls.length) return;
            const { row, col } = walls[idx];
            if (
                (!startNode || row !== startNode.row || col !== startNode.col) &&
                (!endNode || row !== endNode.row || col !== endNode.col)
            ) {
                gridData[row][col] = 'wall';
                renderGrid();
            }
            idx++;
            setTimeout(animate, speed);
        }
        animate();
    });
}