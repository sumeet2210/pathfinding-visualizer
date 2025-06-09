export function dfs(grid, start, end) {
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

    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}
