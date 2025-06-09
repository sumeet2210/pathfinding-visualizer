function reconstructPath(meetingNode, prevStart, prevEnd) {
    let path = [];
    let node = meetingNode;
    // Path from start to meeting node
    while (node) {
        path.unshift(node);
        node = prevStart[node.row][node.col];
    }
    // Path from meeting node to end (skip meeting node)
    node = prevEnd[meetingNode.row][meetingNode.col];
    while (node) {
        path.push(node);
        node = prevEnd[node.row][node.col];
    }
    return path;
}

export function bidirectionalDijkstra(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visitedStart = Array.from({length: rows}, () => Array(cols).fill(false));
    const visitedEnd = Array.from({length: rows}, () => Array(cols).fill(false));
    const prevStart = Array.from({length: rows}, () => Array(cols).fill(null));
    const prevEnd = Array.from({length: rows}, () => Array(cols).fill(null));
    const distStart = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    const distEnd = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    const queueStart = [];
    const queueEnd = [];
    const visitedNodes = [];

    distStart[start.row][start.col] = 0;
    distEnd[end.row][end.col] = 0;
    queueStart.push({row: start.row, col: start.col, dist: 0});
    queueEnd.push({row: end.row, col: end.col, dist: 0});

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    let meetingNode = null;

    while (queueStart.length && queueEnd.length) {
        // Expand from start
        queueStart.sort((a, b) => a.dist - b.dist);
        const currStart = queueStart.shift();
        if (visitedStart[currStart.row][currStart.col]) continue;
        visitedStart[currStart.row][currStart.col] = true;
        visitedNodes.push({row: currStart.row, col: currStart.col, side: 'start'});

        if (visitedEnd[currStart.row][currStart.col]) {
            meetingNode = {row: currStart.row, col: currStart.col};
            break;
        }

        for (const [dr, dc] of directions) {
            const nr = currStart.row + dr, nc = currStart.col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visitedStart[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                if (distStart[currStart.row][currStart.col] + 1 < distStart[nr][nc]) {
                    distStart[nr][nc] = distStart[currStart.row][currStart.col] + 1;
                    prevStart[nr][nc] = {row: currStart.row, col: currStart.col};
                    queueStart.push({row: nr, col: nc, dist: distStart[nr][nc]});
                }
            }
        }

        // Expand from end
        queueEnd.sort((a, b) => a.dist - b.dist);
        const currEnd = queueEnd.shift();
        if (visitedEnd[currEnd.row][currEnd.col]) continue;
        visitedEnd[currEnd.row][currEnd.col] = true;
        visitedNodes.push({row: currEnd.row, col: currEnd.col, side: 'end'});

        if (visitedStart[currEnd.row][currEnd.col]) {
            meetingNode = {row: currEnd.row, col: currEnd.col};
            break;
        }

        for (const [dr, dc] of directions) {
            const nr = currEnd.row + dr, nc = currEnd.col + dc;
            if (
                nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !visitedEnd[nr][nc] && grid[nr][nc] !== 'wall'
            ) {
                if (distEnd[currEnd.row][currEnd.col] + 1 < distEnd[nr][nc]) {
                    distEnd[nr][nc] = distEnd[currEnd.row][currEnd.col] + 1;
                    prevEnd[nr][nc] = {row: currEnd.row, col: currEnd.col};
                    queueEnd.push({row: nr, col: nc, dist: distEnd[nr][nc]});
                }
            }
        }
    }

    let shortestPath = [];
    if (meetingNode) {
        shortestPath = reconstructPath(meetingNode, prevStart, prevEnd);
    }
    return {visitedNodes, shortestPath};
}
