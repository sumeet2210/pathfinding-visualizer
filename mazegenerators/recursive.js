function recursiveDivisionMaze(rows, cols) {
    // Ensure odd dimensions for better maze structure
    if (rows % 2 === 0) rows--;
    if (cols % 2 === 0) cols--;

    // Initialize grid with 0 (empty)
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const walls = [];

    // Add outer walls
    for (let r = 0; r < rows; r++) {
        grid[r][0] = 1;
        grid[r][cols - 1] = 1;
        walls.push({ row: r, col: 0 });
        walls.push({ row: r, col: cols - 1 });
    }
    for (let c = 0; c < cols; c++) {
        grid[0][c] = 1;
        grid[rows - 1][c] = 1;
        walls.push({ row: 0, col: c });
        walls.push({ row: rows - 1, col: c });
    }

    function divide(rStart, rEnd, cStart, cEnd, orientation) {
        if (rEnd - rStart < 2 || cEnd - cStart < 2) return;

        if (orientation === 'horizontal') {
            // Choose a random even row for the wall
            let possibleRows = [];
            for (let r = rStart + 1; r < rEnd; r += 2) possibleRows.push(r);
            const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

            // Choose a random odd col for the passage
            let possibleCols = [];
            for (let c = cStart; c <= cEnd; c += 2) possibleCols.push(c);
            const passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

            for (let c = cStart; c <= cEnd; c++) {
                if (c !== passageCol) {
                    grid[wallRow][c] = 1;
                    walls.push({ row: wallRow, col: c });
                }
            }
            divide(rStart, wallRow - 1, cStart, cEnd, chooseOrientation(wallRow - 1 - rStart, cEnd - cStart));
            divide(wallRow + 1, rEnd, cStart, cEnd, chooseOrientation(rEnd - (wallRow + 1), cEnd - cStart));
        } else {
            // Choose a random even col for the wall
            let possibleCols = [];
            for (let c = cStart + 1; c < cEnd; c += 2) possibleCols.push(c);
            const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

            // Choose a random odd row for the passage
            let possibleRows = [];
            for (let r = rStart; r <= rEnd; r += 2) possibleRows.push(r);
            const passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

            for (let r = rStart; r <= rEnd; r++) {
                if (r !== passageRow) {
                    grid[r][wallCol] = 1;
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

    divide(0, rows - 1, 0, cols - 1, chooseOrientation(rows - 1, cols - 1));
    return walls;
}

export default recursiveDivisionMaze;