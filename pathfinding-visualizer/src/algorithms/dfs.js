function dfs(grid, startNode, endNode) {
    const stack = [startNode];
    const visitedNodes = [];
    const path = [];
    const cameFrom = {};

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (currentNode === endNode) {
            let tempNode = endNode;
            while (tempNode) {
                path.push(tempNode);
                tempNode = cameFrom[tempNode];
            }
            return path.reverse();
        }

        if (!visitedNodes.includes(currentNode)) {
            visitedNodes.push(currentNode);
            const neighbors = getNeighbors(currentNode, grid);

            for (const neighbor of neighbors) {
                if (!visitedNodes.includes(neighbor)) {
                    stack.push(neighbor);
                    cameFrom[neighbor] = currentNode;
                }
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

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}

export default dfs;