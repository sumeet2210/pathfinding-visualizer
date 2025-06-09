// A* (A-star) algorithm implementation for grid pathfinding
function astar(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const distance = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
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
        const { row, col } = pq.shift();
        if (visited[row][col]) continue;
        visited[row][col] = true;
        visitedNodes.push({ row, col });

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
                    prev[nr][nc] = { row, col };
                    pq.push({
                        row: nr,
                        col: nc,
                        f: tentative_g + heuristic({ row: nr, col: nc }, end)
                    });
                }
            }
        }
    }

    // Reconstruct shortest path
    let path = [];
    let curr = (visited[end.row][end.col]) ? { row: end.row, col: end.col } : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return { visitedNodes, shortestPath: path };
}

// Export for use in app.js
export default astar;
