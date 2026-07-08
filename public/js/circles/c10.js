document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; 
    const height = 1000; 
    const outerRadius = 259; 
    const innerRadius = outerRadius - 2; 
    const segmentColor = "var(--theme-primary)"; 
    const cornerRadius = 3; 
    const glowIntensity = 3; 
  
    
    const segments = [
      { start: 45, end: 64 },
      { start: 116, end: 135 },
      { start: 225, end: 244 },
      { start: 295.5, end: 314.5 },
    ];
  
    
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    
    const svg = d3
      .select("#c10")
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
        .attr("fill", segmentColor).attr("fill-opacity", 0.4)
        .attr("filter", "url(#glow)"); 
    });
  });
  