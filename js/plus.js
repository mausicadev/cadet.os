document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
  
    // Define a grid to avoid overlap
    const gridSize = 40; // Pixels between pluses
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const columns = Math.floor(screenWidth / gridSize);
    const rows = Math.floor(screenHeight / gridSize);
  
    // Create grid cells to track filled positions
    const grid = new Array(rows).fill(null).map(() => new Array(columns).fill(false));
  
    const createPlus = () => {
      const plus = document.createElement("div");
      plus.classList.add("plus");
      plus.textContent = "+";
  
      // Find a random empty position in the grid
      let placed = false;
      while (!placed) {
        const col = Math.floor(Math.random() * columns);
        const row = Math.floor(Math.random() * rows);
  
        if (!grid[row][col]) {
          grid[row][col] = true;
          const x = col * gridSize;
          const y = row * gridSize;
  
          plus.style.left = `${x}px`;
          plus.style.top = `${y}px`;
          plus.style.animationDelay = `${Math.random() * 5}s`;
  
          container.appendChild(plus);
  
          // Automatically clear grid position after 6 seconds
          setTimeout(() => {
            grid[row][col] = false;
            plus.remove();
          }, 8000);
  
          placed = true;
        }
      }
    };
  
    // Create pluses at random intervals
    setInterval(createPlus, 40); // Faster interval for more pluses
  });

