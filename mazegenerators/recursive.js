/**
 * Recursive Division Maze Generator
 * @param {number} rows - number of rows in the grid
 * @param {number} cols - number of columns in the grid
 * @returns {Array<{row: number, col: number}>} - array of wall positions
 */
function recursiveDivisionMaze(rows, cols) {
    const walls = [];

    // Add border walls
    for (let r = 0; r < rows; r++) {
        walls.push({ row: r, col: 0 });
        walls.push({ row: r, col: cols - 1 });
    }
    for (let c = 0; c < cols; c++) {
        walls.push({ row: 0, col: c });
        walls.push({ row: rows - 1, col: c });
    }

    function divide(rStart, rEnd, cStart, cEnd, orientation) {
        if (rEnd - rStart < 2 || cEnd - cStart < 2) return;

        if (orientation === 'horizontal') {
            // Choose a random even row for the wall
            let possibleRows = [];
            for (let r = rStart + 1; r < rEnd; r += 2) possibleRows.push(r);
            if (possibleRows.length === 0) return;
            const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

            // Choose a random odd col for the passage
            let possibleCols = [];
            for (let c = cStart; c <= cEnd; c += 2) possibleCols.push(c);
            const passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

            for (let c = cStart; c <= cEnd; c++) {
                if (c !== passageCol) {
                    walls.push({ row: wallRow, col: c });
                }
            }
            divide(rStart, wallRow - 1, cStart, cEnd, chooseOrientation(wallRow - 1 - rStart, cEnd - cStart));
            divide(wallRow + 1, rEnd, cStart, cEnd, chooseOrientation(rEnd - (wallRow + 1), cEnd - cStart));
        } else {
            // Choose a random even col for the wall
            let possibleCols = [];
            for (let c = cStart + 1; c < cEnd; c += 2) possibleCols.push(c);
            if (possibleCols.length === 0) return;
            const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

            // Choose a random odd row for the passage
            let possibleRows = [];
            for (let r = rStart; r <= rEnd; r += 2) possibleRows.push(r);
            const passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

            for (let r = rStart; r <= rEnd; r++) {
                if (r !== passageRow) {
                    walls.push({ row: r, col: wallCol });
                }
            }
            divide(rStart, rEnd, cStart, wallCol - 1, chooseOrientation(rEnd - rStart, wallCol - 1 - cStart));
            divide(rStart, rEnd, wallCol + 1, cEnd, chooseOrientation(rEnd - rStart, cEnd - (wallCol + 1)));
        }
    }

    function chooseOrientation(height, width) {
        if (width < height) return 'horizontal';
        else if (height < width) return 'vertical';
        else return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    divide(1, rows - 2, 1, cols - 2, chooseOrientation(rows - 2, cols - 2));
    return walls;
}

export default recursiveDivisionMaze;
