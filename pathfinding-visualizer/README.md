# Pathfinding Visualizer

This project is a pathfinding visualizer that allows users to visualize different pathfinding algorithms in action. Users can select from various algorithms, set start and end nodes, clear the grid, and see the pathfinding process unfold in real-time.

## Table of Contents

- [Features](#features)
- [Algorithms](#algorithms)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)

## Features

- Select from multiple pathfinding algorithms: Dijkstra, Breadth-First Search (BFS), and Depth-First Search (DFS).
- Choose start and end nodes on the grid.
- Clear the grid to reset the visualizer.
- Visualize the pathfinding process step-by-step.

## Algorithms

1. **Dijkstra's Algorithm**: This algorithm finds the shortest path from the start node to the end node by exploring all possible paths and selecting the most efficient one.
2. **Breadth-First Search (BFS)**: BFS explores all neighboring nodes at the present depth prior to moving on to nodes at the next depth level, ensuring the shortest path in an unweighted grid.
3. **Depth-First Search (DFS)**: DFS explores as far as possible along each branch before backtracking, which can be useful for finding a path but does not guarantee the shortest path.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `src/index.html` in a web browser to view the visualizer.

## Usage

- Select an algorithm from the dropdown menu.
- Click on the grid to set the start and end nodes.
- Click the "Visualize" button to see the pathfinding process.
- Use the "Clear" button to reset the grid and start over.