# 🗺️ Pathfinding Algorithm Visualizer

A stunning, interactive web application that brings pathfinding algorithms to life! Watch as algorithms explore grids, find optimal paths, and navigate through custom mazes in real-time.

![App Demo](./assets/demo.gif)
*Experience pathfinding algorithms in action*

## ✨ Features

### 🔍 Pathfinding Algorithms
- **Dijkstra's Algorithm** - Guarantees shortest path, explores uniformly
- **A* Search** - Intelligent heuristic-based pathfinding
- **Breadth-First Search (BFS)** - Layer-by-layer exploration
- **Depth-First Search (DFS)** - Deep exploration strategy
- **Bidirectional Dijkstra** - Searches from both ends simultaneously

### 🏗️ Maze Generation
- **Recursive Division** - Creates complex, solvable mazes
- **Random Maze** - Generates random wall patterns
- **Staircase Pattern** - Simple diagonal maze structure

### ⚡ Interactive Features
- **Dynamic Grid** - Responsive grid that adapts to screen size
- **Real-time Editing** - Click and drag to create walls
- **Speed Controls** - Three speed levels (Slow, Medium, Fast)
- **Node Placement** - Easy start and end point selection
- **Visual Feedback** - Color-coded path exploration and results

### 🎨 User Experience
- **Dark Mode** - Eye-friendly dark theme with persistent settings
- **Smooth Animations** - Satisfying visual algorithm execution
- **Responsive Design** - Works seamlessly on all devices
- **Intuitive Controls** - Simple, user-friendly interface

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pathfinding-visualizer.git
   cd pathfinding-visualizer
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 🎮 How to Use

1. **Set Start & End Points**
   - Click "Add Start Node" and click on the grid
   - Click "Add End Node" and click on the grid

2. **Create Obstacles**
   - Click and drag on empty cells to create walls
   - Or use the maze generation tools

3. **Choose Algorithm**
   - Select from the dropdown menu
   - Each algorithm has unique characteristics

4. **Visualize**
   - Click "Visualize" to watch the algorithm work
   - Adjust speed using the speed selector

5. **Generate Mazes**
   - Use the maze generator for interesting challenges
   - Try different maze types for variety

## 🧠 Algorithm Details

| Algorithm | Time Complexity | Space Complexity | Guarantees Shortest Path |
|-----------|----------------|------------------|-------------------------|
| Dijkstra | O((V + E) log V) | O(V) | ✅ Yes |
| A* | O(b^d) | O(b^d) | ✅ Yes (with admissible heuristic) |
| BFS | O(V + E) | O(V) | ✅ Yes (unweighted) |
| DFS | O(V + E) | O(V) | ❌ No |
| Bi-Dijkstra | O((V + E) log V) | O(V) | ✅ Yes |

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: Modular ES6+ with separate algorithm files
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Storage**: Local Storage for user preferences

## 📁 Project Structure

```
pathfinding-visualizer/
├── index.html              # Main HTML file
├── styles.css              # Global styles and themes
├── app.js                  # Main application logic
├── algorithms/             # Algorithm implementations
│   ├── dijkstra.js
│   ├── astar.js
│   ├── bfs.js
│   ├── dfs.js
│   └── bidirectional.js
├── mazegenerators/         # Maze generation algorithms
│   ├── recursive.js
│   └── randommaze.js
└── assets/                 # Images and demos
    └── demo.gif
```

## 🎯 Future Enhancements

- [ ] Additional algorithms (Greedy Best-First, Jump Point Search)
- [ ] Weighted nodes for more complex pathfinding
- [ ] Save/load grid configurations
- [ ] Algorithm performance metrics
- [ ] Mobile touch controls optimization
- [ ] Export visualization as GIF/video

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic pathfinding visualizers
- Built with modern web technologies
- Thanks to the computer science community for algorithm research

## 📸 Screenshots

### Light Mode
![Light Mode](./assets/light-mode.png)

### Dark Mode
![Dark Mode](./assets/dark-mode.png)

### Algorithm in Action
![Algorithm Demo](./assets/algorithm-demo.png)

---

⭐ **Star this repository if you found it helpful!**

🔗 **[Live Demo](https://yourusername.github.io/pathfinding-visualizer)**
