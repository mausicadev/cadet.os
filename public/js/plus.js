document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  if (!container) return;

  const cellSize = 40;
  const columns = Math.floor(window.innerWidth / cellSize);
  const rows = Math.floor(window.innerHeight / cellSize);
  const occupiedCells = new Array(rows).fill(null).map(() => new Array(columns).fill(false));

  const createPlus = () => {
    const plus = document.createElement('div');
    plus.classList.add('plus');
    plus.textContent = '+';

    let placed = false;

    while (!placed) {
      const col = Math.floor(Math.random() * columns);
      const row = Math.floor(Math.random() * rows);

      if (occupiedCells[row][col]) continue;

      occupiedCells[row][col] = true;
      const x = col * cellSize;
      const y = row * cellSize;

      plus.style.left = `${x}px`;
      plus.style.top = `${y}px`;
      plus.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(plus);

      setTimeout(() => {
        occupiedCells[row][col] = false;
        plus.remove();
      }, 8000);

      placed = true;
    }
  };

  setInterval(createPlus, 40);
});

