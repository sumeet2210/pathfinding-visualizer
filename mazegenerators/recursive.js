class RecursiveMaze {
    constructor(width, height) {
        this.width = width % 2 === 0 ? width + 1 : width;
        this.height = height % 2 === 0 ? height + 1 : height;
        this.walls = [];  // Store wall coordinates instead of grid
    }

    generate() {
        // Initialize walls array
        this.walls = [];
        
        // Add border walls
        for (let i = 0; i < this.height; i++) {
            this.addWall(i, 0);
            this.addWall(i, this.width - 1);
        }
        for (let j = 0; j < this.width; j++) {
            this.addWall(0, j);
            this.addWall(this.height - 1, j);
        }

        // Start recursive division
        this.divide(1, this.height - 2, 1, this.width - 2, this.chooseOrientation(this.height - 2, this.width - 2));
        return this.walls;
    }

    addWall(row, col) {
        this.walls.push({row, col});
    }

    divide(startY, endY, startX, endX, orientation) {
        if (endX - startX < 2 || endY - startY < 2) return;

        if (orientation === 'horizontal') {
            const y = Math.floor(startY + (Math.random() * (endY - startY)) / 2) * 2 + 1;
            const hole = Math.floor(startX + (Math.random() * (endX - startX + 1)) / 2) * 2;
            
            for (let x = startX; x <= endX; x++) {
                if (x !== hole) this.addWall(y, x);
            }

            this.divide(startY, y - 1, startX, endX, this.chooseOrientation(y - 1 - startY, endX - startX));
            this.divide(y + 1, endY, startX, endX, this.chooseOrientation(endY - (y + 1), endX - startX));
        } else {
            const x = Math.floor(startX + (Math.random() * (endX - startX)) / 2) * 2 + 1;
            const hole = Math.floor(startY + (Math.random() * (endY - startY + 1)) / 2) * 2;
            
            for (let y = startY; y <= endY; y++) {
                if (y !== hole) this.addWall(y, x);
            }

            this.divide(startY, endY, startX, x - 1, this.chooseOrientation(endY - startY, x - 1 - startX));
            this.divide(startY, endY, x + 1, endX, this.chooseOrientation(endY - startY, endX - (x + 1)));
        }
    }

    chooseOrientation(height, width) {
        if (width < height) return 'horizontal';
        else if (height < width) return 'vertical';
        else return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }
}

export default RecursiveMaze;