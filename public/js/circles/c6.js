document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; 
    const height = 1000; 
    const outerRadius = 283; 
    const innerRadius = outerRadius - 3; 
    const segmentColor = "var(--theme-primary)"; 
    const cornerRadius = 5; 
    const glowIntensity = 5; 
  
    
    const segments = [
      { start: 69.5, end: 77.5 },
      { start: 100.5, end: 110.5 },
      { start: 249.5, end: 259.5 },
      { start: 280.5, end: 290.5 },
    ];
  
    
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    
    const svg = d3
      .select("#c6")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    
    const defs = svg.append("defs");
  
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
  
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", glowIntensity);
  
    filter
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["SourceGraphic", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);
  
    
    segments.forEach(({ start, end }) => {
      const startAngle = toRadians(start);
      const endAngle = toRadians(end);
  
      
      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .cornerRadius(cornerRadius); 
  
      
      svg
        .append("path")
        .attr("d", arc)
        .attr("fill", segmentColor)
        .attr("filter", "url(#glow)"); 
    });
  });
  