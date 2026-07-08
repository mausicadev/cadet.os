function setProgress(circle, percentage, labelElement) {
    const radius = circle.getAttribute("r");
    const circumference = 2 * Math.PI * radius;
  
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference - (percentage / 100) * circumference}`;
    
    
    labelElement.textContent = ``; 
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const circles = document.querySelectorAll(".loading-ring-value");
    const labels = document.querySelectorAll(".loading-label");
  
    setProgress(circles[0], 77, labels[0]); 
    setProgress(circles[1], 53, labels[1]); 
    setProgress(circles[2], 31, labels[2]); 
  });
  