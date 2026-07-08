document.addEventListener("DOMContentLoaded", () => {
    const width = 1000; 
    const height = 1000; 
    const outerRadius = 281; 
    const innerRadius = outerRadius - 3; 
    const segmentColor = "var(--theme-primary)"; 
    const cornerRadius = 15; 
    const glowIntensity = 0; 
  
    
    const segments = [
      { start: 15, end: 69 },
      { start: 111, end: 165 },
      { start: 194.5, end: 249 },
      { start: 291, end: 346 },
    ];
  
    
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    
    const svg = d3
      .select("#c8")
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
  