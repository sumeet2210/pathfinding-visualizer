function bfs(grid, startNode, endNode) {
    const queue = [];
    const visitedNodes = [];
    const previousNodes = {};
    
    queue.push(startNode);
    visitedNodes.push(startNode);
    
    while (queue.length > 0) {
        const currentNode = queue.shift();
        
        if (currentNode === endNode) {
            return reconstructPath(previousNodes, endNode);
        }
        
        const neighbors = getNeighbors(currentNode, grid);
        
        for (const neighbor of neighbors) {
            if (!visitedNodes.includes(neighbor)) {
                visitedNodes.push(neighbor);
                previousNodes[neighbor] = currentNode;
                queue.push(neighbor);
            }
        }
    }
    
    return []; // Return an empty path if no path is found
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    
    const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 },  // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }   // Right
    ];
    
    for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;
        
        if (isValidNode(newRow, newCol, grid)) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    
    return neighbors;
}

function isValidNode(row, col, grid) {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && !grid[row][col].isWall;
}

function reconstructPath(previousNodes, endNode) {
    const path = [];
    let currentNode = endNode;
    
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode];
    }
    
    return path;
}

export default bfs;