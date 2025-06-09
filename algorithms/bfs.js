export function bfs(grid, start, end) {
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

    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}
