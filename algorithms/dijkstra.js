export function dijkstra(grid, start, end) {
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

    let path = [];
    let curr = (visited[end.row][end.col]) ? {row: end.row, col: end.col} : null;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr.row][curr.col];
    }
    return {visitedNodes, shortestPath: path};
}
