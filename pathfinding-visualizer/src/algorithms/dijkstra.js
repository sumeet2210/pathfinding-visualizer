function dijkstra(grid, startNode, endNode) {
    const visitedNodes = [];
    const unvisitedNodes = [];
    const distances = {};
    const previousNodes = {};
    
    for (let row of grid) {
        for (let node of row) {
            distances[node.id] = Infinity;
            previousNodes[node.id] = null;
            unvisitedNodes.push(node);
        }
    }
    
    distances[startNode.id] = 0;

    while (unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => distances[a.id] - distances[b.id]);
        const currentNode = unvisitedNodes.shift();

        if (currentNode === endNode) {
            const shortestPath = [];
            let current = endNode;

            while (current) {
                shortestPath.unshift(current);
                current = previousNodes[current.id];
            }
            return shortestPath;
        }

        const neighbors = currentNode.neighbors;
        for (let neighbor of neighbors) {
            const distance = distances[currentNode.id] + 1; // Assuming uniform weight
            if (distance < distances[neighbor.id]) {
                distances[neighbor.id] = distance;
                previousNodes[neighbor.id] = currentNode;
            }
        }
    }
    return [];
}

export default dijkstra;