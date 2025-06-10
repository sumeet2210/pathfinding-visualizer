/**
 * Generates a random maze by randomly placing walls.
 * @param {number} rows - number of rows in the grid
 * @param {number} cols - number of columns in the grid
 * @param {number} [density=0.3] - fraction of cells to be walls (0 to 1)
 * @returns {Array<{row: number, col: number}>} - array of wall positions
 */
function randomMaze(rows, cols, density = 0.33) {
    const walls = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Skip borders if you want open edges, or include them for closed
            if (Math.random() < density) {
                walls.push({ row: r, col: c });
            }
        }
    }
    return walls;
}

// No changes needed here, speed handling is done in app.js animation logic

export default randomMaze;
