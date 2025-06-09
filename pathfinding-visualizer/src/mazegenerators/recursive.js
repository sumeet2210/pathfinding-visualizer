export function generateRecursiveMaze(gridData) {
    const rows = gridData.length;
    const cols = gridData[0].length;

    function divide(rowStart, rowEnd, colStart, colEnd) {
        if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
            return;
        }

        const horizontal = Math.random() < 0.5;
        let wallRow, wallCol;

        if (horizontal) {
            wallRow = rowStart + Math.floor(Math.random() * (rowEnd - rowStart - 1)) + 1;
            // Draw horizontal wall
            for (let i = colStart; i < colEnd; i++) {
                gridData[wallRow][i] = 'wall';
            }
            // Create a passage
            const passageCol = colStart + Math.floor(Math.random() * (colEnd - colStart));
            gridData[wallRow][passageCol] = 0;
            divide(rowStart, wallRow, colStart, colEnd);
            divide(wallRow + 1, rowEnd, colStart, colEnd);
        } else {
            wallCol = colStart + Math.floor(Math.random() * (colEnd - colStart - 1)) + 1;
            // Draw vertical wall
            for (let i = rowStart; i < rowEnd; i++) {
                gridData[i][wallCol] = 'wall';
            }
            // Create a passage
            const passageRow = rowStart + Math.floor(Math.random() * (rowEnd - rowStart));
            gridData[passageRow][wallCol] = 0;
            divide(rowStart, rowEnd, colStart, wallCol);
            divide(rowStart, rowEnd, wallCol + 1, colEnd);
        }
    }

    // Fill the grid with walls
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            gridData[i][j] = 'wall';
        }
    }

    divide(0, rows, 0, cols);

    return gridData;
}
